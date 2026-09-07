#!/usr/bin/env node
// Does the configured analytics provider actually accept our credential?
//
//   npm run analytics-check                       check src/lib/analyticsConfig.js
//   npm run analytics-check -- --key phc_xxx      check a key BEFORE pasting it in
//   npm run analytics-check -- --key phc_xxx --host https://eu.i.posthog.com
//   npm run analytics-check -- --send-event       also post one real test event
//
// A --key/--host/--provider on the command line OVERRIDES the committed file,
// so the pre-flight forms above work while `provider` is still "none". That is
// the whole point of them, and it did not hold until 2026-09-07 — see
// inferProvider() below for what was measured.
//
// ⛔ NOT wired into `npm test`, deliberately: it makes a network call, so it is
// neither offline nor deterministic. It is an owner tool for the one moment the
// key goes in, not a build gate.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS EXISTS, AND WHY IT DOES NOT USE THE CAPTURE ENDPOINT.
//
// The obvious version of this script — POST an event to the capture endpoint
// and check the status — is WORSE THAN NOTHING. Measured 2026-09-06 against
// PostHog with a deliberately invalid key:
//
//   POST https://us.i.posthog.com/i/v0/e/  {"api_key":"phc_invalid_probe_0…"}
//   → HTTP 200 {"status":"Ok"}
//
// Same on the EU host. A control POST to a nonexistent path on the same host
// returned 404, so that 200 is real accept-and-discard behavior, not a
// catch-all. The capture endpoint cannot tell you anything about your key.
//
// That matters because the browser side is fire-and-forget BY DESIGN:
// `analytics.js` sends via `sendBeacon`, falls back to `fetch(...).catch(() => {})`,
// and swallows every failure so an analytics outage can never break a lesson.
// Correct — and it means a wrong key, or a US key posted to the EU host,
// produces EXACTLY ZERO SIGNAL. The build succeeds, the deploy succeeds, the
// dashboard stays empty, and nothing anywhere says why. That silent-off state
// is the precise failure `analyticsConfig.js`'s header says this whole item
// exists to end, and it survived until this script because every surface that
// could have caught it answers 200.
//
// So the probe is `/decide/`, the public endpoint PostHog's own SDK calls. It
// VALIDATES the project token and answers 401 when the token is unknown — and
// it lives on the ingest host, so it fails a region mismatch for the same
// reason it fails a typo: a US token does not exist in the EU project database.
//
// ═══════════════════════════════════════════════════════════════════════════
// THE CONTROL IS THE LOAD-BEARING PART. READ THIS BEFORE TRUSTING A PASS.
//
// Every run first probes with a deliberately invalid token, which MUST be
// rejected. If that control does not fire — the endpoint moved, a proxy is
// answering, the network is intercepted, PostHog changed its auth behavior —
// then a 200 for the real key means nothing either, and this script REFUSES TO
// GIVE A VERDICT rather than printing a pass it cannot support. A green result
// from a blind instrument is the thing this repo has paid for most often.
//
// This design also means the script needs no valid key of its own to prove it
// is alive, which is why it could be written before the account existed.
//
// ⚠️ ONE DIRECTION IS PROVEN, THE OTHER IS REASONED. That an invalid token is
// rejected is measured on every run. That a VALID token is accepted was never
// measured here — there was no account when this was written. If the first real
// key ever comes back 401 while you are certain it is right, suspect this
// assumption before you suspect the key, and check the region first.
// ═══════════════════════════════════════════════════════════════════════════

import { analyticsConfig } from '../src/lib/analyticsConfig.js';

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1] ?? '';
};
const has = (name) => argv.includes(`--${name}`);

// A token that cannot belong to anyone. Used as the control on every run.
const DEAD_TOKEN = 'phc_invalid_probe_000000000000000000000000';
const TIMEOUT_MS = 15000;

let exitCode = 0;
const say = (s = '') => console.log(s);

