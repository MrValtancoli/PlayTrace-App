// Verifies time formatting against the examples in Export-Format-Reference.md.
// Run with: npx tsx scripts/verify-timeformat.ts
import {
  formatTimeContinuous,
  formatTimeMatch,
  formatTimePeriod,
} from '../src/services/timeFormat';

let failures = 0;

function check(label: string, actual: string, expected: string) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: got "${actual}", expected "${expected}"`);
}

// --- 1st half, 23:45 elapsed (spec event: Corner) ---
check('period @23:45 1T', formatTimePeriod(1425, 1, 45), '23:45 1T');
check('match  @23:45 1T', formatTimeMatch(1425, 1, 45), '23:45 (1T)');
check('cont   @23:45 1T', formatTimeContinuous(1425, 1, 45, 0), '23:45');

// --- 1st half injury time, 47:00 elapsed (spec event: Yellow Card) ---
check('period @47:00 1T', formatTimePeriod(2820, 1, 45), '45+2 1T');
check('match  @47:00 1T', formatTimeMatch(2820, 1, 45), '47:00 (1T)');
check('cont   @47:00 1T', formatTimeContinuous(2820, 1, 45, 0), '47:00');

// --- 2nd half, 23:30 elapsed, injury1=3 (spec event: Goal) ---
check('period @23:30 2T', formatTimePeriod(1410, 2, 45), '23:30 2T');
check('match  @23:30 2T', formatTimeMatch(1410, 2, 45), '68:30 (2T)');
check('cont   @23:30 2T', formatTimeContinuous(1410, 2, 45, 3), '71:30');

// --- 2nd half, 35:45 elapsed, injury1=3 (spec event: Substitution) ---
check('period @35:45 2T', formatTimePeriod(2145, 2, 45), '35:45 2T');
check('match  @35:45 2T', formatTimeMatch(2145, 2, 45), '80:45 (2T)');
check('cont   @35:45 2T', formatTimeContinuous(2145, 2, 45, 3), '83:45');

// --- boundaries ---
check('period @45:00 1T (not injury yet)', formatTimePeriod(2700, 1, 45), '45:00 1T');
check('period @45:30 1T (first injury min)', formatTimePeriod(2730, 1, 45), '45+1 1T');
check('period @00:00 kickoff', formatTimePeriod(0, 1, 45), '00:00 1T');

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
