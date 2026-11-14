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
