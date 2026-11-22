// Checks of the summit check-in script (registration/checkin/CheckIn.gs) with fake Google services.
const fs = require('fs'), path = require('path'), vm = require('vm');
let pass = 0, fail = 0;
const check = (n, c, x) => { if (c) pass++; else { fail++; console.log('FAIL', n, x !== undefined ? JSON.stringify(x) : ''); } };

function sheet(name, rows) {
  const data = rows || [];
  return { data, getName: () => name, appendRow: r => data.push(r), getLastRow: () => data.length, setFrozenRows() {},
    getDataRange: () => ({ getValues: () => data.map(r => r.slice()) }),
    getRange: () => ({ setFontWeight() { return this; }, setBackground() { return this; }, setNumberFormat() { return this; }, setValue() { return this; }, setFormula() { return this; } }) };
}
const regHeader = ['Reg ID', 'Submitted', 'Status', 'Pass', 'Name', 'Email', 'Phone', 'Institution', 'Class', 'Category', 'Segments', 'Team code', 'Parent name', 'Parent phone', 'Wallet', 'TrxID', 'Paid from', 'Participant ID', 'Check code', 'Pass email', 'Review reason', 'Team notes'];
const row = (status, pass, name, pid, code) => { const r = regHeader.map(() => ''); r[2] = status; r[3] = pass; r[4] = name; r[17] = pid; r[18] = code; return r; };
const reg = sheet('Registrations', [regHeader,
  row('Verified', 'solo', 'Ayaan Rahman', 'NESSX-10000', 'K7P2QXM9AB'),
  row('Verified', 'team', 'Nadia Karim', 'NESSX-10001', 'ZZ34PQRS78'),
  row('Waiting', 'solo', 'Imran Hossain', '', 'WAITCODE22'),
  row('Verified', 'online', 'Tania Akter', 'NESSX-10002', 'ONL9NE2345'),
]);
const sheets = {};
const ss = { getName: () => 'NESS X Summit', getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = sheet(n)), setSpreadsheetTimeZone() {} };
sheets.Participants = sheet('Participants');
let devUrl = false;
let clock = new Date('2027-01-28T03:14:00Z');
const ctx = {
  console, JSON, String, Number, Array, Object, Math,
  Date: class extends Date { constructor(...a) { if (a.length) super(...a); else super(clock.getTime()); } },
  SpreadsheetApp: { getActive: () => ss, openByUrl: u => ({ getSheetByName: n => (u === 'https://docs.google.com/spreadsheets/d/REG/edit' && n === 'Registrations' ? reg : null) }), flush() {} },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  CacheService: { getScriptCache: () => ({ get: () => null, put() {}, remove() {} }) },
  Utilities: { getUuid: () => '11112222-3333-4444-5555-666677778888',
    formatDate: (d, tz, f) => { const x = new Date(d.getTime() + 6 * 3600e3); const h = x.getUTCHours(); return x.getUTCDate() + ' Jan, ' + ((h % 12) || 12) + ':' + String(x.getUTCMinutes()).padStart(2, '0') + ' ' + (h < 12 ? 'AM' : 'PM'); } },
  ContentService: { createTextOutput: t => ({ setMimeType: () => JSON.parse(t) }), MimeType: { JSON: 'json' } },
  ScriptApp: { getService: () => ({ getUrl: () => devUrl ? 'https://script.google.com/macros/s/AKfyHEAD456/dev' : 'https://script.google.com/macros/s/AKfyTEST123/exec' }) },
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../checkin/CheckIn.gs'), 'utf8'), ctx);

ctx.setup();
check('setup made tabs', sheets['Check-ins'] && sheets.Settings);
const S = sheets.Settings.data;
S.find(r => r[0] === 'Registration sheet link')[1] = 'https://docs.google.com/spreadsheets/d/REG/edit';
const key = S.find(r => r[0] === 'Scanner key')[1];
check('key made', key.length === 32);
check('own /exec address used when Settings is empty', ctx.scannerLink() === 'https://ndesc.com/scan/#AKfyTEST123.' + key, ctx.scannerLink());
devUrl = true;
check('a /dev address is never used', ctx.scannerLink() === '', ctx.scannerLink());
S.find(r => r[0] === 'Web app link')[1] = 'https://script.google.com/macros/s/AKfyPUBLISHED_9x/exec';
check('Settings web app link wins', ctx.scannerLink() === 'https://ndesc.com/scan/#AKfyPUBLISHED_9x.' + key, ctx.scannerLink());
const post = b => ctx.doPost({ postData: { contents: JSON.stringify(b) } });

check('wrong key refused', post({ action: 'scan', key: 'nope', code: 'K7P2QXM9AB' }).ok === false);
check('ping', post({ action: 'ping', key }).sheet === 'NESS X Summit');
let r = post({ action: 'scan', key, code: 'k7p2qxm9ab ', device: 'Phone 1' });
check('first scan registered', r.result === 'registered' && r.pass === 'Solo pass' && r.name === 'Ayaan Rahman' && r.participantId === 'NESSX-10000', r);
clock = new Date('2027-01-28T04:40:00Z');
r = post({ action: 'scan', key, code: 'K7P2QXM9AB', device: 'Phone 2' });
check('second scan already', r.result === 'already' && r.firstAt === '28 Jan, 9:14 AM' && r.firstBy === 'Phone 1' && r.pass === 'Solo pass', r);
r = post({ action: 'scan', key, code: '10000', device: 'Phone 2' });
check('typed participant ID finds the same person', r.result === 'already', r);
r = post({ action: 'scan', key, code: 'nessx 10001', device: 'Phone 1' });
check('team pass by ID', r.result === 'registered' && r.pass === 'Team pass', r);
r = post({ action: 'scan', key, code: 'ONL9NE2345', device: 'Phone 1' });
check('online pass', r.result === 'registered' && r.pass === 'Online segments', r);
r = post({ action: 'scan', key, code: 'WAITCODE22', device: 'Phone 1' });
check('unpaid', r.result === 'unpaid' && r.name === 'Imran Hossain', r);
r = post({ action: 'scan', key, code: 'https://example.com/some-other-qr', device: 'Phone 1' });
check('unknown code', r.result === 'not_registered' && !r.name, r);
r = post({ action: 'scan', key, code: '   ', device: 'Phone 1' });
check('empty scan', r.ok === false);
const log = sheets['Check-ins'].data;
check('every scan logged', log.length === 1 + 7, log.length);
check('log results', log.slice(1).map(x => x[4]).join('|') === 'Registered|Already scanned|Already scanned|Registered|Registered|Payment not confirmed|Not registered', log.slice(1).map(x => x[4]));
check('registration sheet untouched', reg.data.length === 5);
console.log(pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail ? 1 : 0);
