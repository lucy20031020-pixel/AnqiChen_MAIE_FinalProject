const {test}=require('node:test');const assert=require('node:assert/strict');
require('../model.js');const R=require('../data/research.json'),M=PassportModel.create(R);
function start(char='C-01',profile='edge'){const s=M.newPassport();M.begin(s,profile);assert.ok(M.transition(s.draft,'choose-character',{characterId:char}));return s;}
function declare(s){const d=s.draft;assert.ok(M.transition(d,'check-declaration',{date:R.characters[d.characterId].birthdate,mode:'supplied'}));assert.ok(M.transition(d,'send-declaration',{confirm:true}));}
function face(s){const d=s.draft;M.transition(d,'continue');M.transition(d,'select-face');M.transition(d,'send-face',{confirm:true});M.transition(d,'finish-processing');}
for(const [id,script]of Object.entries(R.scenarios))test(`${id} retains its fixed example outcome`,()=>{const r=M.scenarioRecord(id);assert.equal(r.outcome,script.outcome);assert.ok(M.recordFields(r).every(f=>typeof f.value==='string'));});
test('wrong date is rejected without changing the state; correct date is a declaration, not verification',()=>{
 const s=start(),before=JSON.stringify(M.pack(s));assert.equal(M.transition(s.draft,'check-declaration',{date:'2000-01-02'}),false);assert.equal(JSON.stringify(M.pack(s)),before);
 assert.ok(M.transition(s.draft,'check-declaration',{date:R.characters['C-01'].birthdate}));assert.equal(M.disclosures(s.draft).length,0);
 assert.equal(M.transition(s.draft,'send-declaration',{confirm:false}),false);assert.ok(M.transition(s.draft,'send-declaration',{confirm:true}));
 assert.deepEqual(M.disclosures(s.draft),['Fictional birthdate declaration']);assert.equal(M.judgment(s.draft),'No age assessment made');
});
test('selection is not submission; sample requires confirmation; processing completes only once',()=>{
 const s=start();declare(s);M.transition(s.draft,'continue');M.transition(s.draft,'select-face');
 assert.equal(M.disclosures(s.draft).includes('Fictional face sample'),false);
 assert.equal(M.transition(s.draft,'send-face',{confirm:false}),false);
 assert.ok(M.transition(s.draft,'send-face',{confirm:true}));assert.equal(s.draft.stage,'processing');
 assert.ok(M.transition(s.draft,'finish-processing'));assert.equal(s.draft.stage,'uncertain');assert.equal(M.transition(s.draft,'finish-processing'),false);
});
test('a character without accepted ID cannot fabricate or send one',()=>{
 const s=start('C-02');declare(s);face(s);M.transition(s.draft,'document');
 assert.equal(M.transition(s.draft,'select-document',{sampleId:'DOC-A1'}),false);assert.equal(M.transition(s.draft,'send-document',{confirm:true}),false);
 assert.ok(M.transition(s.draft,'document-unavailable'));assert.equal(M.disclosures(s.draft).includes('Fictional ID page'),false);
 M.transition(s.draft,'appeal');assert.equal(M.transition(s.draft,'send-review'),false);M.transition(s.draft,'choose-reason',{reason:'no_document'});M.transition(s.draft,'send-review');
 const r=M.finish(s);assert.equal(r.outcome,'pending');assert.equal(r.scenario,'FC-11');assert.ok(M.requestedNotProvided(r).some(x=>x.method==='document'));
 assert.ok(r.events.at(-1).data.some(x=>x.includes(R.review_reasons.no_document.label)));
});
test('a selected document that is refused never enters Provided',()=>{
 const s=start();declare(s);face(s);M.transition(s.draft,'document');M.transition(s.draft,'select-document',{sampleId:'DOC-A1'});M.transition(s.draft,'leave');const r=M.finish(s);
 assert.equal(r.scenario,'FC-04');assert.ok(!M.disclosures(r).includes('Fictional ID page'));assert.ok(M.requestedNotProvided(r).some(x=>x.method==='document'));
});
test('first and additional disclosures are separate and match actual sent materials',()=>{
 const r=M.scenarioRecord('FC-02'),fields=Object.fromEntries(M.recordFields(r).map(f=>[f.key,f.value]));
 assert.match(fields.initial,/DOB declaration.*COMMONROOM; not independently checked/);assert.match(fields.additional,/Face sample; ID/);assert.equal(fields.not_provided,'None outstanding');assert.match(fields.access,/Granted/);
 const denied=M.scenarioRecord('FC-06');assert.equal(M.recordFields(denied).find(f=>f.key==='additional').value,'Nothing further');
});
test('packing stores IDs and choices, never names, birthdates or free input; refresh restores the same route',()=>{
 const s=start();declare(s);face(s);M.transition(s.draft,'appeal');M.transition(s.draft,'choose-reason',{reason:'review_assessment'});
 const raw=M.pack(s),serialized=JSON.stringify(raw);
 for(const c of Object.values(R.characters)){assert.ok(!serialized.includes(c.name));assert.ok(!serialized.includes(c.birthdate));}
 assert.ok(!serialized.includes('"assessment":'));assert.ok(!Object.hasOwn(raw.draft,'events'));
 const restored=M.restore(JSON.parse(serialized));assert.equal(restored.draft.stage,'appeal');assert.equal(restored.draft.choices.reviewReason,'review_assessment');assert.deepEqual(restored.draft.events,s.draft.events);
 const tampered=JSON.parse(serialized);tampered.draft.birthdate='2000-01-02';assert.equal(M.restore(tampered),null);
 s.draft.choices.extraInput='do not save';assert.ok(!JSON.stringify(M.pack(s)).includes('do not save'));
});
test('completed records are snapshots, idempotent and reconstruct after reload',()=>{
 const s=start('C-01','clear');declare(s);face(s);const r=M.finish(s);assert.equal(M.finish(s),r);assert.equal(s.records.length,1);
 assert.equal(M.restore(M.pack(s)).records[0].scenario,'FC-01');assert.equal(M.transition(s.draft,'send-face',{confirm:true}),false);
});
test('no facial sample and no estimate when the first step is unavailable',()=>{
 const s=start('C-02','unavailable');declare(s);M.transition(s.draft,'continue');M.transition(s.draft,'cannot-complete');
 assert.ok(!M.disclosures(s.draft).includes('Fictional face sample'));assert.equal(M.judgment(s.draft),'No age assessment made');
});
test('both characters are preset adults; all new interactions are fictional and legacy URLs remain',()=>{
 assert.equal(Object.keys(R.characters).length,2);assert.ok(Object.values(R.characters).every(c=>c.adult&&Number(c.birthdate.slice(0,4))<2000));
 assert.equal(R.characters['C-02'].accepted_document,null);assert.equal(R.methods.declaration.type,'self_declaration');assert.equal(R.events.declaration.tag,'fictional');assert.equal(M.scenarioRecord('CR-02').outcome,'granted');
 for(const id of ['__proto__','toString','FC-99',null])assert.equal(M.scenarioRecord(id),null);
});

