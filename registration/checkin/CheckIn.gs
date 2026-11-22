/**
 * NESS X check-in: the Apps Script inside the "NESS X Summit" spreadsheet.
 *
 * The scanner page (ndesc.com/scan/) sends every scanned QR code here. This script looks the
 * code up in the registration sheet (read only, never changed), logs the scan in the
 * Check-ins tab and answers one of:
 *   registered       first scan of a verified registration
 *   already          verified, but scanned before (with the time and phone of the first scan)
 *   unpaid           found, but the payment is not verified yet
 *   not_registered   no registration with this code or Participant ID
 *
 * Deployed as a web app: Execute as Me, Who has access Anyone. Requests need the scanner key
 * from the Settings tab, which travels inside the scanner link. See registration/checkin/README.md.
 */

var CHECKIN = {
  LOG: 'Check-ins',
  SETTINGS: 'Settings',
  PARTICIPANTS: 'Participants',
  LOG_COLS: ['Time', 'Participant ID', 'Name', 'Pass', 'Result', 'Phone', 'Scanned value'],
  PASS: { solo: 'Solo pass', team: 'Team pass', online: 'Online segments' },
  RESULT: { registered: 'Registered', already: 'Already scanned', unpaid: 'Payment not confirmed', not_registered: 'Not registered' },
  TZ: 'Asia/Dhaka',
};

// ---------------------------------------------------------------- web app

function doGet() {
  return checkinJson({ ok: true, app: 'NESS X check-in' });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { body = {}; }
  var out;
  try {
    var s = checkinSettings();
    if (!s['Scanner key'] || String(body.key || '') !== s['Scanner key']) out = { ok: false, error: 'This scanner link is not valid. Open the newest link from the NESS X Summit sheet.' };
    else if (body.action === 'ping') out = { ok: true, sheet: SpreadsheetApp.getActive().getName() };
    else if (body.action === 'scan') out = scan(String(body.code || ''), String(body.device || '').slice(0, 40));
    else out = { ok: false, error: 'Unknown request.' };
  } catch (err) {
    console.error(err);
    out = { ok: false, error: 'Something went wrong. Try again.' };
  }
  return checkinJson(out);
}

function checkinJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------- scanning

/** "NESSX-10000", "nessx 10000", "10000" -> "NESSX-10000" (older "NESSX-HS-0042" IDs still work); anything else -> "". */
function normParticipantId(v) {
  var t = String(v || '').toUpperCase().replace(/\s+/g, '');
  var m = t.match(/^(?:NESSX-?)?(\d{5,6})$/);
  if (m) return 'NESSX-' + m[1];
  m = t.match(/^(?:NESSX-?)?(HS|P|J|S)-?0*(\d{1,4})$/);
  return m ? 'NESSX-' + m[1] + '-' + ('0000' + m[2]).slice(-4) : '';
}

function scan(raw, device) {
  var value = String(raw).trim().toUpperCase().replace(/\s+/g, '');
  if (!value) return { ok: false, error: 'Nothing was scanned.' };
  var pid = normParticipantId(value);
  var reg = findRegistration({ pid: pid, code: value });

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var log = checkinSheet(CHECKIN.LOG);
    var now = new Date();
    if (!reg) {
      log.appendRow([now, '', '', '', CHECKIN.RESULT.not_registered, device, value]);
      return { ok: true, result: 'not_registered' };
    }
    var pass = CHECKIN.PASS[reg.pass] || reg.pass;
    var base = { ok: true, name: reg.name, participantId: reg.participantId, pass: pass };
    if (reg.status !== 'Verified') {
      log.appendRow([now, reg.participantId, reg.name, pass, CHECKIN.RESULT.unpaid, device, '']);
      base.result = 'unpaid';
      return base;
    }
    var first = firstCheckIn(log, reg.participantId);
    if (first) {
      log.appendRow([now, reg.participantId, reg.name, pass, CHECKIN.RESULT.already, device, '']);
      base.result = 'already';
      base.firstAt = Utilities.formatDate(first.time, CHECKIN.TZ, 'd MMM, h:mm a');
      base.firstBy = first.device;
      return base;
    }
    log.appendRow([now, reg.participantId, reg.name, pass, CHECKIN.RESULT.registered, device, '']);
    SpreadsheetApp.flush();
    base.result = 'registered';
    base.at = Utilities.formatDate(now, CHECKIN.TZ, 'd MMM, h:mm a');
    return base;
  } finally {
    lock.releaseLock();
  }
}

/** Reads the registration sheet by its header names, so added columns do not break it. */
function findRegistration(q) {
  var link = checkinSettings()['Registration sheet link'];
  if (!link) throw new Error('Put the registration sheet link in Settings.');
  var sh = SpreadsheetApp.openByUrl(link).getSheetByName('Registrations');
  var vals = sh.getDataRange().getValues();
  var h = vals[0].map(function (x) { return String(x).trim(); });
  var c = {
    status: h.indexOf('Status'), pass: h.indexOf('Pass'), name: h.indexOf('Name'),
    pid: h.indexOf('Participant ID'), code: h.indexOf('Check code'),
  };
  for (var i = 1; i < vals.length; i++) {
    var v = vals[i];
    var pid = String(v[c.pid] || '').trim().toUpperCase();
    var code = String(v[c.code] || '').trim().toUpperCase();
    if ((q.pid && pid && pid === q.pid) || (q.code && code && code === q.code)) {
      return { status: String(v[c.status]).trim(), pass: String(v[c.pass]).trim(), name: String(v[c.name]).trim(), participantId: pid };
    }
  }
  return null;
}

