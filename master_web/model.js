/* Shared state machine. Content and preset rules come from data/research.json. */
(() => {
  'use strict';
  function createLegacy(research) {
    const {profiles,outcomes,scenarios,events,methods}=research;
    const copy=value=>JSON.parse(JSON.stringify(value));
    const has=(object,key)=>Object.hasOwn(object,key);
    function random(){
      if(globalThis.crypto?.getRandomValues)return Array.from(crypto.getRandomValues(new Uint8Array(4)),x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
      return Math.random().toString(16).slice(2,10).toUpperCase().padEnd(8,'0');
    }
    function newPassport(){return {version:3,id:`AVP-${random()}`,profile:'edge',records:[],draft:null};}
    function begin(state,profile=state.profile||'edge',post='archive'){
      if(!has(profiles,profile))profile='edge';
      state.profile=profile;
      state.draft={id:random(),profile,post:has(research.posts,post)?post:'archive',stage:'request',events:[],outcome:null};
      return state.draft;
    }
    function add(d,eventId){d.events.push({...copy(events[eventId]),eventId});}
    function transition(d,action){
      if(!d||!has(profiles,d.profile)||d.outcome)return false;
      if(action==='leave'&&['request','face','uncertain','document','failed','appeal'].includes(d.stage)){d.outcome='withdrawn';d.stage='result';return true;}
      if(d.stage==='request'&&action==='continue'){d.stage='face';return true;}
      if(d.stage==='face'&&action==='cannot-complete'){add(d,'face_unavailable');d.stage='uncertain';return true;}
      if(d.stage==='face'&&action==='submit-face'&&profiles[d.profile].face!=='unavailable'){
        const clear=profiles[d.profile].face==='clear';add(d,clear?'face_clear':'face_uncertain');
        if(clear){d.outcome='granted';d.stage='result';}else d.stage='uncertain';return true;
      }
      if(d.stage==='uncertain'&&action==='document'){d.stage='document';return true;}
      if(d.stage==='document'&&action==='back'){d.stage='uncertain';return true;}
      if(d.stage==='document'&&action==='submit-document'){
        const accepted=profiles[d.profile].document==='accepted';add(d,accepted?'document_accepted':'document_unsupported');
        if(accepted){d.outcome='granted';d.stage='result';}else d.stage='failed';return true;
      }
      if(['uncertain','failed'].includes(d.stage)&&action==='appeal'){d.returnStage=d.stage;d.stage='appeal';return true;}
      if(d.stage==='appeal'&&action==='back'){d.stage=d.returnStage;return true;}
      if(d.stage==='appeal'&&action==='submit-appeal'){add(d,'appeal');d.outcome='pending';d.stage='result';return true;}
      if(d.stage==='failed'&&action==='close-result'){d.outcome='unconfirmed';d.stage='result';return true;}
      return false;
    }
    function scenarioId(d){
      if(!d?.outcome)return null;
      const doc=d.events.some(e=>e.method==='document'),missing=d.events.some(e=>e.unavailable);
      if(missing)return d.outcome==='granted'?'CR-09':d.outcome==='pending'?(doc?'CR-13':'CR-10'):d.outcome==='unconfirmed'?'CR-12':doc?'CR-14':'CR-11';
      if(d.outcome==='granted')return doc?'CR-02':'CR-01';
      if(d.outcome==='pending')return doc?'CR-07':'CR-03';
      if(d.outcome==='unconfirmed')return 'CR-06';
      return !d.events.length?'CR-05':doc?'CR-08':'CR-04';
    }
    function finish(state){
      const d=state.draft;if(!d?.outcome)return null;
      const existing=state.records.find(r=>r.journeyId===d.id);if(existing)return existing;
      const r={id:`${state.id}-${String(state.records.length+1).padStart(3,'0')}`,journeyId:d.id,scenario:scenarioId(d),country:research.context.country_code,post:d.post,
        created:new Date().toISOString(),events:copy(d.events),outcome:d.outcome,attached:false};state.records.push(r);return r;
    }
    function scenarioRecord(id){
      if(!has(scenarios,id))return null;
      const s=newPassport(),d=begin(s,scenarios[id].profile);
      scenarios[id].actions.forEach(a=>transition(d,a));
      return {id,scenario:id,country:research.context.country_code,post:'archive',events:d.events,outcome:d.outcome,fixed:true};
    }
    const disclosures=r=>[...new Set(r.events.flatMap(e=>e.data))];
    const judgment=r=>[...r.events].reverse().find(e=>e.method!=='appeal')?.assessment||'No age assessment made';
    const sourceIds=r=>[...new Set(['S01','S02',...r.events.flatMap(e=>e.source_ids),...(r.events.some(e=>e.method==='document')?['S04']:[])])];
    function unknownItems(r){return [r.events.some(e=>e.method!=='appeal'&&e.data.length)?'U1':null,'U2',r.outcome==='pending'?'U3':null,'U4'].filter(Boolean).map(id=>({id,...research.unknowns[id]}));}
    const unknowns=r=>unknownItems(r).map(u=>`${u.id} / ${u.origin}: ${u.text}`);
    function recordFields(r){
      const supplied=disclosures(r),last=[...r.events].reverse().find(e=>e.method!=='appeal'),appeal=r.events.some(e=>e.method==='appeal');
      const attempts=r.events.filter(e=>e.method!=='appeal').length,fallback=r.events.filter(e=>e.method==='document').length;
      const inputs=[];if(supplied.includes('Fictional face sample'))inputs.push('Face sample');if(supplied.includes('Fictional ID page'))inputs.push('ID page (name, birthdate)');if(appeal)inputs.push('Case reference + request');
      const recipients=[...new Set([...r.events.filter(e=>e.data.length).map(e=>e.processor),...(r.events.length?['COMMONROOM']:[])])];
      const fictional=unknownItems(r).filter(u=>u.tag==='fictional').map(u=>u.compact).join(', ');
      const values={methods:`${research.context.country_code} / ${r.events.length?r.events.map(e=>e.unavailable?'Face unavailable':methods[e.method].name).join(' → '):'Exit before check'}`,
        submitted:inputs.join('; ')||'No evidence submitted',recipients:recipients.join('; ')||'No evidence recipient',assessment:last?.short_assessment||'No age assessment',
        received:(last?.short_received||'No age result')+(appeal?'; review request':''),access:`${outcomes[r.outcome].symbol} ${outcomes[r.outcome].decision}`,
        followup:`${attempts} check attempt${attempts===1?'':'s'}; ${fallback} fallback; ${appeal?'review pending':'no appeal'}`,
        sources:sourceIds(r).join(' · '),unknowns:`Fictional: ${fictional}. Source gap: ${unknownItems(r).filter(u=>u.origin==='Source gap').map(u=>u.compact).join(', ')}.`};
      return Object.entries(research.record_fields).map(([key,label])=>({key,label,value:values[key]}));
    }
    function validState(s){
      if(s?.version!==3||!/^AVP-[A-F0-9]{8}$/.test(s.id)||!Array.isArray(s.records)||!has(profiles,s.profile))return false;
      if(s.records.some(r=>!has(scenarios,r.scenario)||!has(outcomes,r.outcome)||!Array.isArray(r.events)||r.events.some(e=>!has(events,e.eventId))))return false;
      return !s.draft||(has(profiles,s.draft.profile)&&['request','face','uncertain','document','failed','appeal','result'].includes(s.draft.stage)&&Array.isArray(s.draft.events)&&s.draft.events.every(e=>has(events,e.eventId))&&(!s.draft.outcome||has(outcomes,s.draft.outcome))&&(s.draft.stage!=='result'||!!s.draft.outcome));
    }
    return {research,profiles,outcomes,scenarios,newPassport,begin,transition,scenarioId,finish,scenarioRecord,disclosures,judgment,unknowns,unknownItems,sourceIds,recordFields,validState};
  }
  function create(research){
    const legacy=createLegacy(research),copy=x=>JSON.parse(JSON.stringify(x)),has=(o,k)=>Object.hasOwn(o,k);
    const stages=['character','declaration','declaration-confirm','request','face','face-confirm','processing','uncertain','document','document-confirm','failed','appeal','result'];
    const methods=['declaration','face','document','appeal'];
    const getCharacter=d=>research.characters[d?.characterId]||null;
    const freshChoices=()=>({dateReady:false,dateEntry:null,faceSample:null,documentSample:null,reviewReason:null});
    function newPassport(){const s=legacy.newPassport();s.version=4;s.edition=research.edition;s.profile='edge';return s;}
    function begin(s,profile=s.profile||'edge',post='archive'){
      if(!research.active_profiles.includes(profile))profile='edge';s.profile=profile;
      const d=legacy.begin(s,profile,post);Object.assign(d,{stage:'character',characterId:null,requests:[],choices:freshChoices()});return d;
    }
    function request(d,key){if(!d.requests.includes(key))d.requests.push(key);}
    function add(d,id){
      const e={...copy(research.events[id]),eventId:id};
      if(id==='appeal')e.data.push('Review reason: '+research.review_reasons[d.choices.reviewReason].label);
      d.events.push(e);
    }
    function transition(d,a,p={}){
      if(!d||d.outcome||!stages.includes(d.stage))return false;
      if(a==='leave'&&d.stage!=='processing'){d.outcome='withdrawn';d.stage='result';return true;}
      if(d.stage==='character'&&a==='choose-character'&&has(research.characters,p.characterId)){
        d.characterId=p.characterId;request(d,'declaration');d.stage='declaration';return true;
      }
      const c=getCharacter(d);if(!c)return false;
      if(d.stage==='declaration'&&a==='check-declaration'){
        if(typeof p.date!=='string'||p.date!==c.birthdate)return false;
        d.choices.dateReady=true;d.choices.dateEntry=p.mode==='supplied'?'supplied':'manual';d.stage='declaration-confirm';return true;
      }
      if(d.stage==='declaration-confirm'&&a==='send-declaration'&&d.choices.dateReady&&p.confirm===true){add(d,'declaration');request(d,'face');d.stage='request';return true;}
      if(d.stage==='declaration-confirm'&&a==='back'){d.stage='declaration';return true;}
      if(d.stage==='request'&&a==='continue'){d.stage='face';return true;}
      if(d.stage==='face'&&a==='select-face'&&research.profiles[d.profile].face!=='unavailable'){
        d.choices.faceSample=c.face_sample;d.stage='face-confirm';return true;
      }
      if(d.stage==='face-confirm'&&a==='back'){d.stage='face';return true;}
      if(['face','face-confirm'].includes(d.stage)&&a==='cannot-complete'){add(d,'face_unavailable');request(d,'document');d.stage='uncertain';return true;}
      if(d.stage==='face-confirm'&&a==='send-face'&&d.choices.faceSample===c.face_sample&&p.confirm===true){
        add(d,research.profiles[d.profile].face==='clear'?'face_clear':'face_uncertain');d.stage='processing';return true;
      }
      if(d.stage==='processing'&&a==='finish-processing'){
        if(d.events.at(-1).eventId==='face_clear'){d.outcome='granted';d.stage='result';}
        else{request(d,'document');d.stage='uncertain';}return true;
      }
      if(d.stage==='uncertain'&&a==='document'){d.stage='document';return true;}
      if(d.stage==='document'&&a==='select-document'&&c.accepted_document&&p.sampleId===c.accepted_document){
        d.choices.documentSample=p.sampleId;d.stage='document-confirm';return true;
      }
      if(d.stage==='document-confirm'&&a==='send-document'&&c.accepted_document&&d.choices.documentSample===c.accepted_document&&p.confirm===true){
        add(d,'document_accepted');d.outcome='granted';d.stage='result';return true;
      }
      if(d.stage==='document'&&a==='document-unavailable'&&!c.accepted_document){add(d,'document_missing');d.stage='failed';return true;}
      if(['document','document-confirm'].includes(d.stage)&&a==='back'){d.stage=d.stage==='document-confirm'?'document':'uncertain';return true;}
      if(['uncertain','failed'].includes(d.stage)&&a==='appeal'){d.returnStage=d.stage;request(d,'appeal');d.stage='appeal';return true;}
      if(d.stage==='appeal'&&a==='choose-reason'&&has(research.review_reasons,p.reason)){d.choices.reviewReason=p.reason;return true;}
      if(d.stage==='appeal'&&a==='send-review'&&has(research.review_reasons,d.choices.reviewReason)){
        add(d,'appeal');d.outcome='pending';d.stage='result';return true;
      }
      if(d.stage==='appeal'&&a==='back'){d.stage=d.returnStage;return true;}
      if(d.stage==='failed'&&a==='close-result'){d.outcome='unconfirmed';d.stage='result';return true;}
      return false;
    }
    function scenarioId(d){
      if(!d?.outcome)return null;if(!d.characterId)return 'FC-00';
      const noID=d.characterId==='C-02',face=d.events.find(e=>e.method==='face'),missing=!!face?.unavailable;
      const declared=d.events.some(e=>e.eventId==='declaration'),docMissing=d.events.some(e=>e.eventId==='document_missing');
      if(!declared)return noID?'FC-15':'FC-05';
      if(!face)return noID?'FC-16':'FC-06';
      if(d.outcome==='granted')return noID?'FC-10':missing?'FC-07':d.events.some(e=>e.method==='document')?'FC-02':'FC-01';
      if(d.outcome==='unconfirmed')return missing?'FC-22':'FC-21';
      if(d.outcome==='pending')return !noID?(missing?'FC-08':'FC-03'):docMissing?(missing?'FC-17':'FC-11'):(missing?'FC-19':'FC-13');
      return !noID?(missing?'FC-09':'FC-04'):docMissing?(missing?'FC-18':'FC-12'):(missing?'FC-20':'FC-14');
    }
    function finish(s){
      const d=s.draft;if(!d?.outcome)return null;const old=s.records.find(r=>r.journeyId===d.id);if(old)return old;
      const r={id:`${s.id}-${String(s.records.length+1).padStart(3,'0')}`,journeyId:d.id,scenario:scenarioId(d),characterId:d.characterId,
        country:research.context.country_code,profile:d.profile,post:d.post,requests:copy(d.requests),choices:copy(d.choices),events:copy(d.events),outcome:d.outcome,attached:false};s.records.push(r);return r;
    }
    function replay(id){
      if(!has(research.scenarios,id))return null;const example=research.scenarios[id];
      if(!example.interactive){const r=legacy.scenarioRecord(id);r.requests=['face'];if(r.events.some(e=>e.method==='document'||e.eventId==='face_uncertain'||e.eventId==='face_unavailable'))r.requests.push('document');if(r.events.some(e=>e.method==='appeal'))r.requests.push('appeal');return r;}
      const s=newPassport(),d=begin(s,example.profile);
      for(const a of example.actions){
        const c=research.characters[example.character_id];
        const payload=a==='choose-character'?{characterId:example.character_id}:a==='check-declaration'?{date:c.birthdate,mode:'supplied'}:
          ['send-declaration','send-face','send-document'].includes(a)?{confirm:true}:a==='select-document'?{sampleId:c.accepted_document}:
          a==='choose-reason'?{reason:example.reason||'review_assessment'}:{};
        if(!transition(d,a,payload))throw new Error(`Invalid fixed script: ${id} / ${a}`);
      }
      const r=finish(s);return {...r,id,scenario:id,fixed:true};
    }
    function requestedNotProvided(r){
      const provided=new Set(r.events.filter(e=>e.data.length).map(e=>e.method));
      return (r.requests||[]).filter(m=>!provided.has(m)).map(m=>({method:m,data:research.methods[m].request,recipient:research.methods[m].recipient}));
    }
    function unknownItems(r){return [r.events.some(e=>['face','document'].includes(e.method)&&e.data.length)?'U1':null,'U2',r.outcome==='pending'?'U3':null,'U4'].filter(Boolean).map(id=>({id,...research.unknowns[id]}));}
    function recordFields(r){
      const supplied=legacy.disclosures(r),decl=r.events.some(e=>e.method==='declaration'&&e.data.length),face=r.events.find(e=>e.method==='face'&&e.data.length),doc=r.events.find(e=>e.method==='document'&&e.data.length),review=r.events.some(e=>e.method==='appeal');
      const later=[];if(face)later.push('Face sample');if(doc)later.push('ID (name, DOB)');if(review)later.push('Case ref + review reason');
      const notProvided=requestedNotProvided(r).map(x=>({declaration:'Declared DOB',face:'Face sample',document:'ID page',appeal:'Review request'}[x.method]));
      const recipients=[...new Set(r.events.filter(e=>e.data.length).map(e=>e.processor))];
      if(face||doc)recipients.push('COMMONROOM (result)');
      const checks=r.events.filter(e=>['face','document'].includes(e.method)).length,alternative=r.events.filter(e=>e.method==='document').length;
      const reason=research.review_reasons[r.choices?.reviewReason]?.short;
      const assessment=[face?`Estimate ${face.estimated_age}${face.eventId==='face_uncertain'?' (uncertain)':''}`:null,doc?(doc.eventId==='document_accepted'?'Sample ID accepted':'Sample ID not accepted'):null].filter(Boolean).join('; ')||'No age assessment performed';
      const returned=r.events.filter(e=>e.data.length&&e.processor==='LENS');
      const received=returned.map(e=>e.received.replace(/\.$/,'')).join('; later, ')||'No LENS result returned';
      const reviewStatus=review?`Pending; ${reason||'review requested'}; reply time unspecified`:(r.requests||[]).includes('appeal')?'Not submitted':'Not requested';
      const values={methods:r.events.map(e=>({declaration:'Declare DOB',face:e.unavailable?'No face':'Face',document:e.document_unavailable?'No ID':'ID',appeal:'Review'}[e.method])).join(' → ')||'No check',
        initial:decl?'DOB declaration → COMMONROOM; not independently checked':'Nothing submitted',additional:later.join('; ')||'Nothing further',not_provided:notProvided.join('; ')||'None outstanding',recipients:[...new Set(recipients)].join('; ')||'No evidence recipient',
        assessment,received,access:`${research.outcomes[r.outcome].symbol} ${research.outcomes[r.outcome].decision}`,followup:`${checks} attempt${checks===1?'':'s'} / ${alternative} alternative${alternative===1?'':'s'}`,review:reviewStatus,
        sources:legacy.sourceIds(r).join(' · '),unknowns:'Scenario: '+((face||doc)?'deletion / ':'')+'expiry'+(review?' / review time':'')+'. Source gap: audit.'};
      return Object.entries(research.record_fields).map(([key,label])=>({key,label,value:values[key]}));
    }
    function summary(r){
      const checks=r.events.filter(e=>['face','document'].includes(e.method)&&e.data.length).length;
      const count=checks===1?'one':checks===2?'two':String(checks);
      const title=r.outcome==='granted'?`Access granted after ${count} check${checks===1?'':'s'}`:r.outcome==='pending'?'Review pending':r.outcome==='withdrawn'?'You left without access':'Age could not be confirmed';
      const description=r.outcome==='granted'?'The full discussion and comments are now open.':r.outcome==='pending'?'The review request is waiting. The discussion is still restricted.':'The full discussion is still restricted. You can read the preview.';
      return {title,description,checks,attempts:r.events.filter(e=>['face','document'].includes(e.method)).length};
    }
    // Only whitelisted IDs, enums, booleans and route metadata reach browser storage.
    function packPart(p){if(!p)return null;const out={};
      for(const k of ['id','journeyId','scenario','characterId','country','profile','post','stage','returnStage','outcome','attached'])if(p[k]!==undefined)out[k]=p[k];
      out.eventIds=p.events.map(e=>e.eventId);out.requests=copy(p.requests||[]);out.choices=Object.fromEntries(Object.entries(freshChoices()).map(([key,value])=>[key,p.choices?.[key]??value]));return out;
    }
    function pack(s){return {version:4,edition:research.edition,id:s.id,profile:s.profile,draft:packPart(s.draft),records:s.records.map(packPart)};}
    function restore(raw){
      try{
        if(raw?.version!==4||raw.edition!==research.edition||!/^AVP-[A-F0-9]{8}$/.test(raw.id)||!research.active_profiles.includes(raw.profile)||!Array.isArray(raw.records))return null;
        if(Object.keys(raw).some(k=>!['version','edition','id','profile','draft','records'].includes(k)))return null;
        function part(p,done){
          if(!p||Object.keys(p).some(k=>!['id','journeyId','scenario','characterId','country','profile','post','stage','returnStage','outcome','attached','eventIds','requests','choices'].includes(k)))throw 0;
          if(p.characterId!==null&&!has(research.characters,p.characterId))throw 0;
          if(!research.active_profiles.includes(p.profile)||!has(research.posts,p.post)||!Array.isArray(p.eventIds)||p.eventIds.some(id=>!has(research.events,id)))throw 0;
          if(!Array.isArray(p.requests)||p.requests.some(m=>!methods.includes(m)))throw 0;
          const c=p.choices;if(!c||Object.keys(c).some(k=>!has(freshChoices(),k))||typeof c.dateReady!=='boolean'||![null,'manual','supplied'].includes(c.dateEntry))throw 0;
          const character=research.characters[p.characterId];
          if(c.faceSample!==null&&c.faceSample!==character?.face_sample)throw 0;
          if(c.documentSample!==null&&(!character?.accepted_document||c.documentSample!==character.accepted_document))throw 0;
          if(c.reviewReason!==null&&!has(research.review_reasons,c.reviewReason))throw 0;
          if(done&&(!has(research.scenarios,p.scenario)||!has(research.outcomes,p.outcome)))throw 0;
          if(!done&&(!stages.includes(p.stage)||(p.outcome&&!has(research.outcomes,p.outcome))||(p.stage==='result'&&!p.outcome)))throw 0;
          const expanded={...copy(p),events:p.eventIds.map(id=>({...copy(research.events[id]),eventId:id}))};delete expanded.eventIds;
          if(c.reviewReason)expanded.events.filter(e=>e.eventId==='appeal').forEach(e=>e.data.push('Review reason: '+research.review_reasons[c.reviewReason].label));
          return expanded;
        }
        return {...copy(raw),draft:raw.draft?part(raw.draft,false):null,records:raw.records.map(r=>part(r,true))};
      }catch{return null;}
    }
    return {...legacy,createLegacy:undefined,newPassport,begin,transition,scenarioId,finish,scenarioRecord:replay,requestedNotProvided,recordFields,getCharacter,summary,
      judgment:r=>[...r.events].reverse().find(e=>['face','document'].includes(e.method)&&e.data.length)?.assessment||'No age assessment made',unknownItems,unknowns:r=>unknownItems(r).map(u=>u.id+' / '+u.origin+': '+u.text),pack,restore,validState:s=>!!restore(s)};
  }
  globalThis.PassportModel={create};
})();
