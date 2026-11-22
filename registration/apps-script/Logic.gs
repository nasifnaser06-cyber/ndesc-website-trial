/**
 * NESSX registration: the rules, with no Google services in them.
 * Kept separate from Code.gs so they can be tested on a computer (registration/tests).
 *
 * Two jobs:
 *   parseBkashSms(text)  reads a bKash "money in" SMS
 *   decide(...)          says which waiting registrations to verify and which to send to review
 */

var LOGIC = {
  TRX_RE: /^[A-Z0-9]{8,12}$/,
  PHONE_RE: /^01[3-9]\d{8}$/,
  CATEGORIES: ['P', 'J', 'S', 'HS'],
  PASSES: ['solo', 'team', 'online'],
  MAX_TEAM: 3,
  NO_PAYMENT_HOURS: 24,
};

/** "+880 1712-345678", "8801712345678", "01712345678" -> "01712345678" (or "" if it is not a BD mobile). */
function normPhone(s) {
  var d = String(s || '').replace(/\D/g, '');
  if (d.indexOf('880') === 0) d = d.slice(2);
  if (d.length === 10 && d.charAt(0) === '1') d = '0' + d;
  return LOGIC.PHONE_RE.test(d) ? d : '';
}

/** Upper case, letters and digits only. */
function normTrx(s) {
  return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Reads a bKash SMS. Confirmed formats (18 Nov 2026):
 *   Cash In Tk 1,000.00 from 01XXXXXXXXX successful. Fee Tk 0.00. Balance Tk 1,035.17. TrxID DKI4MZEC1K at 18/11/2026 17:50. ...
 *   You have received Tk 1,000.00 from 01XXXXXXXXX. Fee Tk 0.00. Balance Tk 1,075.27. TrxID DK481HDVPG at 04/11/2026 13:38
 * Returns {ok:true, kind, amount, from, trxId, time} for money in,
 *         {ok:false, raw} for an unreadable message that has a TrxID (sent to review),
 *         {ok:false, ignored:true} for everything else (OTPs, offers, money going out). The balance is never kept.
 */
function parseBkashSms(text) {
  var t = String(text || '').replace(/\s+/g, ' ').trim();
  var patterns = [
    { kind: 'cash_in', re: /^Cash In Tk ([\d,]+\.\d{2}) from (01\d{9}) successful\..*?TrxID ([A-Z0-9]{8,12}) at (\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/i },
    { kind: 'received', re: /^You have received Tk ([\d,]+\.\d{2}) from (01\d{9})\..*?TrxID ([A-Z0-9]{8,12}) at (\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/i },
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = t.match(patterns[i].re);
    if (m) {
      return {
        ok: true,
        wallet: 'bKash',
        kind: patterns[i].kind,
        amount: Number(m[1].replace(/,/g, '')),
        from: m[2],
        trxId: m[3].toUpperCase(),
        time: m[6] + '-' + m[5] + '-' + m[4] + ' ' + m[7] + ':' + m[8], // Dhaka time, as bKash writes it
      };
    }
  }
  var outgoing = /^(Cash Out|Send Money|Payment|Bill|Mobile Recharge|Recharge)/i.test(t);
  if (/TrxID/i.test(t) && !/\bOTP\b|\bPIN\b/i.test(t) && !outgoing) return { ok: false, raw: t };
  return { ok: false, ignored: true };
}

/**
 * Checks a registration before it is saved. Returns a list of problems (empty = fine).
 * r: {pass, name, email, phone, institution, className, category, segments[], teamCode,
 *     parentName, parentPhone, wallet, trxId, sender, consent}
 */
/** What each pass includes. There is no segment choice: the pass decides. */
function passIncludes(pass) {
  if (pass === 'team') return 'All segments in the category (solo and team)';
  if (pass === 'online') return 'All online segments in the category';
  return 'All solo segments in the category';
}

function validateRegistration(r) {
  var errors = [];
  if (LOGIC.PASSES.indexOf(r.pass) < 0) errors.push('Choose a pass.');
  if (!String(r.name || '').trim()) errors.push('Enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(r.email || '').trim())) errors.push('Enter a valid email address.');
  if (!normPhone(r.phone)) errors.push('Enter a Bangladeshi mobile number, like 01712345678.');
  if (!String(r.institution || '').trim()) errors.push('Enter your school or college.');
  if (LOGIC.CATEGORIES.indexOf(r.category) < 0) errors.push('Choose your category.');
  if (r.pass !== 'online') {
    if (['bKash', 'Nagad'].indexOf(r.wallet) < 0) errors.push('Choose how you paid.');
    if (!LOGIC.TRX_RE.test(normTrx(r.trxId))) errors.push('Enter the TrxID from your payment SMS (8 to 12 letters and numbers).');
    if (!normPhone(r.sender)) errors.push('Enter the number you paid from.');
  }
  if (r.teamCode && !/^[A-Z0-9]{6}$/.test(String(r.teamCode).toUpperCase())) errors.push('A team code has 6 letters and numbers.');
  return errors;
}

/**
 * Decides what to do with every registration that is still waiting for its payment.
 *
 * regs:  [{id, status, pass, trxId, sender, teamCode, createdMs}]
 *        status: 'Waiting' | 'Verified' | 'Needs review' | 'Cancelled'
 * pays:  [{trxId, amount, from, kind}]   (one row per SMS; a repeated SMS for the same TrxID is ignored)
 * prices: {solo: 200, team: 300, online: 0}
 * nowMs: current time in milliseconds
 *
 * Returns {verify: [{id, trxId}], review: [{id, reason}]}. Nothing is changed here.
 *
 * Rules:
 *  - Online-only (free) registrations are verified straight away.
 *  - A paid registration is verified when its TrxID is in the payments, the amount is the
 *    price of its pass, and no other registration has used that TrxID.
 *  - A team payment of 2 or 3 times the team price covers that many teammates who all
 *    gave the same team code and the same TrxID.
 *  - On a "received" (Send Money) SMS the number it came from must match the number the person
 *    typed. On a Cash In the number is the agent's shop, so it is not checked.
 *  - Wrong amount, a TrxID already used, or a different sender go to review straight away.
 *  - No payment found 24 hours after registering goes to review.
 */
function decide(regs, pays, prices, nowMs) {
  var verify = [], review = [];
  var payBy = {};
  pays.forEach(function (p) {
    var k = normTrx(p.trxId);
    if (k && !payBy[k]) payBy[k] = p;
  });
  // Who already holds each TrxID (verified earlier, or verified in this run).
  var holders = {};
  regs.forEach(function (r) {
    if (r.status === 'Verified') {
      var k = normTrx(r.trxId);
      if (k) (holders[k] = holders[k] || []).push(r);
    }
  });
  var waiting = regs.filter(function (r) { return r.status === 'Waiting'; })
    .sort(function (a, b) { return a.createdMs - b.createdMs; });

  waiting.forEach(function (r) {
    if (r.pass === 'online') { verify.push({ id: r.id, trxId: '' }); return; }
    var k = normTrx(r.trxId);
    var p = payBy[k];
    if (!p) {
      if (nowMs - r.createdMs > LOGIC.NO_PAYMENT_HOURS * 3600 * 1000) {
        review.push({ id: r.id, reason: 'No payment with this TrxID after 24 hours' });
      }
      return;
    }
    var price = prices[r.pass];
    var held = holders[k] || [];
    var ok = false, reason = '';

    if (p.amount === price && held.length === 0) {
      ok = true;
    } else if (r.pass === 'team' && price > 0 && p.amount % price === 0 &&
               p.amount / price >= 2 && p.amount / price <= LOGIC.MAX_TEAM) {
      var seats = p.amount / price;
      var sameTeam = held.every(function (h) {
        return h.pass === 'team' && h.teamCode && h.teamCode === r.teamCode;
      });
      if (!r.teamCode) reason = 'A shared team payment needs the team code';
      else if (!sameTeam) reason = 'TrxID already used by someone outside this team';
      else if (held.length >= seats) reason = 'This payment already covers ' + seats + ' teammates';
      else ok = true;
    } else if (held.length > 0) {
      reason = 'TrxID already used by another registration';
    } else {
      reason = 'Paid ' + p.amount + ' Tk, expected ' + price + ' Tk';
    }

    // Send Money: the number must match. Only for the person who paid alone (a shared team payment came from one teammate).
    if (ok && p.kind === 'received' && p.amount === price && normPhone(p.from) !== normPhone(r.sender)) {
      ok = false;
      reason = 'Number in the SMS (' + p.from + ') is not the number given';
    }

    if (ok) {
      verify.push({ id: r.id, trxId: k });
      (holders[k] = holders[k] || []).push({ pass: r.pass, teamCode: r.teamCode, status: 'Verified' });
    } else {
      review.push({ id: r.id, reason: reason });
    }
  });
  return { verify: verify, review: review };
}

if (typeof module !== 'undefined') {
  module.exports = { LOGIC: LOGIC, passIncludes: passIncludes, normPhone: normPhone, normTrx: normTrx, parseBkashSms: parseBkashSms, validateRegistration: validateRegistration, decide: decide };
}
