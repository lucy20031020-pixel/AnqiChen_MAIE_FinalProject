(async () => {
  'use strict';
  const response=await fetch('data/research.json', {cache:'no-cache'});
  if(!response.ok)throw new Error('Research data could not be loaded.');
  const R=await response.json();
  const M=PassportModel.create(R);globalThis.PassportModel=M;
  const page=document.body.dataset.page;
  const fixed=page==='record', KEY='age-verification-passport-v5';
  const main=document.querySelector('main'), params=new URLSearchParams(location.search);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow='<span aria-hidden="true">↗</span>';
  let state=null, storageOK=true, profile='edge';
  const posts=R.posts;
  if(!fixed){
    try{
      let saved;try{saved=JSON.parse(sessionStorage.getItem(KEY));}catch{saved=null;}
      state=M.restore(saved)||M.newPassport();
      sessionStorage.setItem(KEY,JSON.stringify(M.pack(state)));
    }catch{state=M.newPassport();storageOK=false;}
  }
  function save(){if(fixed)return;try{sessionStorage.setItem(KEY,JSON.stringify(M.pack(state)));}catch{storageOK=false;storageWarning();}}
  function announce(t){document.querySelector('#announcement').textContent=t;}
  function focusMain(){main.focus({preventScroll:true});window.scrollTo(0,0);}
  function go(file){location.href=file;}
  function storageWarning(){if(document.querySelector('.storage-alert'))return;document.querySelector('#shell').insertAdjacentHTML('beforeend','<p class="storage-alert" role="alert">This browser cannot save this visit between pages. Enable session storage or open the site with a local web server. Fixed scenario records remain available.</p>');}
  function start(post='archive',fresh=false){
    const current=state.draft;
    if(current&&!current.outcome&&(fresh||current.post!==post)){
      if(current.stage==='processing')M.transition(current,'finish-processing');
      if(!current.outcome)M.transition(current,'leave');M.finish(state);
    }
    if(fresh||!current||current.outcome||current.post!==post)M.begin(state,fresh?profile:state.profile,post);
    save();go('verify.html');
  }
  function record(){
    if(fixed)return M.scenarioRecord(params.get('scenario'));
    const id=params.get('record');
    if(id)return state.records.find(r=>r.id===id)||null;
    if(state.draft?.outcome){const r=M.finish(state);save();return r;}
    if(state.draft)return null;
    return state.records.at(-1)||null;
  }
  const badge=o=>`<span class="tag ${M.outcomes[o].tone}">${M.outcomes[o].symbol} ${M.outcomes[o].label}</span>`;
  const details=(title,body)=>`<details class="reveal"><summary>${title}</summary><div>${body}</div></details>`;
  const action=(name,label,secondary=false)=>`<button class="button ${secondary?'secondary':''}" data-action="${name}">${label} ${arrow}</button>`;
  function heading(kicker,title,sub=''){return `<header class="screen-heading"><p class="eyebrow">${kicker}</p><h1>${title}</h1>${sub?`<p class="lead">${sub}</p>`:''}</header>`;}
  function lostPost(d){const p=posts[d.post]||posts.archive;return `<aside class="waiting-post"><p class="eyebrow">Waiting on the other side</p><h2>${p.title}</h2><p>${p.excerpt}</p><span class="tiny">${p.comments} COMMENTS · ACCESS RESTRICTED</span></aside>`;}
  function platformNote(text){return `<p class="actor-note"><span>COMMONROOM</span> ${text}</p>`;}
  function providerDetail(kind){
    const method=R.methods[kind];
    return details('Who receives this?',`<p><strong>${method.recipient}</strong> receives: ${method.request.map(esc).join(' · ')}. ${esc(method.purpose)}</p><p>${esc(method.note)} COMMONROOM decides entry.</p><p class="footnote">Fictional route; output type informed by ${method.source_ids.join(', ')}. The samples and response labels are fictional.</p>`);
  }
  function backstage(){return details('Behind the service: who provides what?',`<p>${esc(R.commercial.text)}</p><p class="muted">${esc(R.commercial.question)}</p>`);}
  function sourceLink(id){const x=R.sources[id];return `<a href="${esc(x.url)}" target="_blank" rel="noopener">${id} · ${esc(x.title)} ↗</a>`;}
  const localRef=()=>{const r=record();return r?`?record=${encodeURIComponent(r.id)}`:'';};
  const ref=(!fixed&&['data','passport'].includes(page))?localRef():'';
  document.querySelector('#shell').innerHTML=`<header class="topbar"><a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">↔</span><span>${page==='request'?'COMMONROOM':'AGE VERIFICATION<br>PASSPORT'}</span></a><div class="top-actions"><button class="text-button" data-action="research">Research behind this experience</button>${!fixed?'<button class="text-button reset-button" data-action="reset">Start a new visit</button>':'<span class="tag">Public scenario</span>'}</div></header>${fixed?'':`<nav class="nav" aria-label="Experience pages">${[['request','index.html','Community'],['verify','verify.html','The check'],['data','data.html'+ref,'Data trail'],['passport','passport.html'+ref,'Passport']].map(([p,href,label],i)=>`<a href="${href}" ${p===page?'aria-current="page"':''}><span class="step-number">${i+1}</span>${label}</a>`).join('')}</nav>`}`;
  document.querySelector('#footer').innerHTML=`<span>Age Verification Passport · Fictional exhibition, no real age assessment</span><button class="text-button" data-action="research">${fixed?'Research behind this scenario':'Research & other examples'} ↗</button>`;
  if(!storageOK)storageWarning();
  const dialog=document.querySelector('#about');
  dialog.innerHTML=`<button class="text-button close-dialog" data-action="close">Close ×</button><p class="eyebrow">Research behind this experience</p><h2>Case evidence and design choices</h2><p class="footnote">UK scenario · Sources checked ${R.checked}. Statements are reported, not independently audited.</p>
    ${Object.entries(R.sources).map(([id,x])=>`<section class="research-entry"><h3>${id} / ${esc(x.role)}</h3><p>${esc(x.summary)} ${sourceLink(id)}</p><p class="footnote">Published/updated: ${x.updated||'not dated'} · Checked ${x.checked} · documented</p></section>`).join('')}
    <section class="research-entry"><h3>Fictional rules</h3><p>${esc(R.context.rule)} ${esc(R.rules.initial_order)} The estimated ages, status codes, samples and review timing are authored, not observed failure rates.</p><p>Existing age credentials are outside this edition. No unsupported issuer or sharing mechanism is presented as a real option.</p></section>
    ${details('Source gaps',`<ul>${R.source_gaps.map(g=>`<li>${esc(g)}</li>`).join('')}</ul>`)}
    ${!fixed?`<details id="scenario-settings" class="reveal"><summary>Try another example</summary><p>Choose the example result for the next visit. Results are set in advance, not measured from you.</p><label for="profile">Example result</label><select id="profile">${R.active_profiles.map(key=>[key,M.profiles[key]]).map(([key,p])=>`<option value="${key}">${esc(p.label)}</option>`).join('')}</select><p class="footnote">These examples do not show real success or failure rates.</p><button class="button secondary" data-action="preset">Start this scenario ↗</button></details>`:''}
    <p class="footnote">${fixed?'This fixed page reads and saves no visitor storage.':'Only fictional choices and slips are saved in this tab. Use Start a new visit between visitors. Browser session restore can preserve a tab; closing it is not a reliable exhibition reset.'}</p>`;

  function requestPage(){
    const grantedPost=state.draft?.outcome==='granted'?state.draft.post:null;
    main.innerHTML=`<div class="forum-banner"><div><p class="eyebrow">COMMONROOM / afterhours</p><h1>The After Hours Room</h1><p>Independent publishing, shared archives and the things we make after work.</p></div><a class="room-jump" href="#discussions">Browse discussions ↓</a></div>
    <div class="context-bar"><span><strong>${esc(R.context.country_code)}</strong> / community discussions</span><span>18+ is a fictional COMMONROOM rule</span><span>Sources checked ${R.checked}</span></div>
    <p class="visit-note">Previews are open to everyone. To read a full discussion and its comments, use the fictional character details supplied in this experience.</p>
    <div class="forum-layout"><section id="discussions" class="post-feed" aria-label="Community posts"><div class="feed-tabs"><strong>Recent discussions</strong><span>Community / afterhours</span></div>${Object.entries(posts).map(([key,p],i)=>{const open=key===grantedPost,act=open?'open-discussion':'start';return `<article class="forum-post" data-post="${key}"><div class="post-index mono">${String(i+1).padStart(2,'0')}</div><div><p class="post-meta">${p.author} · ${i+1}h ago <span>${p.tag}</span></p><h2><button data-action="${act}" data-post="${key}">${p.title}</button></h2><p>${p.excerpt}</p><div class="post-actions"><button class="text-button" data-action="${act}" data-post="${key}">${open?'Read':'View'} ${p.comments} comments ↗</button><span class="post-access">${open?'✓ Access granted · Read the full discussion':'Preview available · Age confirmation required to read comments'}</span></div></div></article>`;}).join('')}</section><aside class="forum-about"><p class="eyebrow">About this community</p><p>A small place to share unfinished ideas and keep each other’s work in circulation.</p><dl><div><dt>Members</dt><dd>1,284</dd></div><div><dt>Here now</dt><dd>27</dd></div></dl><p class="tiny">FICTIONAL COMMUNITY & COUNTS</p><hr><h3>Reading here</h3><p>Post previews are visible. Full discussions and comments require age confirmation under COMMONROOM’s fictional 18+ rule.</p>${details('Why this rule?',`<p>These ordinary discussions are not presented as legally restricted content. The gate is a design choice informed by the UK age-assurance research.</p><p>${esc(R.context.scope)}</p>`)}${state.draft&&!state.draft.outcome?'<a class="text-button" href="verify.html">Continue your current check ↗</a>':''}</aside></div>`;
  }
  let processingTimer=null;
  function portrait(c){return `<svg class="abstract-avatar" viewBox="0 0 120 120" role="img" aria-label="Abstract fictional sample image, not a real face"><rect x="1" y="1" width="118" height="118" rx="8" fill="#F1E9DB" stroke="#D0C3B2"/><circle cx="60" cy="43" r="23" fill="${c?.accepted_document?'#B99C83':'#AAA699'}"/><path d="M22 105V88l38-23 38 23v17" fill="#4C5149"/><path d="M46 43h28M60 29v28" stroke="white" stroke-width="2"/><text x="9" y="113" font-size="8" fill="white" font-family="monospace">${esc(c?.face_sample||'SAMPLE')}</text></svg>`;}
  function characterCard(d){const c=M.getCharacter(d);return c?details('Character details',`<div class="character-reference">${portrait(c)}<div><strong>${esc(c.name)}</strong><p>Birthdate: <span class="mono">${c.birthdate}</span><br>${esc(c.condition)}</p><span class="tiny">${d.characterId} / ${c.scenario_code} · FICTIONAL ADULT</span></div></div><p class="footnote">Use these supplied details. Results are set in advance. No real age analysis takes place.</p>`):'';}
  function evidenceForm(kind,description){return `<form id="evidence-form" data-kind="${kind}" novalidate><div class="evidence-summary">${description}</div><p class="form-error" id="form-error" role="alert"></p><div class="choice-footer"><button type="submit" class="button">Send sample ${arrow}</button><button type="button" class="text-button" data-action="back">Back</button><button type="button" class="text-button" data-action="leave">Leave without sending</button></div></form>`;}
  function lensService(stage){
    const lens=['face','face-confirm','processing','document','document-confirm'].includes(stage);document.body.dataset.service=lens?'lens':'commonroom';
    const brand=document.querySelector('.brand');brand.innerHTML=lens?'<span class="brand-mark" aria-hidden="true">l.</span><span>LENS<small>Verification provider</small></span>':'<span class="brand-mark" aria-hidden="true">↔</span><span>COMMONROOM</span>';
  }
  function update(){save();verifyPage();focusMain();}
  function verifyPage(){
    clearTimeout(processingTimer);
    const d=state.draft;
    if(!d){main.innerHTML=`<section class="empty">${heading('No visit in progress','Find the conversation first.','Open a discussion in COMMONROOM to begin a fictional character task.')}<a class="button" href="index.html">Back to the community ↗</a></section>`;return;}
    lensService(d.stage);
    const c=M.getCharacter(d),sim='<p class="simulation-note">Simulation · No real identity data required</p>';
    let content='';
    if(d.stage==='character'){
      content=`${heading('Your visit','Who are you visiting as?','Choose a fictional adult. Use their supplied details, not your own.')}<form id="character-form" novalidate><fieldset class="character-options"><legend>Choose one supplied character</legend>${Object.entries(R.characters).map(([id,x])=>`<label class="character-option"><input type="radio" name="character" value="${id}">${portrait(x)}<span><strong>${esc(x.name)}</strong><span class="character-date">Birthdate: ${x.birthdate}</span><span>${esc(x.condition)}</span><small>Fictional adult</small></span></label>`).join('')}</fieldset><p class="footnote">Both are adults. Results are set in advance; no real age analysis takes place.</p><p class="form-error" id="form-error" role="alert"></p><div class="choice-footer"><button type="submit" class="button">Continue ${arrow}</button><button type="button" class="text-button" data-action="leave">Leave without access</button></div></form>`;
    }else if(d.stage==='declaration'||d.stage==='declaration-confirm'){
      content=`${heading('COMMONROOM / self-declaration','Enter the character’s birthdate.','A self-declaration does not verify age.')}<form id="declaration-form" novalidate><label class="field-label" for="fictional-birthdate">Fictional birthdate (YYYY-MM-DD)</label><input type="text" id="fictional-birthdate" inputmode="text" maxlength="10" pattern="${c.birthdate}" placeholder="YYYY-MM-DD" autocomplete="off" aria-describedby="date-help form-error" value="${d.choices.dateReady?c.birthdate:''}"><p class="footnote" id="date-help">Use ${c.birthdate} from ${esc(c.name)}’s card. Other dates are not accepted or saved.</p><button type="button" class="text-button" data-action="autofill">Use fictional details</button><p class="recipient-line"><strong>To COMMONROOM:</strong> the fictional birthdate only. No name or image.</p><p class="form-error" id="form-error" role="alert"></p><div class="choice-footer"><button type="submit" class="button">Send declaration ${arrow}</button><a class="text-button" href="index.html">Back to previews</a><button type="button" class="text-button" data-action="leave">Leave without sending</button></div></form>`;
    }else if(d.stage==='request'){
      content=`${heading('COMMONROOM / age confirmation','A sample check is needed.','Your birthdate declaration has been received. LENS will assess a sample; COMMONROOM decides access.')}<div class="choice-footer">${action('continue','Continue with LENS')}<button class="text-button" data-action="leave">Leave without access</button></div>`;
    }else if(d.stage==='face'||d.stage==='face-confirm'){
      const unavailable=M.profiles[d.profile].face==='unavailable',selected=d.stage==='face-confirm';
      content=`${heading('LENS / age estimate','Check a sample image.','LENS assesses the sample. COMMONROOM decides access.')}<p class="provider-intro">You are continuing with LENS, COMMONROOM’s verification provider.</p><div class="sample-strip">${portrait(c)}<div><strong>Character sample image</strong><p>To LENS: this image, used for a simulated age estimate. The estimate is returned to COMMONROOM.</p>${selected?'<span class="tag">✓ Sample selected</span>':unavailable?'':action('select-face','Use sample image',true)}</div></div>${selected?evidenceForm('face','<p>The selected image will be sent to LENS. No other information is added.</p>'):`<div class="choice-footer">${action('cannot-complete',unavailable?'This check is unavailable':'I cannot complete this check',true)}<button class="text-button" data-action="leave">Leave without sending</button></div>`}${details('About this simulation','<p>This is a built-in abstract image. No camera, upload or age-analysis model is used. The result is set in advance.</p>')}`;
    }else if(d.stage==='processing'){
      content=`${heading('LENS','Checking the sample…','This is a simulated check; no real age analysis takes place.')}<div class="simulation-progress" role="progressbar" aria-label="Simulated check in progress"><span></span></div><button class="button secondary" data-action="finish-processing">Skip animation ${arrow}</button>`;
    }else if(d.stage==='uncertain'){
      const unavailable=d.events.some(e=>e.unavailable);
      content=`${heading('LENS → COMMONROOM','Age could not be confirmed.',unavailable?'The sample check could not be completed. No image was sent or age estimated.':'In this fictional scenario, the estimate is too uncertain to confirm the 18+ requirement.')}<p class="result-line amber">! Access still restricted</p>${platformNote('now asks for a sample ID: an image showing the fictional name and birthdate.')}<div class="choice-footer">${action('document','Try the available alternative')}<button class="text-button" data-action="appeal">Request a review</button><button class="text-button" data-action="leave">Leave without access</button></div>${details('What was returned?',`<p>${esc(d.events.at(-1).received)}</p><p>The example result is set in advance. This is not a claim about a real provider’s accuracy or decision rules.</p>`)}`;
    }else if(d.stage==='document'||d.stage==='document-confirm'){
      if(!c.accepted_document){
        content=`${heading('LENS / ID alternative','No accepted ID is available.','Morgan’s character card does not include an ID accepted by this route. No document has been sent.')}<p>COMMONROOM keeps the discussion restricted. You can ask it to review the decision or leave.</p><div class="choice-footer">${action('unavailable-review','Request a review')}<button class="text-button" data-action="unavailable-leave">Leave without access</button><button class="text-button" data-action="unavailable-result">Keep this outcome</button><button class="text-button" data-action="back">Back</button></div>`;
      }else{
        const selected=d.stage==='document-confirm';
        content=`${heading('LENS / ID alternative','Provide a sample ID?','This adds the fictional name and birthdate shown on the ID image.')}<form id="document-form" novalidate><label class="document-choice"><input type="radio" name="document" value="${c.accepted_document}" ${selected?'checked':''}><span><strong>Alex’s sample ID</strong><span>Name: ${esc(c.name)}<br>Birthdate: ${c.birthdate}</span><span class="tiny">Fictional exhibition document</span></span></label><p class="recipient-line"><strong>To LENS:</strong> the ID image. LENS reads its birthdate for the age check.<br><strong>To COMMONROOM:</strong> the sample birthdate and result. The name and image stay out of that response.</p><p class="form-error" id="form-error" role="alert"></p><div class="choice-footer"><button type="submit" class="button">Send sample ID ${arrow}</button><button type="button" class="text-button" data-action="back">Back</button><button type="button" class="text-button" data-action="leave">Leave without sending</button></div></form>${details('What is on this sample?',`<p>${R.documents[c.accepted_document].fields.map(esc).join(' · ')}.</p><p>These fields and this interaction are fictional. The birthdate response draws on source S03; it is not a reconstruction of a real document-reading system.</p>`)}`;
      }
    }else if(d.stage==='failed'){
      content=`${heading('COMMONROOM','Access is still restricted.','No accepted ID was provided. You can request a review or leave.')}<div class="choice-footer">${action('appeal','Request a review')}<button class="text-button" data-action="close-result">Keep this outcome</button><button class="text-button" data-action="leave">Leave without access</button></div>`;
    }else if(d.stage==='appeal'){
      content=`${heading('To / COMMONROOM support','Request a review.','COMMONROOM controls access. The request will stay pending until reviewed.')}<form id="review-form" novalidate><fieldset class="reason-options"><legend>Why are you requesting a review?</legend>${Object.entries(R.review_reasons).map(([key,reason])=>`<label><input type="radio" name="review-reason" value="${key}" ${d.choices.reviewReason===key?'checked':''}>${esc(reason.label)}</label>`).join('')}</fieldset><p class="footnote">To COMMONROOM support: a case reference and your selected reason. No document is added.</p><p class="form-error" id="form-error" role="alert"></p><div class="choice-footer"><button class="button" type="submit">Send review request ${arrow}</button><button class="text-button" type="button" data-action="back">Back</button><button class="text-button" type="button" data-action="leave">Leave without sending</button></div></form>`;
    }else if(d.stage==='result'){
      const o=M.outcomes[d.outcome],p=posts[d.post]||posts.archive;
      content=`${heading('COMMONROOM / access decision',o.label,o.detail)}<p class="result-line ${o.tone}">${o.symbol} ${o.access}</p>${d.outcome==='pending'?'<p class="review-notice">Nothing was sent to a real service. This example does not specify a reply time.</p>':''}${d.outcome==='granted'?`<article class="opened-post"><p class="post-meta">${p.author} · afterhours</p><h2>${p.title}</h2><p>${p.body}</p><div class="comment"><p>${p.reply}</p><span class="tiny">ONE OF ${p.comments} FICTIONAL COMMENTS</span></div></article>`:'<p>The full discussion remains closed. Previews are still available.</p>'}<div class="next-chapter">${action('data','See your data trail')}</div>`;
    }
    main.innerHTML=`<div class="encounter"><section class="encounter-main">${sim}${d.stage!=='character'?characterCard(d):''}${content}</section>${['character','result'].includes(d.stage)?'':lostPost(d)}</div>`;
    if(d.stage==='processing'){
      const journey=d.id;
      processingTimer=setTimeout(()=>{if(state.draft?.id===journey&&M.transition(state.draft,'finish-processing')){if(state.draft.outcome)M.finish(state);update();}},matchMedia('(prefers-reduced-motion: reduce)').matches?0:1400);
    }
  }
  function orgLabel(name){
    const lens=name==='LENS';
    return `<span class="org-label org-${lens?'lens':'commonroom'}">${esc(name)}</span>`;
  }
  function flowArrow(){return '<span class="flow-arrow" aria-hidden="true">→</span><span class="sr-only"> to </span>';}
  function transfer(from,to){
    const actor=name=>name==='Character'?'<span class="flow-character">Character</span>':orgLabel(name);
    return `<span class="flow-transfer" data-from="${from==='Character'?'character':from==='LENS'?'lens':'commonroom'}" data-to="${to==='LENS'?'lens':'commonroom'}">${actor(from)}${flowArrow()}${actor(to)}</span>`;
  }
  function flowLegend(){return `<div class="flow-legend" aria-label="Organisations in this data trail"><span>${orgLabel('COMMONROOM')} <span>Decides access</span></span><span>${orgLabel('LENS')} <span>Assesses evidence</span></span></div>`;}
  function disclosureSummary(r){
    const first=r.events.find(e=>e.method==='declaration'&&e.data.length),later=r.events.filter(e=>e.method!=='declaration'&&e.data.length);
    const label=e=>e.method==='face'?'Sample image':e.method==='document'?'ID image: name and birthdate':'Case reference and review reason';
    const returned=r.events.filter(e=>e.data.length&&e.processor==='LENS');
    const results=returned.length?`<section class="result-transfers" aria-label="Age results returned to the platform"><p class="eyebrow">Results returned</p><ul>${returned.map(e=>`<li data-event-id="${e.eventId}">${transfer('LENS','COMMONROOM')}<span>${esc(e.received)}</span></li>`).join('')}</ul></section>`:'';
    const entry=(label,to)=>`<div class="disclosure-entry"><span>${label}</span>${transfer('Character',to)}</div>`;
    return `${flowLegend()}<section class="disclosure-comparison" aria-label="First submission and additional disclosure"><div><p class="eyebrow">First sent</p>${first?entry('Birthdate declaration','COMMONROOM'):'<p>Nothing sent.</p>'}</div><div><p class="eyebrow">Added later</p>${later.length?later.map(e=>entry(label(e),e.processor)).join(''):'<p>Nothing further sent.</p>'}</div></section>${results}${M.requestedNotProvided(r).length?`<p class="unsent-summary"><strong>Not sent:</strong> ${M.requestedNotProvided(r).map(x=>({face:'sample image',document:'ID sample',declaration:'birthdate declaration',appeal:'review request'}[x.method])).join(', ')}.</p>`:''}`;
  }
  function timeline(r){
    const events=r.events.map(e=>{
      const sent=e.data.length>0,lens=sent&&e.processor==='LENS',actor=lens?'lens':sent?'commonroom':'none';
      const title=e.document_unavailable?'No accepted ID available':e.unavailable?'Sample check unavailable':e.method==='declaration'?'Self-declaration received':e.method==='face'?'Sample assessed':e.method==='document'?'ID assessed':'Review requested';
      return `<li data-actor="${actor}" data-method="${e.method}" data-sent="${sent}"><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-actor">${sent?orgLabel(e.processor):'<span class="flow-no-transfer">No evidence sent</span>'}</div><h2>${title}</h2><dl class="process-facts"><div><dt>Requested by ${orgLabel('COMMONROOM')}</dt><dd>${R.methods[e.method].request.map(esc).join(' · ')}</dd></div><div class="sent-fact"><dt>Actually sent</dt><dd>${sent?`<div class="transfer-caption">${transfer('Character',e.processor)}</div>${e.data.map(esc).join(' · ')}`:'Nothing'}</dd></div><div><dt>${e.method==='declaration'?'Declaration':e.method==='appeal'?'Review status':'Assessment'}</dt><dd>${esc(e.assessment)}</dd></div><div class="returned-fact"><dt>${lens?'Result returned':'Platform record'}</dt><dd>${lens?`<div class="transfer-caption">${transfer('LENS','COMMONROOM')}</div>`:`<div class="transfer-caption">${orgLabel('COMMONROOM')}</div>`}${esc(e.received)}</dd></div></dl></li>`;
    }).join('');
    return `<ol class="data-timeline"><li data-actor="commonroom"><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-actor">${orgLabel('COMMONROOM')}<span class="eyebrow">Access request</span></div><h2>A request to read more</h2><p>You opened “${esc(posts[r.post]?.title||posts.archive.title)}”. Its full discussion and comments require age confirmation under this fictional community rule.</p></li>${events}<li data-actor="commonroom"><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-actor">${orgLabel('COMMONROOM')}<span class="eyebrow">Access decision</span></div><h2>${M.outcomes[r.outcome].symbol} ${M.outcomes[r.outcome].label}</h2><p>${esc(M.outcomes[r.outcome].detail)}</p></li></ol>`;
  }
  function browserNote(r){return details('Saved on this browser',r.fixed?'<p>This page reads a fixed example. It does not read or save your visit history.</p>':'<p>This tab saves character, sample and event IDs, your choices, and the current step. It does not save typed dates or image contents.</p><p>Start a new visit clears this tab’s history. Refresh keeps the current step. Other devices cannot retrieve it.</p>');}
  function afterlife(r){return `<section class="afterlife"><h2>Materials and records are different</h2><p>An image is input. An age estimate or birthdate is a result. A case status records what happened.</p>${details('In this fictional experience','<p>LENS is fictional. Its processing location, deletion log and the lifetime of the example records are not specified. No real image is collected or checked.</p>')}${details('What the research sources say',`${R.retention.slice(0,2).map(item=>`<p><strong>${esc(item.scope)}</strong> (${item.source_ids.join(', ')}): ${esc(item.text)}</p>`).join('')}<p class="footnote">These are published statements about the named services, not verified deletion logs or rules for fictional LENS.</p>`)}${details('What is not explained',`<ul>${M.unknownItems(r).map(u=>`<li><strong>${u.origin==='Source gap'?'Source gap':'Fictional setting'}</strong>: ${esc(u.text)}</li>`).join('')}</ul>`)}</section>`;}
  function future(){return details('Speculative future / '+esc(R.future.title),`<section class="future"><p class="eyebrow">SPECULATIVE · NOT AN OBSERVED SYSTEM</p><h2>“${esc(R.future.label)}”</h2><p>${esc(R.future.text)}</p></section>`);}
  function missing(){main.innerHTML=`<section class="empty">${heading('No matching record','This record is not here.',fixed?'Use a recognised scenario code, such as CR-02. No private account or browser history can be looked up here.':'Finish a visit in this tab to make a record. Local slip links do not work on another device.')}<a class="button" href="index.html">Visit COMMONROOM ↗</a>${fixed?'<p><a href="record.html?scenario=CR-02">Read fixed scenario CR-02</a></p>':''}</section>`;}
  function visitDetails(r){return details('About this visit',`<p>${esc(M.scenarios[r.scenario].title)} · <span class="mono">${r.scenario}</span></p><p>Results are set in advance. No real age analysis takes place. See the research notes for the relationship to real services.</p>`);}
  function dataPage(){const r=record();if(!r){missing();return;}const result=M.summary(r);main.dataset.recordScenario=r.scenario;main.innerHTML=`<div class="trail-page">${heading('Data trail / What happened to your data?',result.title,result.description)}${disclosureSummary(r)}${details('See the full process',timeline(r))}${characterCard(r)}${visitDetails(r)}${afterlife(r)}${browserNote(r)}${backstage()}<div class="next-chapter"><a class="button" href="passport.html?record=${encodeURIComponent(r.id)}">Keep this in your passport ${arrow}</a></div></div>`;}
  function cardFieldLabel(f){
    if(f.key==='received')return `${orgLabel('LENS')} <span class="card-flow-arrow">→</span> ${orgLabel('COMMONROOM')}`;
    if(f.key==='assessment')return `${orgLabel('LENS')}<span class="card-field-description">assessment</span>`;
    if(f.key==='access'||f.key==='review')return `${orgLabel('COMMONROOM')}<span class="card-field-description">${f.key==='access'?'access decision':'review'}</span>`;
    return esc(f.label);
  }
  function card(r){const o=M.outcomes[r.outcome];return `<article class="data-card" aria-label="Scenario record card ${r.scenario}"><div class="card-top"><p class="eyebrow">Age Verification Passport / ${R.edition}<br>UK · fictional content gate</p><span class="tiny">${r.scenario}</span></div><p class="record-number mono">${esc(r.id)}</p><span class="stamp ${o.tone}">${o.symbol} ${o.stamp}</span><p class="card-title">afterhours / ${esc(r.post)}${r.characterId?" · "+esc(r.characterId):""}</p><dl>${M.recordFields(r).map(f=>`<div data-field="${f.key}"><dt>${cardFieldLabel(f)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl><p class="tiny card-disclaimer">FICTIONAL SCENARIO · NO REAL AGE ASSESSMENT<br>NOT PROOF OF AGE · SOURCES CHECKED ${R.checked}</p></article>`;}
  function passportPage(){const r=record();if(!r){missing();return;}main.innerHTML=`${heading('Passport','Your visit record','Print the card and place it in your physical passport.')}${characterCard(r)}<div class="record-layout"><section id="record-card">${card(r)}</section><section class="physical-guide"><p class="eyebrow">Your paper record</p><h2>Keep a trace of this visit.</h2><div class="instruction"><span class="number">1</span><p>Print or download the card.<small>Card: 105 × 148 mm. Template slot: 109 × 152 mm. Print at 100% and cut along the border.</small></p></div><div class="instruction"><span class="number">2</span><p>Insert it and stamp <strong>${M.outcomes[r.outcome].stamp}</strong>.<small>Write scenario ${r.scenario} beside the stamp. It records the encounter, not your age.</small></p></div><div class="button-row">${action('print-card','Print card')}${action('download','Download card',true)}<button class="text-button" data-action="print-passport">Print passport template ↗</button></div><label class="checkbox"><input id="attached" type="checkbox" ${r.attached?'checked':''}><span>I have inserted or stamped this card.<small class="muted">Saved for this tab only.</small></span></label><div class="button-row"><a class="text-button" href="data.html?record=${encodeURIComponent(r.id)}">Back to the data trail ↗</a><button class="text-button" data-action="scenarios">Try another example ↗</button></div></section></div><div class="trail-page lower">${future()}${state.records.length>1?details('Earlier slips in this tab',`<ul class="slip-list">${state.records.map(x=>`<li><a href="passport.html?record=${encodeURIComponent(x.id)}">${x.scenario} · ${esc(M.scenarios[x.scenario].title)}</a> — ${M.outcomes[x.outcome].stamp}</li>`).join('')}</ul><p>These slips are saved in this tab only.</p>`):''}</div>`;}
  function fixedPage(){const r=record();if(!r){missing();return;}document.title=`${r.scenario} — Fictional scenario record`;main.innerHTML=`<div class="trail-page public-record">${heading('Fixed example / '+r.scenario,M.scenarios[r.scenario].title,'This is a fixed example, not a personal account. It does not restore anyone’s visit history.')}${characterCard(r)}<p class="scenario-caption">${R.scenarios[r.scenario].archived?"Archived edition 03 example. ":""}Everyone opening ${r.scenario} sees this fixed route example. It shows the route’s submitted information, institutions, assessment and result.</p>${badge(r.outcome)}${disclosureSummary(r)}${timeline(r)}${afterlife(r)}${browserNote(r)}${backstage()}${future()}<div class="next-chapter"><a class="button" href="index.html">Experience the community ${arrow}</a></div></div>`;}
  function printTemplate(){return `<p class="print-guide">Print at 100% · Cut the outer border · Fold at the centre · Finished passport: 130 × 182 mm</p><section class="passport-template"><div class="passport-cover-page"><div class="passport-cover"><p class="tiny">A RECORD OF PARTICIPATION</p><span class="passport-symbol">↔</span><p class="title">Age Verification<br>Passport</p><span class="tiny">FICTIONAL EXHIBITION · EDITION ${R.edition}<br>NOT PROOF OF AGE</span></div></div><div class="passport-entry"><p class="entry-heading">VISIT RECORD / ${R.edition}</p><div class="insert-slot"><p class="slot-caption">CARD AREA · 109 × 152 mm</p><div class="card-fit-outline"><span>105 × 148 mm card<br>Place your printed record here.</span></div></div><p class="entry-note">Keep cards together to compare visits.<br>Fictional record · No real age assessment · Not proof of age.</p></div></section>`;}
  function print(kind){const r=record();if(!r)return;const box=document.querySelector('#print-area');box.className=kind==='passport'?'passport-print':'';box.innerHTML=kind==='passport'?printTemplate():`<p class="print-guide">Print at 100% · Cut the border · Keep with your physical passport</p><div class="print-card">${card(r)}</div>`;window.print();}
  function download(){
    const r=record();if(!r)return;const o=M.outcomes[r.outcome];let y=158,lines='';
    function wrap(text,limit=55){const words=text.split(/\s+/).flatMap(w=>w.length>limit?w.match(new RegExp('.{1,'+limit+'}','g')):[w]),out=[];let line='';for(const w of words){if((line+' '+w).length>limit&&line){out.push(line);line=w;}else line=(line+' '+w).trim();}if(line)out.push(line);return out;}
    for(const f of M.recordFields(r)){
      const labels=wrap(f.label.toUpperCase(),20),rows=wrap(f.value,47),colour=f.key==='assessment'?'#173F76':['access','review'].includes(f.key)?'#9E341F':'#252824';
      labels.forEach((line,i)=>{
        const label=f.key==='received'?'<tspan fill="#173F76">LENS</tspan><tspan fill="#656A62"> → </tspan><tspan fill="#9E341F">COMMONROOM</tspan>':esc(line);
        lines+=`<text x="25" y="${y+i*18}" font-family="monospace" font-size="10.5" fill="${colour}">${label}</text>`;
      });
      rows.forEach((line,i)=>lines+=`<text x="185" y="${y+i*18}" font-size="15">${esc(line)}</text>`);
      y+=Math.max(labels.length,rows.length)*18+11;
    }
    const stampColor=o.tone==='green'?'#2F6247':o.tone==='amber'?'#80570F':'#993F2A';
    if(y>790){announce('This card has more text than the fixed download size. Use Print card for its full fields.');return;}
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="105mm" height="148mm" viewBox="0 0 600 846"><rect x="1" y="1" width="598" height="844" fill="white" stroke="#D8D5CE"/><rect width="5" height="846" fill="#252824"/><g font-family="Arial,sans-serif" fill="#252824"><text x="25" y="27" font-size="11">AGE VERIFICATION PASSPORT / UK / FICTIONAL RECORD</text><text x="25" y="52" font-family="monospace" font-size="13">${esc(r.id)} / ${r.scenario}</text><rect x="25" y="68" width="220" height="37" fill="none" stroke="${stampColor}"/><text x="35" y="94" font-size="21" fill="${stampColor}">${o.symbol} ${o.stamp}</text><text x="25" y="132" font-size="16">COMMONROOM / afterhours / ${esc(r.post)}${r.characterId?" / "+esc(r.characterId):""}</text>${lines}<text x="25" y="814" font-size="10">FICTIONAL SCENARIO · NO REAL AGE ASSESSMENT · NOT PROOF OF AGE</text><text x="25" y="835" font-size="9">SOURCES CHECKED ${R.checked} · SEE DIGITAL RECORD FOR SOURCE LINKS</text></g></svg>`;
    const blob=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));const a=document.createElement('a');a.href=blob;a.download=`${r.id}-scenario-card.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(blob),1000);announce('Scenario card downloaded.');
  }
  function formError(text){const e=document.querySelector('#form-error');if(e){e.textContent=text;e.setAttribute('tabindex','-1');e.focus();}}
  document.addEventListener('input',e=>{if(e.target.id==='fictional-birthdate')e.target.dataset.mode='manual';});
  document.addEventListener('submit',e=>{
    const form=e.target;if(!['character-form','declaration-form','evidence-form','document-form','review-form'].includes(form.id))return;e.preventDefault();
    const d=state.draft;let accepted=false;
    if(form.id==='character-form'){
      const id=form.querySelector('input[name=character]:checked')?.value;
      accepted=M.transition(d,'choose-character',{characterId:id});if(!accepted){formError('Choose one of the supplied fictional characters.');return;}
    }else if(form.id==='declaration-form'){
      const input=form.querySelector('#fictional-birthdate');
      accepted=d.stage==='declaration-confirm'&&input.value===M.getCharacter(d).birthdate?true:M.transition(d,'check-declaration',{date:input.value,mode:input.dataset.mode});
      if(!accepted){input.value='';input.removeAttribute('data-mode');input.setAttribute('aria-invalid','true');formError('Use the birthdate on the supplied character card. Other dates are not accepted or saved.');return;}
      accepted=M.transition(d,'send-declaration',{confirm:true});
    }else if(form.id==='evidence-form'){
      accepted=M.transition(d,'send-'+form.dataset.kind,{confirm:true});
    }else if(form.id==='document-form'){
      const sampleId=form.querySelector('input[name=document]:checked')?.value;
      accepted=(d.stage==='document-confirm'&&sampleId===d.choices.documentSample)||M.transition(d,'select-document',{sampleId});if(!accepted){formError('Select the sample ID, or leave without sending.');return;}
      accepted=M.transition(d,'send-document',{confirm:true});
    }else if(form.id==='review-form'){
      const reason=form.querySelector('input[name=review-reason]:checked')?.value;
      accepted=M.transition(d,'choose-reason',{reason})&&M.transition(d,'send-review');
      if(!accepted){formError('Select one of the supplied review reasons.');return;}
    }
    if(accepted){if(d.outcome)M.finish(state);update();}
  });
  document.addEventListener('change',e=>{if(e.target.name==='review-reason'){if(M.transition(state.draft,'choose-reason',{reason:e.target.value}))save();}if(e.target.id==='demo-profile'){state.profile=e.target.value;save();announce('Demo account selected. The platform still determines the method.');}if(e.target.id==='attached'){const r=record();if(r){r.attached=e.target.checked;save();announce('Physical passport note updated for this tab.');}}});
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
    if(a==='scenarios'){dialog.showModal();const settings=document.querySelector('#scenario-settings');if(settings){settings.open=true;settings.scrollIntoView({block:'start'});document.querySelector('#profile').focus();}return;}if(a==='research'){dialog.showModal();return;}if(a==='close'){dialog.close();return;}
    if(a==='reset'){if(confirm('Start a new visitor? Clear this tab’s visit, slips and older prototype records in this browser. Printed cards remain.')){try{for(const key of ['age-verification-passport-v1','age-verification-passport-v2','age-verification-passport-v3','age-verification-passport-v4',KEY]){try{sessionStorage.removeItem(key);}catch{}try{localStorage.removeItem(key);}catch{}}}catch{}state=M.newPassport();save();go('index.html');}return;}
    if(a==='autofill'){const c=M.getCharacter(state.draft),input=document.querySelector('#fictional-birthdate');if(c&&input){input.value=c.birthdate;input.dataset.mode='supplied';input.focus();announce('Fictional details filled from the supplied character card.');}return;}
    if(a==='open-discussion'&&state.draft?.outcome==='granted'&&state.draft.post===b.dataset.post){go('verify.html');return;}
    if(['unavailable-review','unavailable-leave','unavailable-result'].includes(a)){if(M.transition(state.draft,'document-unavailable')){M.transition(state.draft,a==='unavailable-review'?'appeal':a==='unavailable-result'?'close-result':'leave');if(state.draft.outcome)M.finish(state);update();}return;}
    if(a==='start'){start(b.dataset.post);return;}
    if(a==='preset'){profile=document.querySelector('#profile').value;start('archive',true);return;}
    if(a==='print-card'){print('card');return;}if(a==='print-passport'){print('passport');return;}if(a==='download'){download();return;}
    if(a==='data'){const r=M.finish(state);save();if(r)go(`data.html?record=${encodeURIComponent(r.id)}`);return;}
    if(!fixed&&M.transition(state.draft,a)){if(state.draft.outcome)M.finish(state);save();verifyPage();focusMain();}
  });
  // Refresh from tab storage after browser Back; do not resurrect a pre-reset page.
  addEventListener('pageshow',e=>{if(e.persisted&&!fixed)location.reload();});
  if(fixed||page==='passport')document.body.dataset.service='passport';
  if(page==='request')requestPage();else if(page==='verify')verifyPage();else if(page==='data')dataPage();else if(page==='passport')passportPage();else if(fixed)fixedPage();
})().catch(error=>{
  console.error(error);
  const main=document.querySelector('main');
  main.innerHTML='<section class="empty"><h1>The exhibition could not load.</h1><p>Serve master_web with a local web server and check that data/research.json is available.</p><a href="index.html">Try again</a></section>';
});
