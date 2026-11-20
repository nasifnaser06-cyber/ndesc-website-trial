/**
 * NESSX registration: the Google Sheet side.
 *
 * Lives in Extensions > Apps Script of the club's registration Sheet, next to Logic.gs.
 * Deployed as a web app ("Execute as: Me", "Who has access: Anyone"). The website and the
 * payment phone both send to that one web address:
 *
 *   {"action":"register", ...form fields}        from the Register page
 *   {"action":"status", "phone":..., "trxId":...} from "Check my registration"
 *   {"action":"sms", "key":..., "text":...}       from the SMS forwarder on the payment phone
 *
 * First time: run setup() once from the editor. See registration/README.md.
 */

var SHEETS = {
  REG: 'Registrations',
  PAY: 'Payments',
  REVIEW: 'Needs review',
  UNREAD: 'Unread SMS',
  SETTINGS: 'Settings',
};

var REG_COLS = ['Reg ID', 'Submitted', 'Status', 'Pass', 'Name', 'Email', 'Phone', 'Institution', 'Class',
  'Category', 'Segments', 'Team code', 'Parent name', 'Parent phone', 'Wallet', 'TrxID', 'Paid from',
  'Participant ID', 'Check code', 'Pass email', 'Review reason', 'Team notes'];
var PAY_COLS = ['Received', 'Wallet', 'Kind', 'Amount', 'From', 'TrxID', 'SMS time', 'Used by'];

var DEFAULT_SETTINGS = [
  ['Registration open', 'TRUE', 'TRUE or FALSE. FALSE closes the form on the website.'],
  ['Solo price', '200', 'Tk'],
  ['Team price', '300', 'Tk per person'],
  ['bKash number', '', 'The club number people send money to'],
  ['Nagad number', '', 'Leave blank if Nagad is not used'],
  ['SMS key', '', 'Secret. Made by setup(). The phone forwarder must send it.'],
  ['Alert email', '', 'Who hears about problems: no SMS for hours, unreadable SMS'],
  ['Alert after hours', '6', 'No SMS for this long between 8am and 11pm sends an alert'],
  ['Email from name', 'NESSX Team', ''],
  ['Reply-to email', 'ndesc.organizers.2027@gmail.com', ''],
  ['QR image service', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=', 'Gets only the random check code, never names or numbers. Blank = no QR image.'],
  ['Website', 'https://ndesc.com/ness/', ''],
];

// ---------------------------------------------------------------- web app

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    body = {};
  }
  // SMS forwarder apps sometimes send form fields or query parameters instead of JSON.
  var params = (e && e.parameter) || {};
  Object.keys(params).forEach(function (k) { if (body[k] === undefined) body[k] = params[k]; });

  var out;
  try {
    if (body.action === 'register') out = handleRegister(body);
    else if (body.action === 'status') out = handleStatus(body);
    else if (body.action === 'sms' || body.text) out = handleSms(body);
    else out = { ok: false, error: 'Unknown request.' };
  } catch (err) {
    console.error(err);
    out = { ok: false, error: 'Something went wrong on our side. Please try again in a minute.' };
  }
  return json(out);
}

