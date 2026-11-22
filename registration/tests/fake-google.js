// Fake Google services for local tests (used by flow.test.js and mock-server.js)
const fs = require('fs'), path = require('path'), vm = require('vm');
function makeGoogle() {
const sheets = {};
function makeSheet(name) {
  const data = [];
  return sheets[name] = {
    data, getName: () => name,
    appendRow: r => data.push(r.map(v => typeof v === 'string' && v.startsWith("'") ? v.slice(1) : v)),
    getLastRow: () => data.length,
    setFrozenRows() {}, getRange(r, c, nr, nc) {
      if (typeof r === 'string') return { setFormula() {} };
      return { setValue: v => { while (data.length < r) data.push([]); data[r - 1][c - 1] = v; }, getValue: () => (data[r - 1] || [])[c - 1], setFontWeight() { return this; }, setBackground() { return this; } };
    },
    getDataRange: () => ({ getValues: () => data.map(r => r.slice()) }),
    getActiveRange: () => ({ getRow: () => 2 }),
  };
}
const mails = [];
const fetches = [];
const props = {};
const ctx = {
  console, Date, Math, JSON, String, Number, Array, Object, encodeURIComponent,
  SpreadsheetApp: { getActive: () => ({ getSheetByName: n => sheets[n] || null, insertSheet: n => makeSheet(n), setSpreadsheetTimeZone() {} }), flush() {}, getActiveSheet: () => sheets.Registrations },
  LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  CacheService: { getScriptCache: () => ({ get: () => null, put() {}, remove() {} }) },
  UrlFetchApp: { fetch: (u) => { fetches.push(u); const b = { name: '', setName(n) { this.name = n; return this; }, copyBlob() { return Object.assign({}, this); } }; return { getResponseCode: () => (globalThis.QR_DOWN ? 503 : 200), getBlob: () => b }; } },
  MailApp: { getRemainingDailyQuota: () => 100, sendEmail: m => mails.push(m) },
  Utilities: { formatDate: (d, tz, f) => f === 'H' ? '12' : '181126', getUuid: () => 'aaaabbbb-cccc-dddd-eeee-ffff00001111' },
  ScriptApp: { getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create() {} }) }) }) },
  ContentService: { createTextOutput: t => ({ t, setMimeType() { return JSON.parse(t); } }), MimeType: { JSON: 'json' } },
};
vm.createContext(ctx);
for (const f of ['Logic.gs', 'Code.gs']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../apps-script', f), 'utf8'), ctx);
  return { ctx, sheets, mails, fetches };
}
module.exports = { makeGoogle };
