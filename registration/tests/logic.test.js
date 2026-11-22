// Run: node registration/tests/logic.test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { module: { exports: {} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../apps-script/Logic.gs'), 'utf8'), ctx);
const L = ctx.module.exports;
let pass = 0, fail = 0;
const check = (name, cond, extra) => { if (cond) { pass++; } else { fail++; console.log('FAIL', name, extra !== undefined ? JSON.stringify(extra) : ''); } };

// SMS reader
const ci = L.parseBkashSms('Cash In Tk 1,000.00 from 01622334999 successful. Fee Tk 0.00. Balance Tk 1,035.17. TrxID DKI4MZEC1K at 18/11/2026 17:50. Download App: https://bKa.sh/8app');
check('cash in read', ci.ok && ci.kind === 'cash_in' && ci.amount === 1000 && ci.from === '01622334999' && ci.trxId === 'DKI4MZEC1K' && ci.time === '2026-11-18 17:50', ci);
check('balance never kept', !JSON.stringify(ci).includes('1035'));
const rv = L.parseBkashSms('You have received Tk 1,000.00 from 01730260578. Fee Tk 0.00. Balance Tk 1,075.27. TrxID DK481HDVPG at 04/11/2026 13:38');
check('received read', rv.ok && rv.kind === 'received' && rv.amount === 1000 && rv.trxId === 'DK481HDVPG', rv);
const ref = L.parseBkashSms('You have received Tk 300.00 from 01811000000. Ref NESSX solo. Fee Tk 0.00. Balance Tk 1,375.27. TrxID DK481HDVPH at 18/11/2026 18:10');
check('received with Ref', ref.ok && ref.amount === 300, ref);
check('otp ignored', L.parseBkashSms('Your bKash verification code is 123456. OTP valid for 2 min').ignored === true);
check('cash out ignored', L.parseBkashSms('Cash Out Tk 500.00 to 01999999999 successful. Fee Tk 9.25. Balance Tk 535.17. TrxID DKL7QWER4D at 18/11/2026 19:00').ignored === true);
check('unknown with TrxID kept for review', L.parseBkashSms('Something new Tk 200.00 TrxID ABCD123456 at 18/11/2026 19:00').raw !== undefined);

// Phones and TrxIDs
check('phone +880', L.normPhone('+880 1712-345678') === '01712345678');
check('phone 10 digits', L.normPhone('1712345678') === '01712345678');
check('phone bad', L.normPhone('12345') === '');
check('trx clean', L.normTrx(' dk481hdvpg ') === 'DK481HDVPG');

// Validation
const good = { pass: 'solo', name: 'A B', email: 'a@b.com', phone: '01712345678', institution: 'X School', category: 'S', segments: ['Star Mapping'], wallet: 'bKash', trxId: 'DK481HDVPG', sender: '01712345678', consent: true };
check('valid solo', L.validateRegistration(good).length === 0, L.validateRegistration(good));
check('junior needs no parent details', L.validateRegistration({ ...good, category: 'J' }).length === 0);
check('no consent box needed', L.validateRegistration({ ...good, consent: false }).length === 0);
check('no segment choice needed', L.validateRegistration({ ...good, segments: [] }).length === 0);
check('solo includes all solo segments', /solo segments/.test(L.passIncludes('solo')));
check('team includes every segment', /All segments.*solo and team/.test(L.passIncludes('team')));
check('online needs no payment', L.validateRegistration({ ...good, pass: 'online', wallet: '', trxId: '', sender: '' }).length === 0);
check('bad trx', L.validateRegistration({ ...good, trxId: 'abc' }).length === 1);

// Matching
const P = { solo: 200, team: 300, online: 0 };
const now = Date.parse('2026-12-01T12:00:00Z'), h = 3600e3;
const reg = (id, o) => ({ id, status: 'Waiting', pass: 'solo', trxId: '', sender: '01711111111', teamCode: '', createdMs: now - h, ...o });
const pay = (trxId, amount, from = '01711111111', kind = 'received') => ({ trxId, amount, from, kind });
let d;