/** The website reads this to know whether registration is open and which numbers to show. */
function doGet() {
  var s = settings();
  return json({
    ok: true,
    open: s['Registration open'] === 'TRUE',
    prices: { solo: Number(s['Solo price']), team: Number(s['Team price']), online: 0 },
    bkash: s['bKash number'] || '',
    nagad: s['Nagad number'] || '',
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------- register

function handleRegister(b) {
  var s = settings();
  if (s['Registration open'] !== 'TRUE') return { ok: false, error: 'Registration is closed.' };

  var r = {
    pass: String(b.pass || ''),
    name: clean(b.name, 80),
    email: clean(b.email, 120).toLowerCase(),
    phone: normPhone(b.phone),
    institution: clean(b.institution, 120),
    className: clean(b.className, 40),
    category: String(b.category || ''),
    segments: [],
    teamCode: clean(b.teamCode, 6).toUpperCase(),
    parentName: '',
    parentPhone: '',
    wallet: String(b.wallet || ''),
    trxId: normTrx(b.trxId),
    sender: normPhone(b.sender),
    consent: b.consent === true || b.consent === 'true',
  };
  if (r.pass === 'online') { r.wallet = ''; r.trxId = ''; r.sender = ''; }
  r.segments = [passIncludes(r.pass)];
  var errors = validateRegistration(r);
  if (errors.length) return { ok: false, errors: errors };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet(SHEETS.REG);
    var rows = readRegs();

    // Same person sending the same form twice: answer with the first one.
    var dup = rows.filter(function (x) {
      return x.phone === r.phone && x.pass === r.pass && (r.pass === 'online' ? x.email === r.email : x.trxId === r.trxId);
    })[0];
    if (dup) return { ok: true, regId: dup.id, status: dup.status, duplicate: true };

    // No team codes (20 Nov 2026): team pass holders form teams of up to 3 at the summit.
    // The Team code column stays in the sheet, left blank.
    r.teamCode = '';

    var id = 'R' + Utilities.formatDate(new Date(), 'Asia/Dhaka', 'yyMMdd') + '-' + newCode(5, rows.map(function (x) { return x.id; }));
    sh.appendRow([id, new Date(), 'Waiting', r.pass, r.name, r.email, "'" + r.phone, r.institution, r.className,
      r.category, r.segments.join(', '), r.teamCode, r.parentName, r.parentPhone ? "'" + r.parentPhone : '',
      r.wallet, r.trxId, r.sender ? "'" + r.sender : '', '', '', '', '', '']);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  if (r.pass !== 'online') sendReceivedEmail(r, id);
  runMatcher(); // pays may already be in; a free pass is verified now
  var now = readRegs().filter(function (x) { return x.id === id; })[0];
  return { ok: true, regId: id, status: now ? now.status : 'Waiting' };
}

// ---------------------------------------------------------------- status lookup

function handleStatus(b) {
  var phone = normPhone(b.phone), trx = normTrx(b.trxId), email = clean(b.email, 120).toLowerCase();
  if (!phone || (!trx && !email)) return { ok: false, error: 'Enter your phone number and your TrxID (or email for a free registration).' };
  var match = readRegs().filter(function (x) {
    return x.phone === phone && ((trx && x.trxId === trx) || (email && x.email === email));
  });
  if (!match.length) return { ok: false, error: 'No registration found with those details.' };
  var r = match[match.length - 1];
  if (b.resend && r.status === 'Verified') sendPassEmail(r, true);
  return {
    ok: true,
    regId: r.id,
    status: r.status,
    participantId: r.status === 'Verified' ? r.participantId : '',
    reason: r.status === 'Needs review' ? 'Our team is checking your payment.' : '',
    resent: !!(b.resend && r.status === 'Verified'),
  };
}

// ---------------------------------------------------------------- SMS from the payment phone

function handleSms(b) {
  var s = settings();
  if (!s['SMS key'] || String(b.key || '') !== s['SMS key']) return { ok: false, error: 'Not allowed.' };
  var p = parseBkashSms(b.text);
  var props = PropertiesService.getScriptProperties();
  props.setProperty('lastSmsMs', String(Date.now()));

  if (p.ignored) return { ok: true, ignored: true };
  if (!p.ok) {
    sheet(SHEETS.UNREAD).appendRow([new Date(), p.raw]);
    sendAlert('An SMS with a TrxID could not be read', 'It is in the "Unread SMS" tab. If bKash changed its wording, the reader needs an update.\n\n' + p.raw);
    return { ok: true, unread: true };
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var already = readPays().some(function (x) { return x.trxId === p.trxId; });
    if (!already) {
      sheet(SHEETS.PAY).appendRow([new Date(), p.wallet, p.kind, p.amount, "'" + p.from, p.trxId, p.time, '']);
      SpreadsheetApp.flush();
    }
  } finally {
    lock.releaseLock();
  }
  runMatcher();
  return { ok: true, trxId: p.trxId };
}

// ---------------------------------------------------------------- matching (also runs every 5 minutes)

function runMatcher() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  var toEmail = [], toReview = [];
  try {
    var s = settings();
    var prices = { solo: Number(s['Solo price']), team: Number(s['Team price']), online: 0 };
    var regs = readRegs(), pays = readPays();
    var d = decide(regs, pays, prices, Date.now());
    var sh = sheet(SHEETS.REG), psh = sheet(SHEETS.PAY);
    var byId = {};
    regs.forEach(function (r) { byId[r.id] = r; });

    d.verify.forEach(function (v) {
      var r = byId[v.id];
      r.status = 'Verified';
      r.participantId = nextParticipantId(r.category);
      r.checkCode = newCode(10, []);
      sh.getRange(r.row, col('Status')).setValue('Verified');
      sh.getRange(r.row, col('Participant ID')).setValue(r.participantId);
      sh.getRange(r.row, col('Check code')).setValue(r.checkCode);
      sh.getRange(r.row, col('Review reason')).setValue('');
      if (v.trxId) markPaymentUsed(psh, pays, v.trxId, r.id);
      toEmail.push(r);
    });
    d.review.forEach(function (v) {
      var r = byId[v.id];
      sh.getRange(r.row, col('Status')).setValue('Needs review');
      sh.getRange(r.row, col('Review reason')).setValue(v.reason);
      toReview.push(r);
    });
    SpreadsheetApp.flush();

    // Passes that could not be emailed earlier (daily email limit) go out now.
    readRegs().forEach(function (r) {
      if (r.status === 'Verified' && r.emailState === 'Queued' && toEmail.indexOf(r) < 0) toEmail.push(r);
    });
  } finally {
    lock.releaseLock();
  }
  toEmail.forEach(function (r) { sendPassEmail(r, false); });
  toReview.forEach(function (r) { sendReviewEmail(r); });
  checkPhoneAlive();
}

function markPaymentUsed(psh, pays, trxId, regId) {
  for (var i = 0; i < pays.length; i++) {
    if (pays[i].trxId === trxId) {
      var cell = psh.getRange(pays[i].row, PAY_COLS.indexOf('Used by') + 1);
      var cur = String(cell.getValue() || '');
      cell.setValue(cur ? cur + ', ' + regId : regId);
      return;
    }
  }
}

// ---------------------------------------------------------------- emails

function sendReceivedEmail(r, id) {
  var s = settings();
  mail(r.email, 'NESSX: registration received (' + id + ')',
    '<p>Hi ' + esc(r.name) + ',</p>' +
    '<p>We have your NESSX registration. We are now matching your payment (TrxID <b>' + esc(r.trxId) + '</b>). ' +
    'Your pass usually arrives within a few minutes. Please do not pay again.</p>' +
    '<p>Check your status any time: ' + esc(s['Website']) + 'register/</p>' +
    '<p>NESSX Team<br>Notre Dame Eco and Space Club</p>', false);
}

function sendReviewEmail(r) {
  mail(r.email, 'NESSX: we are checking your payment',
    '<p>Hi ' + esc(r.name) + ',</p>' +
    '<p>We could not match your payment automatically, so a member of our team will check it by hand, usually within a day. ' +
    'You do not need to do anything now. If we need something from you, we will reply to this email.</p>' +
    '<p>Registration ' + esc(r.id) + ', TrxID ' + esc(r.trxId || 'none') + '.</p>' +
    '<p>NESSX Team<br>Notre Dame Eco and Space Club</p>', false);
}

function sendPassEmail(r, isResend) {
  var s = settings();
  if (MailApp.getRemainingDailyQuota() < 1) {
    sheet(SHEETS.REG).getRange(r.row, col('Pass email')).setValue('Queued');
    return;
  }
  var passName = r.pass === 'team' ? 'Team Pass' : r.pass === 'online' ? 'Online Submission' : 'Solo Pass';
  var qrBase = s['QR image service'];
  var qr = qrBase ? '<p><img src="' + qrBase + encodeURIComponent(r.checkCode) + '" width="220" height="220" alt="Your pass QR code"></p>' : '';
  var html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">' +
    '<p>Hi ' + esc(r.name) + ',</p>' +
    '<p>You are registered for <b>NESSX, the 10th National Earth and Space Summit</b>, 28 to 30 January 2027 at Notre Dame College, Dhaka.</p>' +
    '<table cellpadding="6" style="border-collapse:collapse;border:1px solid #ccc">' +
    row('Participant ID', '<b style="font-size:20px">' + esc(r.participantId) + '</b>') +
    row('Pass', passName) +
    row('Category', esc(r.category)) +
    row('Institution', esc(r.institution)) +
    row('Your pass includes', esc(r.segments)) +
    row('Check code', '<span style="font-family:monospace;font-size:18px">' + esc(r.checkCode) + '</span>') +
    '</table>' + qr +
    (r.pass === 'team' ? '<p>With a team pass you can form a team of up to 3 team pass holders at the summit.</p>' : '') +
    '<p>Show this email (or the QR code) at the gate. Bring your student ID card.</p>' +
    '<p>NESSX Team<br>Notre Dame Eco and Space Club</p></div>';
  var sent = mail(r.email, 'Your NESSX ' + passName + ', ' + r.participantId + (isResend ? ' (sent again)' : ''), html, true);
  sheet(SHEETS.REG).getRange(r.row, col('Pass email')).setValue(sent ? 'Sent ' + Utilities.formatDate(new Date(), 'Asia/Dhaka', 'd MMM HH:mm') : 'Queued');
}

function row(k, v) {
  return '<tr><td style="border:1px solid #ccc;color:#555">' + k + '</td><td style="border:1px solid #ccc">' + v + '</td></tr>';
}

function mail(to, subject, html, important) {
  var s = settings();
  if (!to) return false;
  if (MailApp.getRemainingDailyQuota() < (important ? 1 : 5)) return false; // keep the last few for passes
  MailApp.sendEmail({ to: to, subject: subject, htmlBody: html, name: s['Email from name'] || 'NESSX Team', replyTo: s['Reply-to email'] || undefined });
  return true;
}

// ---------------------------------------------------------------- alerts

function checkPhoneAlive() {
  var s = settings();
  if (s['Registration open'] !== 'TRUE' || !s['Alert email']) return;
  var hour = Number(Utilities.formatDate(new Date(), 'Asia/Dhaka', 'H'));
  if (hour < 8 || hour >= 23) return;
  var props = PropertiesService.getScriptProperties();
  var last = Number(props.getProperty('lastSmsMs') || 0);
  var lastAlert = Number(props.getProperty('lastAlertMs') || 0);
  var hours = Number(s['Alert after hours'] || 6);
  if (last && Date.now() - last > hours * 3600e3 && Date.now() - lastAlert > hours * 3600e3) {
    sendAlert('No payment SMS for ' + hours + ' hours', 'Check the payment phone: is it on, charged, online, and is the forwarder app running?');
    props.setProperty('lastAlertMs', String(Date.now()));
  }
}

function sendAlert(subject, text) {
  var to = settings()['Alert email'];
  if (to) MailApp.sendEmail(to, 'NESSX registration alert: ' + subject, text);
}

// ---------------------------------------------------------------- sheet helpers

function sheet(name) {
  return SpreadsheetApp.getActive().getSheetByName(name);
}

function col(name) {
  return REG_COLS.indexOf(name) + 1;
}

function settings() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('settings');
  if (hit) return JSON.parse(hit);
  var vals = sheet(SHEETS.SETTINGS).getDataRange().getValues();
  var s = {};
  vals.slice(1).forEach(function (v) { s[String(v[0]).trim()] = String(v[1]).trim(); });
  s['Registration open'] = String(s['Registration open']).toUpperCase();
  cache.put('settings', JSON.stringify(s), 60);
  return s;
}

/** Clears the cached settings straight after someone edits the Settings tab. */
function onEdit(e) {
  if (e && e.range && e.range.getSheet().getName() === SHEETS.SETTINGS) CacheService.getScriptCache().remove('settings');
}

function readRegs() {
  var vals = sheet(SHEETS.REG).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var v = vals[i];
    if (!v[0]) continue;
    out.push({
      row: i + 1, id: String(v[0]), createdMs: new Date(v[1]).getTime(), status: String(v[2]), pass: String(v[3]),
      name: String(v[4]), email: String(v[5]), phone: normPhone(v[6]), institution: String(v[7]), className: String(v[8]),
      category: String(v[9]), segments: String(v[10]), teamCode: String(v[11]), wallet: String(v[14]),
      trxId: normTrx(v[15]), sender: normPhone(v[16]), participantId: String(v[17]), checkCode: String(v[18]),
      emailState: String(v[19]),
    });
  }
  return out;
}