function firstCheckIn(log, pid) {
  var vals = log.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][1]) === pid && String(vals[i][4]) === CHECKIN.RESULT.registered) {
      return { time: new Date(vals[i][0]), device: String(vals[i][5] || '') };
    }
  }
  return null;
}

// ---------------------------------------------------------------- helpers

function checkinSheet(name) {
  return SpreadsheetApp.getActive().getSheetByName(name);
}

function checkinSettings() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('checkin-settings');
  if (hit) return JSON.parse(hit);
  var s = {};
  checkinSheet(CHECKIN.SETTINGS).getDataRange().getValues().slice(1).forEach(function (v) {
    s[String(v[0]).trim()] = String(v[1]).trim();
  });
  cache.put('checkin-settings', JSON.stringify(s), 60);
  return s;
}

function onEdit(e) {
  if (e && e.range && e.range.getSheet().getName() === CHECKIN.SETTINGS) CacheService.getScriptCache().remove('checkin-settings');
}

// ---------------------------------------------------------------- setup and menu

/** Run once from the editor. Safe to run again: it only adds what is missing. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(CHECKIN.TZ);

  var log = ss.getSheetByName(CHECKIN.LOG) || ss.insertSheet(CHECKIN.LOG);
  if (log.getLastRow() === 0) {
    log.appendRow(CHECKIN.LOG_COLS);
    log.setFrozenRows(1);
    log.getRange(1, 1, 1, CHECKIN.LOG_COLS.length).setFontWeight('bold').setBackground('#f3f3f3');
    log.getRange('A:A').setNumberFormat('d mmm yyyy, h:mm:ss am/pm');
  }

  var set = ss.getSheetByName(CHECKIN.SETTINGS) || ss.insertSheet(CHECKIN.SETTINGS);
  if (set.getLastRow() === 0) {
    set.appendRow(['Setting', 'Value', 'Notes']);
    set.setFrozenRows(1);
    set.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f3f3f3');
  }
  var have = set.getDataRange().getValues().map(function (v) { return v[0]; });
  [
    ['Registration sheet link', '', 'The address of the NESSX registrations sheet'],
    ['Scanner key', Utilities.getUuid().replace(/-/g, ''), 'Secret. Part of the scanner link. Change it to stop old links working.'],
    ['Scanner page', 'https://ndesc.com/scan/', ''],
    ['Web app link', '', 'From Deploy > Manage deployments: the Web app URL ending in /exec'],
  ].forEach(function (d) { if (have.indexOf(d[0]) < 0) set.appendRow(d); });

  // "Checked in at" next to each name on the Participants tab (columns A to I come from the registration sheet).
  var p = ss.getSheetByName(CHECKIN.PARTICIPANTS);
  if (p) {
    p.getRange('J1').setValue('Checked in at').setFontWeight('bold');
    p.getRange('J2').setFormula("=ARRAYFORMULA(IF(A2:A=\"\",\"\",IFERROR(VLOOKUP(A2:A,FILTER({'Check-ins'!B2:B,'Check-ins'!A2:A},'Check-ins'!E2:E=\"Registered\"),2,FALSE),\"\")))");
    p.getRange('J:J').setNumberFormat('d mmm, h:mm am/pm');
  }
  CacheService.getScriptCache().remove('checkin-settings');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('NESS X check-in')
    .addItem('Show the scanner link', 'showScannerLink')
    .addToUi();
}

/**
 * The link the two scanning phones open. Uses the published web app address from Settings
 * (Google sometimes gives the script its private /dev test address, which the phones cannot use).
 */
function scannerLink() {
  var s = checkinSettings();
  var url = s['Web app link'] || '';
  if (!/\/exec$/.test(url)) {
    var own = ScriptApp.getService().getUrl() || '';
    url = /\/exec$/.test(own) ? own : '';
  }
  var m = url.match(/\/macros\/s\/([^/]+)\/exec$/);
  if (!m) return '';
  return (s['Scanner page'] || 'https://ndesc.com/scan/') + '#' + m[1] + '.' + s['Scanner key'];
}

function showScannerLink() {
  var link = scannerLink();
  var ui = SpreadsheetApp.getUi();
  if (!link) {
    ui.alert('Paste the web app address into Settings > Web app link first. Find it in Apps Script: Deploy > Manage deployments > Web app URL (it ends in /exec).');
    return;
  }
  var html = HtmlService.createHtmlOutput(
    '<p style="font-family:Arial;font-size:14px">Open this link on each scanning phone. Keep it private: anyone with it can check people in.</p>' +
    '<textarea style="width:100%;height:90px;font-size:13px" readonly onclick="this.select()">' + link + '</textarea>'
  ).setWidth(460).setHeight(190);
  ui.showModalDialog(html, 'Scanner link');
}
