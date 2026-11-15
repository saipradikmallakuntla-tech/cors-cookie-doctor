# CORS & Cookie Doctor

A real, zero-dependency static diagnostic utility for supplied browser request context, CORS response/preflight headers, fetch credentials and cookie attributes. No endpoint is probed and no credentials are needed.

**Live:** https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/

## Run and use
Open `index.html`, or serve the directory with a static server. No package manager, build step, backend or API key. Pages publishes `main` at `/`; `.nojekyll` disables Jekyll processing.

1. Load a synthetic case or enter HTTP(S) URLs and non-sensitive headers.
2. Supply the actual schemeful site relationship for cross-origin URLs; origin and site are not interchangeable.
3. Diagnose whether preflight is needed and whether the supplied responses satisfy the modeled CORS requirements.
4. Review cookie transmission candidates separately from CORS response access.
5. Export a report that omits supplied header and cookie values.

## Working rules
- Exact origins and credentialed wildcard restrictions; exact `Access-Control-Allow-Credentials: true`.
- Safelisted methods and author headers, content-type essences, header byte limits, and single-range syntax.
- Preflight method/header permissions. Authorization is never covered by an Allow-Headers wildcard; wildcard semantics differ for credentialed requests.
- Browser-controlled request header warnings, mixed-content warnings, and dynamic-origin cache Vary guidance.
- Fetch credentials, host/domain/path matching, Secure, SameSite, third-party blocking, Max-Age/Expires precedence, and __Host-/__Secure- prefix constraints.
- HttpOnly correctly limits script access rather than browser transmission.
- Domain-attributed and partitioned cookies are marked as needing additional verification rather than assumed valid.

Header blocks accept `Name: value` lines or a JSON object. Cookies accept one `Set-Cookie` value per line. The page models fetch/XHR, not top-level navigation. Six synthetic cases include broken/fixed credentialed CORS, Authorization wildcard failure, cross-site Lax/None and browser third-party blocking.

## Tests
Use **Run built-in tests**, or run the pure engine in Node:
```sh
node -e "const a=require('./app.js');const t=a.selfTest();console.table(t);if(t.some(x=>!x.pass))process.exit(1)"
```

## Privacy, safety and limits
No fetch/XHR, uploads, analytics, storage, external assets or dependencies. Cookie values and raw header values are not included in exports. Do not paste live credentials. Reports still include origins, cookie names and requested header names; review before sharing.

This is an offline rule model, not proof of connectivity, security, authentication, authorization, cookie storage or browser conformance. CORS is not an authorization boundary. Public-suffix validation, CHIPS partition keys, storage-access exceptions, private-network restrictions, redirects, service workers, browser-specific grace periods and transport exceptions are not fully modeled. Inputs are bounded to 32 KiB per header/cookie block and 100 cookie candidates. Confirm results in DevTools.

## Structure and network
`index.html` provides semantic HTML5, WebApplication JSON-LD and direct satellite navigation; `styles.css` is responsive; `app.js` contains the pure rule engine, fixtures, regression tests, safe DOM interface and local report export. See [NETWORK.md](NETWORK.md).

[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Stream Inspector](https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/) · [Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/)

Hub availability is independent of this app. This batch does not create the hub or change upstream Zion repositories or DNS.

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

## Failure-mode diagnostics and cross-app triage — 2026-11-15

Batch: `zion-diagnostics-matrix-2026-11-15-en-es-pt`.

Use synthetic or approved sanitized evidence. Review summaries manually: sanitization is not automatic. Links carry no diagnostic inputs, uploads, or shared state. Hub guides have full EN/ES/PT coverage; this utility interface remains English-only.

### Blocked response with unknown completion

- **Trigger:** The response is unreadable but a simple or approved preflighted request may have executed.
- **Carry manually:** Method, synthetic origin/site relationship, credential mode, policy findings, and known/unknown completion; no header values or tokens.
- **Next action and limits:** Model ambiguous response loss with stable intent identity and bounded retry layers. Reconcile actual server state before replay; CORS failure is not proof of no side effect.
- **Continue:** [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#diagnostic-notes)

### Access understood; inspect saved framing

- **Trigger:** CORS access and cookie eligibility are separated, but saved stream structure still needs inspection.
- **Carry manually:** Synthetic policy summary, adapter name, and timestamp availability only; move no raw response or cookie data through links.
- **Next action and limits:** Inspect an approved sanitized SSE/NDJSON capture locally. Missing timestamps are not zero latency; cookie eligibility does not prove storage/transmission or complete stream delivery.
- **Continue:** [LLM Stream Inspector](https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/#diagnostic-notes)

### Matrix languages and reciprocal network

- [Diagnostics matrix — English](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/diagnostics-matrix.html#triage-cors)
- [Matriz de diagnóstico — Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/diagnostics-matrix.html#triage-cors)
- [Matriz de diagnóstico — Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/diagnostics-matrix.html#triage-cors)

[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [LLM Stream Inspector](https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/#diagnostic-notes) · [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#diagnostic-notes)

[Diagnostics cycle release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/DIAGNOSTICS_MATRIX_RELEASE.md). Existing scenarios, case studies, architecture links, engines and styles are preserved. No third-party repository or Pages/DNS setting is changed.


## Batch 99 — expanded seven-node network

This current expansion adds three independent browser-local utilities; all earlier dated notes above remain historical. The original analysis engine and stylesheet are unchanged. No third-party repositories, shared runtime, custom domains or diagnostic URL parameters are introduced.

- [Zion AI Apps Hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [source](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub)
- [LLM Stream Inspector](https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/) · [source](https://github.com/saipradikmallakuntla-tech/llm-stream-inspector)
- [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/) · [source](https://github.com/saipradikmallakuntla-tech/agent-retry-safety-lab)
- [Prompt Token Budget Lab](https://saipradikmallakuntla-tech.github.io/prompt-token-budget-lab/) · [source](https://github.com/saipradikmallakuntla-tech/prompt-token-budget-lab)
- [Tool Schema Drift Auditor](https://saipradikmallakuntla-tech.github.io/tool-schema-drift-auditor/) · [source](https://github.com/saipradikmallakuntla-tech/tool-schema-drift-auditor)
- [Webhook Replay Guard](https://saipradikmallakuntla-tech.github.io/webhook-replay-guard/) · [source](https://github.com/saipradikmallakuntla-tech/webhook-replay-guard)

[Discovery EN](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/batch-99-discovery.html) · [ES](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/batch-99-discovery.html) · [PT](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/batch-99-discovery.html). Use only sanitized, manually reviewed evidence. Copy/export/mailto drafts omit raw diagnostic inputs; no email is sent automatically. The full graph has seven repository nodes and 42 non-self directed links, not 42 apps. New estimates and simulations are not tokenization, compatibility, security or exactly-once guarantees. See the hub's `BATCH_99_NETWORK_EXPANSION_RELEASE.md` for dated evidence.
