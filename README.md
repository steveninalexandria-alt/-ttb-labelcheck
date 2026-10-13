# TTB LabelCheck

AI-assisted alcohol beverage label verification prototype for the Treasury take-home exercise.

## Live demo

Add the deployed URL here after deployment.

## Problem

TTB compliance agents manually compare application data against label artwork. This prototype focuses on the repetitive checks that can be automated safely while preserving human review for ambiguous or visually sensitive requirements.

## Solution

1. An agent enters expected application values.
2. The agent uploads a label image.
3. Tesseract.js performs OCR in the browser.
4. Parsing code converts OCR text into structured label fields.
5. Deterministic comparison rules produce **PASS**, **REVIEW**, or **FAIL** results.
6. The raw OCR text remains available as evidence.

The key design choice is **AI/OCR extracts; deterministic code decides**. OCR is not allowed to make a regulatory determination by itself.

## Core checks

- Brand name (case and harmless punctuation normalized)
- Class/type
- Alcohol by volume
- Net contents (unit normalized)
- Government health warning wording and capitalization

The mandatory warning is intentionally handled more strictly than ordinary descriptive fields. The prototype reports a **REVIEW** when the warning wording appears correct because OCR text alone cannot reliably prove that the words `GOVERNMENT WARNING` are bold.

## Technology

- Next.js / React / TypeScript
- Tesseract.js OCR
- Deterministic TypeScript comparison rules
- Vitest
- No database
- No application API key or server-side secret

## Privacy and data handling

The prototype performs OCR in the user's browser. Uploaded images are not intentionally persisted by the application and no application database is used.

Tesseract.js may retrieve its OCR runtime/language assets from its configured distribution source in the browser. For a production federal deployment, these assets should be packaged and served from an approved internal origin rather than depending on unrestricted external egress.

## Setup and run

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Run tests:

```bash
npm test
```

Build production output:

```bash
npm run build
npm start
```

## Assumptions

- Application metadata is manually entered because direct COLA integration is outside the prototype scope.
- Case and harmless punctuation differences in brand names are treated as equivalent.
- ABV and net contents are compared numerically after normalization.
- Low OCR confidence or unreadable fields are routed to human review rather than treated as certain failures.
- Exact visual typography cannot be guaranteed by text OCR, so bold-format verification remains a human-review item.
- The prototype focuses on the common fields identified in the take-home instructions rather than implementing every beverage-specific labeling rule.

## Error handling

The UI handles unsupported file types, files over 10 MB, missing application data, OCR failures, low-confidence OCR, and missing extracted fields.

## Performance

The stakeholder target is approximately five seconds. Browser OCR avoids a server round trip, but first-run performance depends on device speed and OCR asset loading. This is a documented prototype trade-off. A production evaluation should benchmark representative labels and compare browser OCR with an approved Azure-hosted vision service.

## Government warning validation

The prototype uses the standard TTB warning text as the textual baseline. It checks warning presence, text similarity, and uppercase `GOVERNMENT WARNING` detection. It deliberately does not claim that OCR can reliably prove bold styling, type size, background contrast, or physical separation from surrounding label information.

Reference: TTB health warning guidance / 27 CFR part 16.

## Production / federal considerations

A production implementation should evaluate:

- Azure-hosted deployment consistent with the agency environment
- Approved identity and access controls (for example, Entra ID)
- Private endpoints / controlled outbound egress
- Packaging OCR/model assets internally or using an approved Azure AI service
- Secrets management and managed identities where applicable
- Audit logging that avoids unnecessary storage of label data
- Data retention, privacy, records-management, and authorization-boundary requirements
- Representative accuracy testing and documented confidence thresholds
- Human decision authority for regulatory determinations

## Known limitations

- OCR quality can degrade with glare, curved bottles, unusual fonts, low resolution, or angled images.
- Brand extraction uses a lightweight heuristic and may require review for complex label layouts.
- Typography and spatial requirements are not fully machine-verified.
- Batch processing is not included in the MVP.

## Future enhancements

1. Azure AI Vision / Azure OpenAI evaluation behind approved network controls
2. Bounding-box evidence highlighting on the uploaded image
3. Multi-image / batch processing for large importer submissions
4. Beverage-specific rule profiles for beer, wine, and distilled spirits
5. Structured report export and audit trail
6. Optional COLA integration if a future authorization and integration effort permits it

## Trade-offs

The exercise emphasizes a clean working core over ambitious incomplete features. This implementation therefore prioritizes a simple agent workflow, explainable comparison rules, privacy-conscious processing, and explicit human-review boundaries instead of building authentication, persistent storage, COLA integration, or a large rules platform.