function readPays() {
  var vals = sheet(SHEETS.PAY).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var v = vals[i];
    if (!v[5]) continue;
    out.push({ row: i + 1, wallet: String(v[1]), kind: String(v[2]), amount: Number(v[3]), from: normPhone(v[4]), trxId: normTrx(v[5]) });
  }
  return out;
}

function nextParticipantId(category) {
  var props = PropertiesService.getScriptProperties();
  var key = 'count_' + category;
  var n = Number(props.getProperty(key) || 0) + 1;
  props.setProperty(key, String(n));
  return 'NESSX-' + category + '-' + ('0000' + n).slice(-4);
}

/** Random code of letters and digits, without look-alikes (0/O, 1/I). */
function newCode(len, taken) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (var tries = 0; tries < 50; tries++) {
    var c = '';
    for (var i = 0; i < len; i++) c += chars.charAt(Math.floor(Math.random() * chars.length));
    if (taken.indexOf(c) < 0) return c;
  }
  throw new Error('Could not make a unique code');
}

function clean(s, max) {
  return String(s || '').replace(/[<>]/g, '').replace(/^[=+\-@]/, "'").trim().slice(0, max);
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------- one-time setup

/** Run once from the Apps Script editor. Safe to run again: it only adds what is missing. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone('Asia/Dhaka');
  var make = function (name, header) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (header && sh.getLastRow() === 0) {
      sh.appendRow(header);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#f3f3f3');
    }
    return sh;
  };
  make(SHEETS.REG, REG_COLS);
  make(SHEETS.PAY, PAY_COLS);
  make(SHEETS.UNREAD, ['Received', 'SMS text']);
  var set = make(SHEETS.SETTINGS, ['Setting', 'Value', 'Notes']);
  var have = set.getDataRange().getValues().map(function (v) { return v[0]; });
  DEFAULT_SETTINGS.forEach(function (d) { if (have.indexOf(d[0]) < 0) set.appendRow(d); });
  // A long random secret for the phone.
  var vals = set.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][0] === 'SMS key' && !vals[i][1]) set.getRange(i + 1, 2).setValue(Utilities.getUuid().replace(/-/g, ''));
  }
  // Review list: a live filter of the Registrations tab, read-only.
  var rev = make(SHEETS.REVIEW, null);
  if (rev.getLastRow() === 0) {
    rev.getRange('A1').setFormula('=QUERY(Registrations!A:V, "select * where C = \'Needs review\'", 1)');
  }
  // Backup matcher every 5 minutes.
  var has = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'runMatcher'; });
  if (!has) ScriptApp.newTrigger('runMatcher').timeBased().everyMinutes(5).create();
  CacheService.getScriptCache().remove('settings');
}

/**
 * For the payment team: after fixing a row in review (for example the person sent the rest of
 * the money, or typed the TrxID wrong), set its Status back to "Waiting" and the matcher will
 * try again. To verify by hand, select the row and run approveSelectedRow().
 */
function approveSelectedRow() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== SHEETS.REG) throw new Error('Select a row in the Registrations tab.');
  var r = sh.getActiveRange().getRow();
  if (r < 2) return;
  var reg = readRegs().filter(function (x) { return x.row === r; })[0];
  reg.status = 'Verified';
  reg.participantId = nextParticipantId(reg.category);
  reg.checkCode = newCode(10, []);
  sh.getRange(r, col('Status')).setValue('Verified');
  sh.getRange(r, col('Participant ID')).setValue(reg.participantId);
  sh.getRange(r, col('Check code')).setValue(reg.checkCode);
  sh.getRange(r, col('Review reason')).setValue('Approved by hand ' + Utilities.formatDate(new Date(), 'Asia/Dhaka', 'd MMM HH:mm'));
  sendPassEmail(reg, false);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('NESSX')
    .addItem('Run matching now', 'runMatcher')
    .addItem('Approve the selected row by hand', 'approveSelectedRow')
    .addToUi();
}