async function post(url, body, contentType = 'application/json') {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: typeof body === 'string' ? body : JSON.stringify(body),
      signal: ac.signal,
    });
    return { status: res.status, text: (await res.text()).slice(0, 400) };
  } catch (err) {
    return { status: null, error: err?.name === 'AbortError' ? `timed out after ${TIMEOUT_MS}ms` : String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

// ── Resolve what we are actually checking. CLI overrides let the owner test a
// key BEFORE editing the committed file, which is the safer order. A project
// API key is public by construction (it ships in the bundle), so putting one
// on a command line costs nothing — a PERSONAL key would, and never belongs here.
const cliKey = flag('key');
const cliHost = flag('host');

// The pre-flight order this script advertises is "check the key BEFORE pasting
// it in", and at that moment the committed provider is still "none" — so
// reading `provider` from the file alone sent every --key run into the
// "analytics is OFF" branch below and exited without probing anything.
// Measured 2026-09-07: `npm run analytics-check -- --key phc_…`, the exact
// command this file's usage block and analyticsConfig.js's header both print,
// never reached the probe. A CLI argument therefore overrides the file, and a
// bare --key infers its provider from the key's own shape.
function inferProvider() {
  const explicit = flag('provider');
  if (explicit) return explicit;
  if (cliKey && /^phc_/i.test(cliKey)) return 'posthog';
  if (cliKey || cliHost) return null; // known-ambiguous — asked for below
  return analyticsConfig.provider;
}
const provider = inferProvider();

if (provider === null) {
  say('analytics-check');
  say();
  say('  A --key or --host was given but the provider is ambiguous.');
  say('  `provider` in src/lib/analyticsConfig.js is "' + analyticsConfig.provider + '", and the');
  say('  key does not start with phc_, so it is not obviously a PostHog key.');
  say('  Say which one explicitly, e.g.:');
  say('    npm run analytics-check -- --provider posthog --key phc_xxx');
  process.exit(1);
}

say(`analytics-check — provider "${provider}"`);
say();

if (provider === 'none' || !provider) {
  say('  Analytics is OFF. `provider` is "none" in src/lib/analyticsConfig.js.');
  say('  Nothing is being collected, on this machine or on the live site.');
  say('  To turn it on, see that file\'s header, then re-run this check.');
  process.exit(1);
}

if (provider === 'posthog') {
  const key = cliKey || analyticsConfig.posthog?.projectApiKey || '';
  const host = (cliHost || analyticsConfig.posthog?.host || 'https://us.i.posthog.com').replace(/\/+$/, '');
  const decideUrl = `${host}/decide/?v=3`;

  if (!key) {
    say('  provider is "posthog" but `projectApiKey` is EMPTY.');
    say('  isConfigured() treats that as OFF, so nothing is being sent — by design,');
    say('  so a half-filled config cannot drop events into a 404.');
    say('  Paste the PUBLIC Project API Key (starts phc_) and re-run.');
    process.exit(1);
  }
  if (!key.startsWith('phc_')) {
    say(`  ⚠️  The key does not start with "phc_" (it starts "${key.slice(0, 6)}…").`);
    say('     PostHog project API keys start phc_. A phx_/personal key is the WRONG');
    say('     value and must never go in this file — it ships to every visitor.');
    say();
  }

  // ── CONTROL, first and always. A dead token must be rejected.
  say(`  control  → POST ${decideUrl}`);
  say(`             with a deliberately invalid token, which MUST be rejected`);
  const control = await post(decideUrl, { token: DEAD_TOKEN, distinct_id: 'analytics-check-control' });
  if (control.status === null) {
    say(`             ✗ network error: ${control.error}`);
    say();
    say('  ⛔ NO VERDICT. The control could not reach the endpoint, so a result for');
    say('     your real key would be meaningless. Check connectivity and re-run.');
    process.exit(2);
  }
  if (control.status !== 401) {
    say(`             ✗ got HTTP ${control.status}, expected 401`);
    say(`             ${control.text}`);
    say();
    say('  ⛔ NO VERDICT — THE INSTRUMENT IS BLIND.');
    say('     An invalid token was NOT rejected, so this probe can no longer tell a');
    say('     good key from a bad one, and a pass below would be meaningless.');
    say('     Something changed: PostHog\'s auth behavior, the endpoint, or what is');
    say('     answering on this host. Fix the probe before trusting any result.');
    process.exit(2);
  }
  say(`             ✓ HTTP 401 — the probe can distinguish a bad token`);
  say();

  // ── THE REAL KEY.
  say(`  your key → POST ${decideUrl}`);
  const real = await post(decideUrl, { token: key, distinct_id: 'analytics-check' });
  if (real.status === 200) {
    say(`             ✓ HTTP 200 — accepted`);
    say();
    say(`  ✅ The key is valid AND matches this host's region (${host}).`);
    exitCode = 0;
  } else if (real.status === 401) {
    say(`             ✗ HTTP 401 — rejected`);
    say();
    say('  ❌ Rejected. TWO causes look identical here, and the second is the likely one:');
    say('     1. the key is wrong (typo, or a key from a different project);');
    // Name the region NOT just tried. Suggesting the host that was already
    // used reads as "try what you just did" at the one moment the owner is
    // stuck, which is how this message read until 2026-09-07.
    const OTHER = /eu\.i\.posthog\.com/i.test(host)
      ? 'https://us.i.posthog.com'
      : 'https://eu.i.posthog.com';
    say(`     2. REGION MISMATCH — this checked ${host}.`);
    say('        A US project key 401s against the EU host and the reverse.');
    say(`        Try the other region: re-run with --host ${OTHER}, and if that`);
    say(`        passes set \`host\` to ${OTHER} in src/lib/analyticsConfig.js.`);
    exitCode = 1;
  } else {
    say(`             ? HTTP ${real.status}`);
    say(`             ${real.text}`);
    say();
    say('  ⚠️  Unexpected status — neither the accept (200) nor the reject (401) this');
    say('     probe knows how to read. Treat analytics as UNVERIFIED.');
    exitCode = 1;
  }

  // ── Optional: put one real event in front of the owner's eyes.
  if (has('send-event') && exitCode === 0) {
    const captureUrl = `${host}/i/v0/e/`;
    const res = await post(captureUrl, {
      api_key: key,
      event: 'analytics_check',
      properties: { distinct_id: `analytics-check-${Date.now()}`, source: 'scripts/check-analytics.mjs' },
      timestamp: new Date().toISOString(),
    });
    say();
    say(`  test event → POST ${captureUrl} → HTTP ${res.status ?? 'network error'}`);
    say('  ⚠️  That status proves NOTHING — this endpoint answers 200 to any key at all');
    say('     (see this file\'s header). The only proof is your eyes on the dashboard:');
    say('     look for an `analytics_check` event in PostHog\'s activity feed.');
  } else if (has('send-event')) {
    say();
    say('  test event NOT sent — the key did not verify above.');
  }
} else if (provider === 'plausible' || provider === 'custom') {
  // Honest gap rather than a probe that cannot fail. Plausible's event API
  // answers 202 for any domain, and a custom endpoint has no credential this
  // script knows the shape of — so in both cases a "pass" here would be the
  // same accept-and-discard trap the header describes for PostHog's capture
  // endpoint. Reachability is reported as reachability, and nothing more.
  const target = provider === 'plausible'
    ? `${(analyticsConfig.plausible?.host || 'https://plausible.io').replace(/\/+$/, '')}/api/event`
    : analyticsConfig.custom?.endpoint || '';

  if (!target) {
    say(`  provider is "${provider}" but its required field is EMPTY — treated as OFF.`);
    process.exit(1);
  }
  say(`  reachability → ${target}`);
  const res = await post(target, { probe: true });
  say(res.status === null ? `                 ✗ ${res.error}` : `                 HTTP ${res.status}`);
  say();
  say(`  ⚠️  NO CREDENTIAL VERDICT for "${provider}". This script has no probe that can`);
  say('     tell a valid configuration from an invalid one for this provider, and it');
  say('     will not print a pass it cannot support. Reachability above is reachability');
  say('     only. Confirm in the provider\'s own dashboard that events are arriving.');
  process.exit(3);
} else {
  say(`  Unknown provider "${provider}". Valid: none | plausible | posthog | custom.`);
  process.exit(1);
}

process.exit(exitCode);
