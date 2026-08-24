// ═══════════════════════════════════════════════════════════════════════════
// CHUNK-LOAD TAGGING
//
// Item 96 gave the lazy screens a boundary; item 99 gave a render crash its
// own copy. What neither could do is tell the two apart at the boundary:
// React hands `AsyncScreen` one `error` whether the chunk 404'd or the code
// arrived and threw, so both got `LoadFailure` — "This content couldn't be
// downloaded. Check your connection." Measured live 2026-08-24 with a throw
// injected into `Practice`: the probe ran (so the chunk plainly downloaded)
// and the reader was still told to check a connection that was fine.
//
// THE DISCRIMINATION METHOD, AND WHY THIS ONE. The only two candidates were
// matching on the error and tagging at the `lazy()` call site. Matching on a
// message — "Failed to fetch dynamically imported module" — is a string owned
// by the browser and the bundler, not by this repo: it differs across engines
// and breaks silently on a React or Vite upgrade, with the failure appearing
// only on a reader's device. Tagging is owned here. `chunk()` wraps the
// loader, so an `import()` rejection is the ONLY thing that can produce a
// `ChunkLoadError`, and the predicate is an `instanceof` rather than a regex.
//
// THE DEFAULT IS THE SAFE ONE. Anything untagged reads as a render error,
// which is what an unrecognised failure should say: `AppError`'s copy is true
// of both cases ("hit an unexpected error", reload), while `LoadFailure`
// makes a claim about the network that may be a lie. So a gap in this
// tagging degrades to a vaguer message, never to a wrong one.
//
// KNOWN RESIDUAL, deliberately accepted. A module that downloads and then
// throws while *evaluating* also rejects `import()`, so it is tagged as a
// load failure and gets the download wording. Narrowing that further means
// asking whether the rejection is a `TypeError` (what the HTML spec rejects
// a failed module fetch with) — which would trade the known-real case, a
// content-hashed chunk 404ing after a redeploy, against a case the build and
// `npm test` already import on every run. Not worth the swap; recorded here
// rather than left for someone to rediscover.
// ═══════════════════════════════════════════════════════════════════════════

export class ChunkLoadError extends Error {
  constructor(cause) {
    super("A screen's code chunk did not load.", { cause });
    this.name = "ChunkLoadError";
  }
}

// Wraps a `() => import("...")` thunk for `lazy()`. The literal specifier
// stays inside the caller's own arrow, because Vite needs to see it to split
// the chunk at all (see App.jsx's CONTENT_LOADERS note and vite.config.js).
export function chunk(load) {
  return () =>
    load().then(undefined, (cause) => {
      throw new ChunkLoadError(cause);
    });
}

export function isChunkLoadError(error) {
  return error instanceof ChunkLoadError;
}
