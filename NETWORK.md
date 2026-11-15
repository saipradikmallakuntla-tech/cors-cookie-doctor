# AI & IT satellite network

Owner: [saipradikmallakuntla-tech](https://github.com/saipradikmallakuntla-tech).

## Current restoration batch — 2026-11-14 UTC
Batch: `zion-restoration-2026-11-14-en-es-pt`. This satellite remains an independent, English-language utility; the hub offers complete static language views:

[English hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/) · [Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/).

| Entry | Live HTTPS app | Source |
| --- | --- | --- |
| Central hub | https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/ | https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub |
| Stream Inspector | https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/ | https://github.com/saipradikmallakuntla-tech/llm-stream-inspector |
| Retry Safety Lab | https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/ | https://github.com/saipradikmallakuntla-tech/agent-retry-safety-lab |
| CORS & Cookie Doctor | https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/ | https://github.com/saipradikmallakuntla-tech/cors-cookie-doctor |

## Complementary responsibilities
- Stream Inspector: saved LLM protocol streams; no routing or model evaluation.
- Retry Safety Lab: request amplification and idempotency retention; no live agents or chaos experiments.
- CORS & Cookie Doctor: browser access and cookie-policy reasoning; no uptime monitoring, TLS scanning, or API schema diffing.

Every interface links directly to the other three nodes: 12 directed edges across four apps, not 12 different products. Ordinary canonical HTTPS links never transfer captures, prompts, headers, cookies, secrets, or scenario inputs. Each app deploys independently; no common backend or shared hosted script is required.

## Verification and continuation
Fresh live verification completed at **2026-11-14 20:28:16 UTC**: all four sites and the hub's three language views returned HTTPS HTTP 200, all 12 navigation edges were present, and runtime files matched anchored GitHub sources. This satellite passed **14/14** built-in checks in Node and through its live Chromium test button; the three satellites passed **33/33** in each environment. Evidence is point-in-time, not monitoring, security certification, or proof of browser conformance.

[Local restoration checkpoint](NETWORK_RESTORATION_BATCH.md) · [Hub batch summary](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/NETWORK_RESTORATION_BATCH.md) · [Dated verification receipt](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/DEPLOYMENT_VERIFICATION.json).

## Historical scope and boundaries
The hub was unavailable during the original three-app provisioning run; that historical note is not a current outage. The hub is now deployed at the addresses above. This update changes documentation only, not satellite HTML, CSS, or diagnostic engines. Broader references such as [Zion Tech Group](https://ziontechgroup.com/) and the [original catalog](https://github.com/Zion-support/zion-app-network/blob/main/CATALOG.md) remain separate. No third-party repository, catalog, upstream registration, or DNS setting is modified; outbound references do not imply endorsement.

## Enterprise case studies and reliability benchmarks — 2026-11-15

Illustrative deployment scenarios and reproducible synthetic diagnostics for the existing three utilities, not customer endorsements or production performance claims.

- [English case study](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/case-studies.html#cors)
- [Caso de estudio en español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/case-studies.html#cors)
- [Estudo de caso em português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/case-studies.html#cors)
- [Dated release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/CASE_STUDIES_CYCLE_RELEASE.md)

The hub documentation is fully available in EN/ES/PT; this utility interface remains English-only. Links carry no diagnostic input. This cycle changes only `index.html`, `README.md`, and `NETWORK.md` in this repository; `app.js` and `styles.css` are unchanged. Reference outcomes are synthetic and point-in-time, not an SLA, security certification, browser-conformance proof, or exactly-once guarantee.

## Architecture and diagnostic continuation — 2026-11-15

Three practical checks for the existing engine, not new functionality or production guarantees:

### Credentialed preflight
- **Setup:** Compare synthetic wildcard and explicitly trusted-origin fixtures for a credentialed cross-origin JSON request.
- **Expected finding:** Review preflight method/header allowance separately from response access; a wildcard origin is not valid for credentialed access.
- **Interpretation and limits:** A simple request can reach the server even if JavaScript cannot read its response. Never fix this by blindly reflecting Origin; CORS is not authorization.

### Site versus origin
- **Setup:** State the actual schemeful-site relationship; compare cross-site Lax with Secure SameSite=None under the same CORS context.
- **Expected finding:** CORS may pass while a cookie is withheld. Cross-origin does not by itself mean cross-site.
- **Interpretation and limits:** Eligibility is not proof that a cookie was stored or sent. Public-suffix and partition-key details require additional context.

### Third-party policy and HttpOnly
- **Setup:** Compare third-party-cookie blocking with it disabled, keeping cookie attributes fixed; inspect an HttpOnly candidate.
- **Expected finding:** Third-party policy can still block a SameSite=None candidate. HttpOnly prevents script access, not browser transmission.
- **Interpretation and limits:** No request is sent or cookie set. Confirm real behavior in authorized DevTools; never paste live tokens, and review value-omitting exports.

### Continue through the owned network
- [Inspect stream framing](https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/#diagnostic-notes)
- [Inspect retry amplification](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#diagnostic-notes)
- [Architecture and roadmap — English](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/changelog.html#architecture)
- [Arquitectura y hoja de ruta — Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/changelog.html#architecture)
- [Arquitetura e roteiro — Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/changelog.html#architecture)

[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Existing case studies](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/case-studies.html) · [Batch release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/NETWORK_INTERLINK_BATCH_RELEASE.md)

All six roadmap candidates remain proposals, not launched apps. Links carry no diagnostic inputs. EN/ES/PT parity applies to hub documentation; this utility interface remains English-only. This content-only batch preserves `app.js` and `styles.css`, existing showcases, and historical dated evidence. No third-party repository or Pages/DNS setting is changed.
