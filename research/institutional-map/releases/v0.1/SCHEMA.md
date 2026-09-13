# Record contract v0.1

All data files are JSON. IDs are unique within each collection. References must
resolve; supporting evidence must be nonempty for any rendered relationship.
Text fields are plain text. Dates use ISO `YYYY-MM-DD`; unknown dates are `null`.
The data-integrity tests enforce admission rules; substantive review is separate.

| File | Shape and required fields |
| --- | --- |
| `sources.json` | Array: `id`, `title`, `publisher`, HTTPS `url`, `publishedOn`, `revisedOn`, `accessedOn`, `basis`. Publication and revision dates may be null when genuinely unknown; all pilot dates are known. |
| `evidence.json` | Array: `id`, `sourceId`, atomic `claim`, exact `locator`, `observedBy`, `limitation`. No derived scores. |
| `institutions.json` | Array: `id`, short `label`, full `name`, `kind`, `jurisdiction`, historical/scope `note`, nonempty `sourceIds`. |
| `instruments.json` | Array: `id`, `label`, `kind`, explicit `bindingness` description, nonempty `sourceIds`. Unknown legal terms must be stated as unknown. |
| `relationships.json` | Array described below. |
| `layout.json` | Object keyed by institution ID: `{x, y}` as percentages within the graphic. Display coordinates only; no substantive measurement. |

Each relationship requires:

- Identity: `id`, `source`, `target`, `instrumentId`.
- Predicate: `kind` (`Model access`, `Evaluation`, `Joint evaluation`, or
  `Research deployment`); `directed` is false only for joint evaluation.
- Scope: nonempty `domains`, `contexts`, `jurisdictions` arrays. Domain IDs are
  `biosecurity`, `cybersecurity`, `cross-domain-ai`. Contexts are separate strings.
- Provenance: nonempty `evidenceIds`, `counterEvidenceIds` (possibly empty),
  and a `rationale` explaining coding, including direction.
- Dates: nullable `announcedOn`, `effectiveFrom`, `effectiveTo`,
  `currentStatusCheckedOn`; `observedBy` is the latest known bound on the event.
  It is not the source publication date or necessarily the event's exact date.
- Status: `eventStatus` describes the event; `currentStatus` describes current
  continuity; `reviewStatus` describes checking. All current pilot records are
  provisional and current continuity is unverified.

This version intentionally does not implement an active-current view, confidence
score or automatic review promotion. Expanding the status vocabulary requires
updating the methodology, interface and tests together. Null start/end dates
must never be interpreted as an interval extending indefinitely in either direction.
