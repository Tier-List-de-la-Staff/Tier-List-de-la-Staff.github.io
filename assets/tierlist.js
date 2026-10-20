/* Page « tier list » : glisser-déposer, sauvegarde dans le navigateur, export PNG, envoi du vote.
   Code commun à toutes les tier lists : chaque dossier fournit son config.js. */
(function(){
"use strict";
const C = window.TIERLIST;
const W = C.mots || { un:"un élément", ce:"cet élément", pluriel:"éléments" };
const TIERS = C.tiers.map(t=>({ id:t.id, label:t.nom, court:t.court||t.nom, note:t.note||"", color:t.couleur||"#dddddd", max:t.max||0 }));
const IMGS = C.elements.map(e=>e.image);
const NAMES = C.elements.map(e=>e.nom);
const KEY = C.cleSauvegarde || ("tierlist-"+C.id+"-v1");
const $ = s=>document.querySelector(s);
const esc = s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// ---------- textes de la page
document.title = C.titre;
$("#titre").textContent = C.titre;
$("#consigne").textContent = C.consigne || "";
const limites = TIERS.filter(t=>t.max).map(t=> t.max===1
  ? `Le tier « ${t.court} » n'a qu'une place : y placer ${W.un} renvoie l'ancien dans le bac.`
  : `Le tier « ${t.court} » est limité à ${t.max} places.`);
$("#hint").textContent = limites.concat("Votre classement reste enregistré dans ce navigateur. Quand il est prêt, envoyez-le : il sera compté dans le verdict et ne pourra plus être modifié.").join(" ");

// ---------- état (sauvegardé dans le navigateur)
const nameOf = i => C.afficherNoms ? NAMES[i] : "";
function freshState(){
  return { who:"", cards: IMGS.map((_,i)=>({ id:"p"+i, tier:"pool" })), order: IMGS.map((_,i)=>"p"+i) };
}
let S;
try{ S = JSON.parse(localStorage.getItem(KEY)); }catch(e){ S = null; }
if(!S || !Array.isArray(S.cards) || !Array.isArray(S.order)) S = freshState();
// remet la sauvegarde en cohérence avec config.js (éléments ajoutés ou retirés, tiers modifiés)
const tierIds = new Set(TIERS.map(t=>t.id).concat("pool"));
const seen = new Set();
S.cards = S.cards.filter(c=> c && /^p\d+$/.test(c.id) && +c.id.slice(1) < IMGS.length && !seen.has(c.id) && seen.add(c.id));
IMGS.forEach((_,i)=>{ if(!seen.has("p"+i)) S.cards.push({ id:"p"+i, tier:"pool" }); });
S.cards.forEach(c=>{ const i = +c.id.slice(1); c.src = IMGS[i]; c.name = nameOf(i); if(!tierIds.has(c.tier)) c.tier = "pool"; });
S.order = S.order.filter((id,k,a)=> a.indexOf(id)===k && S.cards.some(c=>c.id===id));
S.cards.forEach(c=>{ if(!S.order.includes(c.id)) S.order.push(c.id); });
TIERS.forEach(t=>{ if(t.max) S.order.map(byId).filter(c=>c && c.tier===t.id).slice(t.max).forEach(c=>{ c.tier = "pool"; }); });

function save(){
  try{ localStorage.setItem(KEY, JSON.stringify({ who:S.who||"", cards:S.cards.map(c=>({ id:c.id, tier:c.tier })), order:S.order })); }catch(e){}
}
function byId(id){ return S.cards.find(c=>c.id===id); }

// ---------- plateau
const board = $("#board"), pool = $("#pool");
let selected = null;
TIERS.forEach(t=>{
  const row = document.createElement("div");
  row.className = "tier";
  row.innerHTML = `<div class="tlabel" style="background:${esc(t.color)}"><b>${esc(t.label)}</b>${t.note?`<small>(${esc(t.note)})</small>`:""}</div><div class="zone" data-tier="${esc(t.id)}" aria-label="${esc(t.label)}"></div>`;
  board.appendChild(row);
});
const zones = ()=>[...document.querySelectorAll(".zone")];

function cardEl(c){
  const el = document.createElement("div");
  const i = +c.id.slice(1);
  el.className = "card"; el.draggable = true; el.dataset.id = c.id; el.tabIndex = 0;
  el.innerHTML = `<div class="ph"><img src="${esc(c.src)}" alt=""></div>${c.name?'<span class="nm"></span>':""}`;
  if(c.name){ el.querySelector(".nm").textContent = c.name; }
  el.setAttribute("aria-label", c.name || ("Photo "+(i+1)));
  el.addEventListener("dragstart",e=>{ e.dataTransfer.setData("text/plain",c.id); e.dataTransfer.effectAllowed="move"; el.classList.add("dragging"); });
  el.addEventListener("dragend",()=>el.classList.remove("dragging"));
  el.addEventListener("click",e=>{ e.stopPropagation(); select(selected===c.id?null:c.id); });
  el.addEventListener("keydown",e=>{
    if(e.target!==el) return;
    if(e.key==="Enter"||e.key===" "){ e.preventDefault(); select(selected===c.id?null:c.id); }
    const n = "123456789".indexOf(e.key); if(n>-1 && TIERS[n]) move(c.id, TIERS[n].id);
    if(e.key==="0"||e.key==="Backspace") move(c.id,"pool");
  });
  return el;
}

function render(){
  zones().forEach(z=>z.innerHTML="");
  S.order.forEach(id=>{
    const c = byId(id); if(!c) return;
    const z = document.querySelector(`.zone[data-tier="${c.tier}"]`) || pool;
    const el = cardEl(c);
    if(selected===id) el.classList.add("sel");
    z.appendChild(el);
  });
  const left = S.cards.filter(c=>c.tier==="pool").length;
  $("#count").textContent = `${left} / ${S.cards.length}`;
  document.body.classList.toggle("picking", !!selected);
}

function move(id, tier, beforeId){
  const c = byId(id); if(!c) return;
  const t = TIERS.find(t=>t.id===tier);
  if(t && t.max){
    const occ = S.order.map(byId).filter(k=>k && k.tier===tier && k.id!==id);
    if(occ.length>=t.max){
      occ.slice(0, occ.length-t.max+1).forEach(k=>{ k.tier="pool"; });
      toast((occ[0].name||"L'ancien")+" retourne dans le bac : "+(t.max===1?"une seule place":t.max+" places maximum")+" en « "+t.court+" ».");
    }
  }
  c.tier = tier;
  S.order = S.order.filter(k=>k!==id);
  const bi = beforeId ? S.order.indexOf(beforeId) : -1;
  if(bi>-1) S.order.splice(bi,0,id); else S.order.push(id);
  selected = null;
  render(); save();
}
function select(id){ selected = id; render(); }

zones().forEach(z=>{
  z.addEventListener("dragover",e=>{ e.preventDefault(); z.classList.add("over"); });
  z.addEventListener("dragleave",e=>{ if(!z.contains(e.relatedTarget)) z.classList.remove("over"); });
  z.addEventListener("drop",e=>{
    e.preventDefault(); z.classList.remove("over");
    const id = e.dataTransfer.getData("text/plain");
    const over = e.target.closest(".card");
    let before = null;
    if(over && over.dataset.id!==id){
      const r = over.getBoundingClientRect();
      before = e.clientX < r.left + r.width/2 ? over.dataset.id : nextId(over);
    }
    move(id, z.dataset.tier, before);
  });
  z.addEventListener("click",e=>{
    if(!selected) return;
    const over = e.target.closest(".card");
    move(selected, z.dataset.tier, over ? over.dataset.id : null);
  });
});
function nextId(el){ const n = el.nextElementSibling; return n && n.classList.contains("card") ? n.dataset.id : null; }
document.addEventListener("click",e=>{ if(selected && !e.target.closest(".zone,.card")) select(null); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape" && selected) select(null); });

// ---------- participant
const who = $("#participant");
who.value = S.who || "";
who.addEventListener("input",()=>{ S.who = who.value; save(); });

// ---------- message temporaire
let toastTimer;
function toast(msg){
  const t = $("#toast"); if(!t) return;
  t.textContent = msg; t.classList.add("on");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove("on"), 3600);
}

// ---------- remise à zéro
$("#reset").addEventListener("click",()=>{
  if(!S.cards.some(c=>c.tier!=="pool")) return;
  if(!confirm("Tout remettre dans le bac à classer ?")) return;
  S.cards.forEach(c=>{ c.tier = "pool"; });
  S.order = IMGS.map((_,i)=>"p"+i); selected = null;
  render(); save();
});

// ---------- export PNG
function loadImg(src){ return new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.onerror=()=>r(null); i.src=src; }); }
function ellipsis(ctx,txt,max){ if(ctx.measureText(txt).width<=max) return txt; while(txt.length>1 && ctx.measureText(txt+"…").width>max) txt=txt.slice(0,-1); return txt+"…"; }
function wrapLines(ctx,txt,max){
  const words = txt.split(" "), out = []; let line = "";
  words.forEach(w=>{ const t = line?line+" "+w:w; if(ctx.measureText(t).width>max && line){ out.push(line); line=w; } else line=t; });
  if(line) out.push(line); return out;
}
async function buildPng(){
  try{ await document.fonts.ready; }catch(e){}
  const W_=1400, PAD=40, LBL=220, CARD=104, GAP=10, ZP=12, SC=2;
  const NAMEH = S.cards.some(c=>c.name && c.tier!=="pool") ? 22 : 0;
  const DISP='"Unbounded","Arial Black",sans-serif', BODY='"Instrument Sans",system-ui,sans-serif';
  const cols = Math.max(1, Math.floor((W_-2*PAD-LBL-2*ZP+GAP)/(CARD+GAP)));
  const rows = TIERS.map(t=>{
    const cards = S.order.map(byId).filter(c=>c && c.tier===t.id);
    const lines = Math.max(1, Math.ceil(cards.length/cols));
    return { t, cards, h: Math.max(118, lines*(CARD+NAMEH+GAP)-GAP+2*ZP) };
  });
  const HEAD=120, FOOT=40;
  const H = HEAD + rows.reduce((a,r)=>a+r.h+3,0) + FOOT;
  const cv = document.createElement("canvas"); cv.width = W_*SC; cv.height = H*SC;
  const ctx = cv.getContext("2d"); ctx.scale(SC,SC);
  ctx.fillStyle="#ffffff"; ctx.fillRect(0,0,W_,H);
  ctx.fillStyle="#1d1a21"; ctx.textBaseline="alphabetic";
  ctx.font=`800 30px ${DISP}`; ctx.fillText(C.titre, PAD, 62);
  ctx.font=`500 17px ${BODY}`; ctx.fillStyle="#6e6873";
  ctx.fillText(S.who ? "Participant : "+S.who : "Participant : non renseigné", PAD, 92);
  let y = HEAD;
  ctx.fillStyle="#1d1a21"; ctx.fillRect(PAD, y-3, W_-2*PAD, 3);
  const imgs = {};
  await Promise.all(S.cards.map(async c=>{ imgs[c.id] = await loadImg(c.src); }));
  rows.forEach(r=>{
    ctx.fillStyle = r.t.color; ctx.fillRect(PAD, y, LBL, r.h);
    ctx.fillStyle="#1d1a21"; ctx.font=`600 18px ${DISP}`; ctx.textAlign="center";
    const lines = wrapLines(ctx, r.t.label, LBL-28);
    const extra = r.t.note ? 1 : 0, lh = 24;
    let ty = y + r.h/2 - ((lines.length+extra)*lh)/2 + 18;
    lines.forEach(l=>{ ctx.fillText(l, PAD+LBL/2, ty); ty+=lh; });
    if(r.t.note){ ctx.font=`500 14px ${BODY}`; ctx.fillText("("+r.t.note+")", PAD+LBL/2, ty-2); }
    ctx.textAlign="left";
    r.cards.forEach((c,i)=>{
      const cx = PAD+LBL+ZP + (i%cols)*(CARD+GAP);
      const cy = y+ZP + Math.floor(i/cols)*(CARD+NAMEH+GAP);
      const im = imgs[c.id];
      ctx.save(); ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(cx,cy,CARD,CARD,6); else ctx.rect(cx,cy,CARD,CARD);
      ctx.clip();
      if(im){ const k=Math.max(CARD/im.width,CARD/im.height), w=im.width*k, h=im.height*k; ctx.drawImage(im, cx+(CARD-w)/2, cy+(CARD-h)/2, w, h); }
      else { ctx.fillStyle="#e6e2de"; ctx.fillRect(cx,cy,CARD,CARD); }
      ctx.restore();
      if(c.name){ ctx.fillStyle="#1d1a21"; ctx.font=`500 13px ${BODY}`; ctx.textAlign="center"; ctx.fillText(ellipsis(ctx,c.name,CARD+GAP-2), cx+CARD/2, cy+CARD+16); ctx.textAlign="left"; }
    });
    y += r.h;
    ctx.fillStyle="#1d1a21"; ctx.fillRect(PAD, y, W_-2*PAD, 3); y+=3;
  });
  return new Promise(res=>cv.toBlob(res,"image/png"));
}
$("#png").addEventListener("click", async ()=>{
  const b = $("#png"); b.disabled = true; const label = b.textContent; b.textContent = "Préparation…";
  try{
    const blob = await buildPng();
    if(!blob) throw new Error("png");
    const slug = (S.who||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_|_$/g,"");
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = `tierlist_${C.id}${slug?"_"+slug:""}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 10000);
    toast("Image téléchargée.");
  }catch(e){ toast("L'image n'a pas pu être générée."); }
  finally{ b.disabled = false; b.textContent = label; }
});

// ---------- envoi du classement (Firebase)
const sendBtn = $("#send");
sendBtn.addEventListener("click", async ()=>{
  const name = (who.value||"").trim().replace(/\s+/g," ");
  if(!name) return toast("Indique ton nom en haut avant d'envoyer.");
  if(name.length>40) return toast("Le nom est trop long (40 caractères maximum).");
  if(name.includes("/")) return toast("Le nom ne peut pas contenir de barre oblique (/).");
  const ranking = {};
  S.cards.forEach(c=>{ if(c.tier!=="pool"){ const n = NAMES[+c.id.slice(1)]; if(n) ranking[n] = c.tier; } });
  const done = Object.keys(ranking).length, left = NAMES.length - done;
  if(!done) return toast("Classe au moins un élément avant d'envoyer.");
  const msg = (left ? left+(left>1?" éléments ne sont pas classés. ":" élément n'est pas classé. ") : "")
    + "Une fois envoyé, ton classement ne pourra plus être modifié.\n\nEnvoyer sous le nom « "+name+" » ?";
  if(!confirm(msg)) return;
  const label = sendBtn.textContent;
  sendBtn.disabled = true; sendBtn.textContent = "Envoi…";
  try{
    const { fs, db } = await window.chargerFirebase();
    await fs.setDoc(fs.doc(db, window.SITE.collection, C.id+"__"+name.toLowerCase()),
      { tierlist:C.id, participant:name, ranking, createdAt:Date.now() });
    sendBtn.textContent = "Envoyé ✓";
    toast("Classement envoyé, merci ! Direction le verdict…");
    setTimeout(()=>{ location.href = "verdict.html"; }, 1400);
  }catch(e){
    sendBtn.disabled = false; sendBtn.textContent = label;
    const code = e && e.code;
    if(code==="permission-denied") toast("Ce nom a déjà envoyé un classement. Utilise un autre nom.");
    else if(!code || code==="unavailable" || code==="deadline-exceeded") toast("Impossible de joindre la base de données. Réessaie dans un instant.");
    else toast("L'envoi a échoué ("+code+").");
  }
});

render();
})();
