# React Flow resize scheduling

`@xyflow/react@12.11.6` updates its store directly from the root and node
ResizeObserver callbacks. During the study's initial layout, WebKit reports
“ResizeObserver loop completed with undelivered notifications.”

The patch defers these updates to requestAnimationFrame, batches node entries,
and cancels pending work on disconnect. It changes both ESM entry points used
by Next.js; the unused CommonJS bundle is unchanged. It does not suppress errors,
change measurements, or disable observation. The full browser suite still rejects
page errors and checks node/edge alignment after zoom and pan.

Reevaluate this patch when upgrading React Flow. Remove it when the upstream
observer scheduling passes the same Chromium/WebKit acceptance suite.