d = L.decide([reg('r1', { trxId: 'AAAA111111' })], [pay('AAAA111111', 200)], P, now);
check('solo verified', d.verify.length === 1 && d.verify[0].id === 'r1', d);

d = L.decide([reg('r1', { trxId: 'aaaa111111' })], [pay('AAAA111111', 200)], P, now);
check('lower-case TrxID still matches', d.verify.length === 1, d);

d = L.decide([reg('r1', { trxId: 'AAAA111111' })], [pay('AAAA111111', 150)], P, now);
check('wrong amount to review', d.review.length === 1 && /expected 200/.test(d.review[0].reason), d);

d = L.decide([reg('r1', { trxId: 'AAAA111111' }), reg('r2', { trxId: 'AAAA111111', createdMs: now - h / 2 })], [pay('AAAA111111', 200)], P, now);
check('second claim of same TrxID to review', d.verify.length === 1 && d.verify[0].id === 'r1' && d.review[0].id === 'r2' && /already used/.test(d.review[0].reason), d);

d = L.decide([reg('r1', { trxId: 'AAAA111111', status: 'Verified' }), reg('r2', { trxId: 'AAAA111111' })], [pay('AAAA111111', 200)], P, now);
check('TrxID used in an earlier run', d.review.length === 1 && d.review[0].id === 'r2', d);

d = L.decide([reg('r1', { trxId: 'AAAA111111', sender: '01799999999' })], [pay('AAAA111111', 200)], P, now);
check('send money from a different number to review', d.review.length === 1 && /not the number given/.test(d.review[0].reason), d);

d = L.decide([reg('r1', { trxId: 'AAAA111111', sender: '01799999999' })], [pay('AAAA111111', 200, '01622334999', 'cash_in')], P, now);
check('cash in skips number check', d.verify.length === 1, d);

d = L.decide([reg('r1', { trxId: 'BBBB222222' })], [], P, now);
check('no payment yet: keep waiting', d.verify.length === 0 && d.review.length === 0, d);

d = L.decide([reg('r1', { trxId: 'BBBB222222', createdMs: now - 25 * h })], [], P, now);
check('no payment after 24h to review', d.review.length === 1 && /24 hours/.test(d.review[0].reason), d);

d = L.decide([reg('r1', { pass: 'online' })], [], P, now);
check('online verified without payment', d.verify.length === 1, d);

d = L.decide([reg('t1', { pass: 'team', trxId: 'CCCC333333', teamCode: 'ABC123' })], [pay('CCCC333333', 300)], P, now);
check('team member paying 300 alone', d.verify.length === 1, d);

const team = [1, 2, 3].map(i => reg('t' + i, { pass: 'team', trxId: 'CCCC333333', teamCode: 'ABC123', sender: '0171111111' + i, createdMs: now - h + i }));
d = L.decide(team, [pay('CCCC333333', 900, '01711111111')], P, now);
check('one 900 Tk payment covers 3 teammates', d.verify.length === 3 && d.review.length === 0, d);

d = L.decide([...team, reg('t4', { pass: 'team', trxId: 'CCCC333333', teamCode: 'ABC123', createdMs: now })], [pay('CCCC333333', 900)], P, now);
check('a 4th on a 900 payment to review', d.verify.length === 3 && d.review.length === 1 && d.review[0].id === 't4', d);

d = L.decide([reg('t1', { pass: 'team', trxId: 'CCCC333333', teamCode: 'ABC123' }), reg('x1', { pass: 'team', trxId: 'CCCC333333', teamCode: 'ZZZ999', createdMs: now })], [pay('CCCC333333', 600)], P, now);
check('other team cannot share a payment', d.verify.length === 1 && d.review[0].id === 'x1', d);

d = L.decide([reg('t1', { pass: 'team', trxId: 'CCCC333333', teamCode: '' })], [pay('CCCC333333', 600)], P, now);
check('shared payment without team code to review', d.review.length === 1, d);

d = L.decide([reg('r1', { trxId: 'DDDD444444', status: 'Needs review' })], [pay('DDDD444444', 200)], P, now);
check('rows already in review are left alone', d.verify.length === 0 && d.review.length === 0, d);

console.log(`${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