test('result summaries count submitted checks, never declarations or unavailable samples',()=>{
 for(const [id,count] of Object.entries({'FC-01':1,'FC-02':2,'FC-06':0,'FC-07':1,'FC-17':0})){
  assert.equal(M.summary(M.scenarioRecord(id)).checks,count,id);
 }
 assert.equal(M.summary(M.scenarioRecord('FC-02')).title,'Access granted after two checks');
 assert.equal(M.summary(M.scenarioRecord('FC-11')).title,'Review pending');
});

test('an ID success retains the earlier uncertainty on its paper fields',()=>{
 assert.match(M.recordFields(M.scenarioRecord('FC-02')).find(f=>f.key==='assessment').value,/Estimate 18 \(uncertain\); Sample ID accepted/);
});

test('card fields name assessment, returned-result, access and review authorities',()=>{
 const fields=Object.fromEntries(M.recordFields(M.scenarioRecord('FC-02')).map(f=>[f.key,f]));
 assert.equal(fields.assessment.label,'LENS assessment');assert.equal(fields.received.label,'LENS → COMMONROOM');assert.equal(fields.access.label,'COMMONROOM access decision');assert.equal(fields.review.label,'COMMONROOM review');
 assert.match(fields.received.value,/Estimated age: 18; uncertain result; later, Sample date of birth; pass result/);
 assert.equal(fields.review.value,'Not requested');assert.equal(fields.followup.value,'2 attempts / 1 alternative');
 const pending=Object.fromEntries(M.recordFields(M.scenarioRecord('FC-11')).map(f=>[f.key,f.value]));assert.match(pending.review,/^Pending;.*reply time unspecified$/);assert.match(pending.access,/Pending/);
});
test('unsubmitted reviews and declarations cannot become provider assessments',()=>{
 const declarationOnly=start();declare(declarationOnly);M.transition(declarationOnly.draft,'leave');const first=Object.fromEntries(M.recordFields(M.finish(declarationOnly)).map(f=>[f.key,f.value]));const s=start();declare(s);assert.equal(first.assessment,'No age assessment performed');assert.equal(first.received,'No LENS result returned');
 face(s);M.transition(s.draft,'appeal');M.transition(s.draft,'choose-reason',{reason:'review_assessment'});M.transition(s.draft,'leave');const fields=Object.fromEntries(M.recordFields(M.finish(s)).map(f=>[f.key,f.value]));assert.equal(fields.review,'Not submitted');assert.doesNotMatch(fields.additional,/review reason/);
});

