(function(){
'use strict';
const base={pageUrl:'https://app.example.com/dashboard',requestUrl:'https://api.example.com/v1/items',method:'POST',credentials:'include',siteContext:'same-site',thirdPartyBlocked:false,requestHeaders:'Content-Type: application/json',actualResponse:'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true',preflightResponse:'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true\nAccess-Control-Allow-Methods: POST\nAccess-Control-Allow-Headers: content-type',cookies:'session=synthetic; Path=/; Secure; HttpOnly; SameSite=Lax'};
const fixed={...base,actualResponse:'Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Credentials: true\nVary: Origin',preflightResponse:'Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Credentials: true\nAccess-Control-Allow-Methods: POST\nAccess-Control-Allow-Headers: content-type\nVary: Origin'};
const cross={...fixed,pageUrl:'https://portal.example.net/',method:'GET',siteContext:'cross-site',requestHeaders:'',preflightResponse:'',actualResponse:'Access-Control-Allow-Origin: https://portal.example.net\nAccess-Control-Allow-Credentials: true\nVary: Origin'};
const samples={broken:{...base},fixed:{...fixed},authWildcard:{...fixed,credentials:'omit',requestHeaders:'Authorization: synthetic',preflightResponse:'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: POST\nAccess-Control-Allow-Headers: *',actualResponse:'Access-Control-Allow-Origin: *'},crossLax:{...cross},crossNone:{...cross,cookies:'session=synthetic; Path=/; Secure; HttpOnly; SameSite=None'},blockedThirdParty:{...cross,cookies:'session=synthetic; Path=/; Secure; SameSite=None',thirdPartyBlocked:true}};
function parseHeaders(input){
 const text=String(input||'');if(text.length>32768)throw new Error('Header block exceeds 32 KiB.');
 const out=new Map();let pairs=[];
 if(text.trim().startsWith('{')){
  const value=JSON.parse(text);if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Headers JSON must be an object.');
  pairs=Object.entries(value).map(([name,v])=>[name,Array.isArray(v)?v.join(', '):String(v)]);
 }else{
  text.replace(/\r\n?/g,'\n').split('\n').forEach((line,i)=>{if(!line.trim()||/^HTTP\/\S+\s+\d{3}/i.test(line))return;const at=line.indexOf(':');if(at<=0)throw new Error('Header line '+(i+1)+' must be Name: value.');pairs.push([line.slice(0,at).trim(),line.slice(at+1).trim()]);});
 }
 pairs.forEach(([raw,value])=>{if(!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(raw))throw new Error('Invalid HTTP header name.');const name=raw.toLowerCase();out.set(name,out.has(name)?out.get(name)+', '+value:value);});
 return out;
}
function bytes(value){return new TextEncoder().encode(value).length;}
function unsafeByte(value){for(const char of value){const n=char.charCodeAt(0);if(n<=8||(n>=10&&n<=31)||n===127||[34,40,41,58,60,62,63,64,91,92,93,123,125].includes(n))return true;}return false;}
function safelisted(name,value){
 if(bytes(value)>128)return false;
 if(name==='accept')return !unsafeByte(value);
 if(name==='accept-language'||name==='content-language')return /^[0-9A-Za-z *,\-.;=]*$/.test(value);
 if(name==='content-type')return !unsafeByte(value)&&['application/x-www-form-urlencoded','multipart/form-data','text/plain'].includes(value.split(';')[0].trim().toLowerCase());
 if(name==='range')return /^bytes=\d+-\d*$/.test(value);
 return false;
}
function analyze(input){
 const c={...base,...input};let page,endpoint;
 try{page=new URL(c.pageUrl);endpoint=new URL(c.requestUrl);}catch(e){throw new Error('Use valid absolute page and request URLs.');}
 if(![page,endpoint].every(u=>['https:','http:'].includes(u.protocol)))throw new Error('Only HTTP and HTTPS URLs are modeled.');
 if(page.username||page.password||endpoint.username||endpoint.password)throw new Error('Remove username/password credentials from URLs.');
 const method=String(c.method).toUpperCase();if(!['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(method))throw new Error('Unsupported request method.');
 if(!['include','omit','same-origin'].includes(c.credentials))throw new Error('Unknown fetch credentials mode.');
 if(!['same-site','cross-site','unknown'].includes(c.siteContext))throw new Error('Choose a valid site relationship.');
 const request=parseHeaders(c.requestHeaders),actual=parseHeaders(c.actualResponse),preflight=parseHeaders(c.preflightResponse);
 const crossOrigin=page.origin!==endpoint.origin,credentialed=c.credentials==='include';
 const site=crossOrigin?c.siteContext:'same-site';const findings=[];let corsBlocked=false;
 const note=(severity,code,message)=>findings.push({severity,code,message});
 const fail=(code,message)=>{corsBlocked=true;note('error',code,message);};
 const forbidden=new Set(['accept-charset','accept-encoding','access-control-request-headers','access-control-request-method','connection','content-length','cookie','cookie2','date','dnt','expect','host','keep-alive','origin','referer','set-cookie','te','trailer','transfer-encoding','upgrade','via']);
 for(const name of Array.from(request.keys()))if(forbidden.has(name)||name.startsWith('sec-')||name.startsWith('proxy-')){request.delete(name);note('warning','BROWSER_CONTROLLED_HEADER',name+' is browser-controlled or forbidden for script; it is excluded from the modeled author headers.');}
 let unsafeHeaders=Array.from(request).filter(([name,value])=>!safelisted(name,value)).map(([name])=>name);
 const safeBytes=Array.from(request).filter(([name,value])=>safelisted(name,value)).reduce((n,[,value])=>n+bytes(value),0);
 if(safeBytes>1024)unsafeHeaders=Array.from(request.keys());
 const preflightNeeded=crossOrigin&&(!['GET','HEAD','POST'].includes(method)||unsafeHeaders.length>0);
 if(page.protocol==='https:'&&endpoint.protocol==='http:')fail('MIXED_CONTENT','An HTTPS page requesting this HTTP API may be blocked as mixed content. Loopback and browser-specific exceptions are not modeled.');
 function originCheck(headers,label){
  const origin=(headers.get('access-control-allow-origin')||'').trim();
  if(origin==='*'&&credentialed)fail('WILDCARD_CREDENTIALS',label+': wildcard Allow-Origin cannot authorize credentials mode include.');
  else if(origin!==page.origin&&!(origin==='*'&&!credentialed))fail('ORIGIN_NOT_ALLOWED',label+': Allow-Origin must match '+page.origin+(credentialed?' exactly.':' or be * for this non-credentialed request.'));
  if(credentialed&&headers.get('access-control-allow-credentials')!=='true')fail('CREDENTIALS_NOT_ALLOWED',label+': Access-Control-Allow-Credentials must be exactly true.');
 }
 if(crossOrigin){
  originCheck(actual,'Actual response');
  if(preflightNeeded){
   originCheck(preflight,'Preflight response');
   const methods=(preflight.get('access-control-allow-methods')||'').split(',').map(x=>x.trim());
   if(!['GET','HEAD','POST'].includes(method)&&!methods.includes(method)&&!(methods.includes('*')&&!credentialed))fail('METHOD_NOT_ALLOWED','Preflight does not allow method '+method+'.');
   const allowed=(preflight.get('access-control-allow-headers')||'').split(',').map(x=>x.trim().toLowerCase());
   unsafeHeaders.forEach(name=>{const wildcard=allowed.includes('*')&&!credentialed&&name!=='authorization';if(!allowed.includes(name)&&!wildcard)fail('HEADER_NOT_ALLOWED','Preflight must explicitly permit '+name+(name==='authorization'?' (Authorization is never covered by wildcard).':'.'));});
  }
  const vary=(actual.get('vary')||'').toLowerCase().split(',').map(x=>x.trim());
  if(actual.get('access-control-allow-origin')===page.origin&&!vary.includes('origin')&&!vary.includes('*'))note('warning','CACHE_VARY','If Allow-Origin is selected dynamically, use Vary: Origin to avoid shared-cache mistakes.');
 }else note('info','SAME_ORIGIN','CORS does not apply to this same-origin request. Fetch credentials and cookie policy still matter.');
 if(preflightNeeded)note('info','PREFLIGHT','Model requires OPTIONS because of '+(!['GET','HEAD','POST'].includes(method)?'the method':'non-safelisted author headers')+(unsafeHeaders.length?': '+unsafeHeaders.join(', '):'.'));
 const rawCookies=String(c.cookies||'');if(rawCookies.length>32768)throw new Error('Cookie block exceeds 32 KiB.');
 const lines=rawCookies.replace(/\r\n?/g,'\n').split('\n').filter(x=>x.trim());if(lines.length>100)throw new Error('Limit cookie analysis to 100 cookies.');
 const cookieResults=lines.map((line,index)=>{
  const parts=line.replace(/^\s*set-cookie:\s*/i,'').split(';');const first=parts.shift().trim();const eq=first.indexOf('=');
  if(eq<=0)throw new Error('Cookie '+(index+1)+' must start with name=value.');
  const name=first.slice(0,eq).trim();if(!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name))throw new Error('Invalid cookie name on line '+(index+1)+'.');
  const attrs=new Map();parts.forEach(part=>{const at=part.indexOf('=');attrs.set((at<0?part:part.slice(0,at)).trim().toLowerCase(),at<0?'':part.slice(at+1).trim());});
  const reasons=[];let blocked=false,uncertain=false;const block=message=>{blocked=true;reasons.push(message);};
  const secure=attrs.has('secure'),domain=attrs.get('domain');
  if(c.credentials==='omit'||(crossOrigin&&c.credentials==='same-origin'))block('Fetch credentials mode omits cookies for this request.');
  if(secure&&endpoint.protocol!=='https:')block('Secure cookie requires HTTPS in this model.');
  if(domain!==undefined){
   const normalized=domain.replace(/^\./,'').toLowerCase();const host=endpoint.hostname.toLowerCase();
   const isIP=/^\d+\.\d+\.\d+\.\d+$/.test(host)||host.includes(':');
   if(!normalized||!(host===normalized||(!isIP&&host.endsWith('.'+normalized))))block('Domain does not domain-match the API host.');
   else{uncertain=true;reasons.push('Domain matches host textually, but public-suffix eligibility requires browser verification.');}
  }else reasons.push('Host-only scope assumed for the supplied API host.');
  const slash=endpoint.pathname.lastIndexOf('/');const defaultPath=slash<=0?'/':endpoint.pathname.slice(0,slash);
  const rawPath=attrs.get('path');const path=rawPath&&rawPath.startsWith('/')?rawPath:defaultPath;
  if(!(endpoint.pathname===path||(endpoint.pathname.startsWith(path)&&(path.endsWith('/')||endpoint.pathname.charAt(path.length)==='/'))))block('Cookie Path does not path-match this request.');
  let sameSite=(attrs.get('samesite')||'lax').toLowerCase();
  if(!['lax','strict','none'].includes(sameSite)){sameSite='lax';reasons.push('Unrecognized SameSite treated as default Lax for this diagnostic.');}
  if(sameSite==='none'&&!secure)block('SameSite=None requires Secure.');
  if(site==='cross-site'&&(sameSite==='lax'||sameSite==='strict'))block('SameSite='+sameSite+' cookie is withheld on cross-site fetch/XHR.');
  if(site==='unknown'&&sameSite!=='none'){uncertain=true;reasons.push('Need the actual schemeful site relationship for SameSite.');}
  if(attrs.has('partitioned')){uncertain=true;reasons.push('Partition key / CHIPS context is not modeled; verify in the browser.');}
  if(c.thirdPartyBlocked&&site==='cross-site'&&!attrs.has('partitioned'))block('Browser policy blocks this unpartitioned third-party cookie.');
  if(c.thirdPartyBlocked&&site==='unknown'){uncertain=true;reasons.push('Need site context to evaluate third-party blocking.');}
  const maxAge=attrs.get('max-age'),validMaxAge=maxAge!==undefined&&/^-?\d+$/.test(maxAge);
  if(validMaxAge&&Number(maxAge)<=0)block('Max-Age deletes or immediately expires this cookie.');
  if(!validMaxAge&&attrs.has('expires')){const expiry=Date.parse(attrs.get('expires'));if(Number.isFinite(expiry)&&expiry<=Date.now())block('Expires is in the past.');}
  if(name.startsWith('__Secure-')&&(!secure||endpoint.protocol!=='https:'))block('__Secure- prefix requires Secure and a secure origin.');
  if(name.startsWith('__Host-')&&(!secure||endpoint.protocol!=='https:'||attrs.has('domain')||attrs.get('path')!=='/'))block('__Host- prefix requires HTTPS, Secure, explicit Path=/, and no Domain.');
  if(attrs.has('httponly'))reasons.push('HttpOnly blocks script reads, not browser cookie transmission.');
  if(!blocked&&!uncertain)reasons.push('Candidate for transmission under the supplied attributes and context; actual storage and browser policy are not verified.');
  return {name,eligible:blocked?false:uncertain?null:true,reasons};
 });
 if(!corsBlocked)note('info','MODEL_PASSES','Supplied CORS/mixed-content checks pass. This is not a live connectivity or authorization test.');
 note('info','COOKIE_SEPARATION','CORS response visibility and cookie transmission are separate. The cookie report assumes stored cookies with the supplied attributes.');
 const suggested=['Access-Control-Allow-Origin: '+page.origin];if(credentialed)suggested.push('Access-Control-Allow-Credentials: true');suggested.push('Vary: Origin');
 if(preflightNeeded){suggested.push('Access-Control-Allow-Methods: '+method);if(unsafeHeaders.length)suggested.push('Access-Control-Allow-Headers: '+unsafeHeaders.join(', '));}
 return {schemaVersion:1,pageOrigin:page.origin,requestOrigin:endpoint.origin,method,credentials:c.credentials,siteContext:site,crossOrigin,preflightNeeded,unsafeHeaders,corsBlocked,cookies:cookieResults,findings,suggestedHeaders:suggested.join('\n')};
}
function selfTest(){
 const checks=[
 ['Credentialed wildcard is rejected',()=>analyze(samples.broken).corsBlocked],
 ['Explicit origin and preflight pass',()=>{const r=analyze(samples.fixed);return !r.corsBlocked&&r.preflightNeeded&&r.cookies[0].eligible===true;}],
 ['Authorization needs explicit Allow-Headers',()=>analyze(samples.authWildcard).findings.some(f=>f.code==='HEADER_NOT_ALLOWED')],
 ['Cross-site Lax blocks cookie, not CORS',()=>{const r=analyze(samples.crossLax);return !r.corsBlocked&&r.cookies[0].eligible===false;}],
 ['Secure None is a cross-site candidate',()=>analyze(samples.crossNone).cookies[0].eligible===true],
 ['Third-party policy can still block None',()=>analyze(samples.blockedThirdParty).cookies[0].eligible===false],
 ['None without Secure is rejected',()=>analyze({...samples.crossNone,cookies:'sid=synthetic; SameSite=None; Path=/'}).cookies[0].eligible===false],
 ['Domain mismatch is rejected',()=>analyze({...fixed,cookies:'sid=synthetic; Domain=evil.example; Secure; Path=/'}).cookies[0].eligible===false],
 ['Cookie path uses boundary matching',()=>analyze({...fixed,requestUrl:'https://api.example.com/application',cookies:'sid=synthetic; Path=/app; Secure'}).cookies[0].eligible===false],
 ['HttpOnly does not block sending',()=>analyze({...fixed,cookies:'sid=synthetic; Secure; HttpOnly; Path=/'}).cookies[0].eligible===true],
 ['Omit credentials withholds cookies',()=>analyze({...fixed,credentials:'omit'}).cookies[0].eligible===false],
 ['Malformed headers are rejected',()=>{try{analyze({...fixed,requestHeaders:'not-a-header'});return false;}catch(e){return true;}}],
 ['JSON header input works',()=>!analyze({...fixed,requestHeaders:'{"Content-Type":"application/json"}'}).corsBlocked],
 ['Cookie values are absent from reports',()=>!JSON.stringify(analyze({...fixed,cookies:'sid=DO_NOT_EXPORT_ME; Secure; Path=/'})).includes('DO_NOT_EXPORT_ME')]
 ];return checks.map(([name,fn])=>{try{return {name,pass:!!fn()};}catch(e){return {name,pass:false,error:e.message};}});
}
const api={analyze,parseHeaders,safelisted,samples,selfTest};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(typeof globalThis!=='undefined')globalThis.CorsCookieDoctor=api;
if(typeof document==='undefined')return;
const $=id=>document.getElementById(id);const fields=['pageUrl','requestUrl','method','credentials','siteContext','requestHeaders','actualResponse','preflightResponse','cookies'];let current=null;
function read(){const c={};fields.forEach(k=>{c[k]=$(k).value;});c.thirdPartyBlocked=$('thirdPartyBlocked').checked;return c;}
function load(c){fields.forEach(k=>{$(k).value=c[k]||'';});$('thirdPartyBlocked').checked=!!c.thirdPartyBlocked;}
function item(parent,text,kind){const li=document.createElement('li');li.textContent=text;if(kind)li.className=kind;parent.append(li);}
function render(r){
 current=r;$('results').hidden=false;$('origin-result').textContent=r.crossOrigin?'Cross-origin':'Same-origin';$('preflight-result').textContent=r.preflightNeeded?'Yes':'No';$('cors-result').textContent=r.corsBlocked?'Blocked':'Model passes';$('cookie-result').textContent=r.cookies.filter(c=>c.eligible===true).length+' / '+r.cookies.length;
 $('findings').replaceChildren();r.findings.forEach(f=>item($('findings'),f.code+': '+f.message,f.severity));$('cookie-details').replaceChildren();
 if(!r.cookies.length){const p=document.createElement('p');p.textContent='No cookie candidates supplied.';$('cookie-details').append(p);}
 r.cookies.forEach(c=>{const h=document.createElement('h4');h.textContent=c.name+' · '+(c.eligible===null?'More context needed':c.eligible?'Candidate':'Withheld / invalid');const list=document.createElement('ul');c.reasons.forEach(reason=>item(list,reason));$('cookie-details').append(h,list);});
 $('suggestion').textContent=r.suggestedHeaders;$('status').textContent='Local rules evaluated. No request was sent to either URL.';
}
function run(){try{render(analyze(read()));}catch(e){$('status').textContent=e.message;$('results').hidden=true;current=null;}}
$('diagnostic-form').addEventListener('submit',e=>{e.preventDefault();run();});$('load-sample').addEventListener('click',()=>{load(samples[$('sample').value]);run();});
$('run-tests').addEventListener('click',()=>{const results=selfTest();$('tests').hidden=false;$('test-results').replaceChildren();results.forEach(t=>item($('test-results'),(t.pass?'PASS · ':'FAIL · ')+t.name,t.pass?'pass':'error'));$('status').textContent=results.filter(t=>t.pass).length+'/'+results.length+' synthetic tests passed.';});
$('export').addEventListener('click',()=>{if(!current)return;const url=URL.createObjectURL(new Blob([JSON.stringify(current,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='cors-cookie-diagnostic.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
load(samples.broken);run();
})();