test('a declaration-only stop has the exact disclosure consequence and no provider evidence',()=>{
 const r=M.scenarioRecord('FC-06'),x=M.experienceSummary(r);
 assert.equal(x.narrative,'COMMONROOM received the character’s date of birth. LENS received no image. The replies stayed closed.');
 assert.equal(x.hasImage,false);assert.equal(x.hasDocument,false);assert.equal(x.hasReview,false);assert.doesNotMatch(x.information,/Sample ID|sample image/i);
});
test('summaries include only actually submitted evidence, and keep Pending distinct from access',()=>{
 for(const [id,face,doc,review]of [['FC-04',true,false,false],['FC-02',true,true,false],['FC-11',true,false,true],['FC-17',false,false,true],['FC-21',true,false,false]]){
  const r=M.scenarioRecord(id),x=M.experienceSummary(r);assert.equal(x.hasImage,face,id);assert.equal(x.hasDocument,doc,id);assert.equal(x.hasReview,review,id);assert.equal(/Sample ID image/.test(x.information),doc,id);
  if(r.outcome==='pending'){assert.match(x.access,/closed.*pending/i);assert.doesNotMatch(x.access,/opened/);}
 }
 assert.equal(M.scenarioRecord('FC-21').outcome,'unconfirmed');assert.doesNotMatch(M.experienceSummary(M.scenarioRecord('FC-21')).access,/withdrew|stopped/i);
});
test('other-character visit preserves discussion and rules, but starts with no old disclosures or records',()=>{
 const s=start();s.draft.post='night';declare(s);face(s);M.transition(s.draft,'document');M.transition(s.draft,'select-document',{sampleId:'DOC-A1'});M.transition(s.draft,'send-document',{confirm:true});const r=M.finish(s),next=M.otherCharacterVisit(r);
 assert.equal(next.draft.post,'night');assert.equal(next.profile,s.profile);assert.equal(next.draft.characterId,'C-02');assert.equal(next.draft.stage,'declaration');assert.deepEqual(next.draft.events,[]);assert.deepEqual(next.records,[]);assert.deepEqual(next.draft.requests,['declaration']);assert.equal(next.draft.outcome,null);assert.equal(next.draft.choices.dateReady,false);assert.equal(next.draft.choices.faceSample,null);assert.equal(next.draft.choices.documentSample,null);assert.equal(next.draft.choices.reviewReason,null);assert.ok(!JSON.stringify(M.pack(next)).includes(r.id));assert.ok(M.restore(M.pack(next)));assert.notEqual(next.id,s.id);
 const pending=M.scenarioRecord('FC-11');pending.post='zine';const reverse=M.otherCharacterVisit(pending);assert.equal(reverse.draft.characterId,'C-01');assert.equal(reverse.draft.post,'zine');assert.deepEqual(reverse.draft.events,[]);assert.deepEqual(reverse.records,[]);assert.equal(reverse.draft.choices.reviewReason,null);
 assert.equal(M.otherCharacterVisit(M.scenarioRecord('FC-00')),null);
});
