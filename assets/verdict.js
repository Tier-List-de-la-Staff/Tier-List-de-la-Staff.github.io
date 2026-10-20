/* Page « verdict » : statistiques en direct.
   Votes = votes d'origine (votes-origine.js, facultatif) + classements envoyés dans Firebase.
   Code commun à toutes les tier lists : chaque dossier fournit son config.js. */
(function(){
"use strict";
const C = window.TIERLIST;
const ORIGINE = Array.isArray(window.VOTES_ORIGINE) ? window.VOTES_ORIGINE : [];
const W = C.mots || { un:"un élément", ce:"cet élément", pluriel:"éléments" };
const T = C.tiers.length;
const KEYS = C.tiers.map(t=>t.id);
const TK = Object.fromEntries(C.tiers.map(t=>[t.id, t.court||t.nom]));
const COL = Object.fromEntries(C.tiers.map(t=>[t.id, t.couleur||"#dddddd"]));
const SCORE = Object.fromEntries(C.tiers.map((t,i)=>[t.id, T-i]));
const S2K = Object.fromEntries(C.tiers.map((t,i)=>[T-i, t.id]));
const NAMES = C.elements.map(e=>e.nom);
const IMG = Object.fromEntries(C.elements.map(e=>[e.nom, e.image]));

const byId = id=>document.getElementById(id);
const cap = s=>s.charAt(0).toUpperCase()+s.slice(1);
const fr = (x,d=2)=>x.toFixed(d).replace(".",",");
const sg = x=>(x>0?"+":x<0?"−":"")+fr(Math.abs(x));
const pl = (n,w)=>n+" "+w+(n>1?"s":"");
const tierOf = m=>S2K[Math.min(T, Math.max(1, Math.floor(m+0.5)))];
const esc = s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const chip = k=>`<span class="chip" style="background:${esc(COL[k])}">${esc(TK[k])}</span>`;

// ---------- données
// Tout ce qui vient d'internet est vérifié : nom valable, éléments et tiers connus.
function toSub(nom, classement){
  const n = typeof nom==="string" ? nom.trim().replace(/\s+/g," ") : "";
  if(!n || n.length>40 || !classement || typeof classement!=="object") return null;
  const r = {};
  Object.keys(classement).forEach(a=>{ const s = SCORE[classement[a]]; if(s && IMG[a]!==undefined) r[a] = s; });
  return Object.keys(r).length ? { n, r } : null;
}
const BASE_SUBS = [];
ORIGINE.forEach(v=>{ const s = toSub(v && v.nom, v && v.classement); if(s && !BASE_SUBS.some(b=>b.n.toLowerCase()===s.n.toLowerCase())) BASE_SUBS.push(s); });

function validSubmissions(rows){
  const taken = new Set(BASE_SUBS.map(s=>s.n.toLowerCase())), out = [];
  rows.slice().sort((a,b)=>(+(a&&a.createdAt)||0)-(+(b&&b.createdAt)||0)).forEach(x=>{
    if(!x || x.tierlist!==C.id) return;
    const s = toSub(x.participant, x.ranking);
    if(!s || taken.has(s.n.toLowerCase())) return;   // un votant d'origine ne peut pas être remplacé
    taken.add(s.n.toLowerCase()); out.push(s);
  });
  return out;
}

let D = null, LIVE = 0, ETAT = "chargement", metric = "mae", selected = null;
function build(extra){
  D = window.TierStats.derive(NAMES, BASE_SUBS.concat(extra), KEYS);
  D.artists.forEach(a=>{ a.img = IMG[a.n]; a.h = headline(a, D.artists.length); });
  LIVE = extra.length;
  if(!D.voters.some(v=>v.n===selected)) selected = D.voters.length ? sorted()[0].n : null;
}

// phrase d'accroche de chaque élément, construite à partir des chiffres
function headline(a, N){
  const c = a.c, n = a.n, top = KEYS[0], sec = KEYS[1], bot = KEYS[T-1];
  if(!a.cnt) return n+" n'a encore aucun vote.";
  if(a.rk===1) return a.tie ? n+" est en tête ex aequo, avec une moyenne de "+fr(a.m)+"."
    : c[top]>0 ? n+" prend la tête avec "+pl(c[top],"vote")+" « "+TK[top]+" »"+(sec&&c[sec]?" et "+pl(c[sec],"vote")+" « "+TK[sec]+" »":"")+"."
    : n+" prend la tête avec une moyenne de "+fr(a.m)+".";
  if(a.rk===N && !a.tie) return c[bot]>0 ? n+" ferme la marche avec "+pl(c[bot],"vote")+" « "+TK[bot]+" »." : n+" ferme la marche avec une moyenne de "+fr(a.m)+".";
  if(T>=4){
    const pos = c[KEYS[0]]+c[KEYS[1]], neg = c[KEYS[T-2]]+c[KEYS[T-1]];
    if(a.sd>=1.2 && pos>0 && neg>0) return n+" divise : "+pl(pos,"vote")+" « "+TK[KEYS[0]]+" » ou « "+TK[KEYS[1]]+" » contre "+pl(neg,"vote")+" « "+TK[KEYS[T-2]]+" » ou « "+TK[KEYS[T-1]]+" ».";
  }
  let k = KEYS[0]; KEYS.forEach(x=>{ if(c[x]>c[k]) k = x; });
  if(a.sd<=0.7 && c[k]*2>=a.cnt && a.cnt>1) return n+" fait consensus : "+c[k]+" votes sur "+a.cnt+" en « "+TK[k]+" ».";
  return n+" : "+pl(c[k],"vote")+" « "+TK[k]+" » sur "+a.cnt+".";
}

// ---------- graphique des écarts
const METRICS = {
  mae:{ min:.4, max:1.6, step:.25,
        desc:n=>`Écart moyen, en points sur l'échelle de 1 à ${T}, entre la note du votant et la moyenne des ${n-1} autres. Plus il est faible, plus le votant suit le groupe.`,
        avgLabel:v=>`Moyenne du panel : ${fr(v)} point` },
  dis:{ min:0, max:1.2, step:.25,
        desc:()=>`Désaccord de classement : on ignore la sévérité et on compare seulement l'ordre des ${W.pluriel}. 0 signifie un ordre identique à celui du groupe, 1 un ordre sans aucun lien.`,
        avgLabel:v=>`Moyenne du panel : ${fr(v)}` }
};
// l'axe s'élargit si des votants sortent de la plage habituelle
function axisFor(key){
  const B = METRICS[key], vals = D.voters.map(v=>v[key]);
  const lo = Math.min(B.min, Math.floor((Math.min(...vals)-.05)*10)/10);
  const hi = Math.max(B.max, Math.ceil((Math.max(...vals)+.05)*10)/10);
  const ticks = [];
  for(let t=Math.ceil(lo/B.step-1e-9)*B.step; t<=hi+1e-9; t+=B.step){ if(t>lo+1e-9 && t<hi-1e-9) ticks.push(+t.toFixed(2)); }
  return { key, min:lo, max:hi, ticks, desc:B.desc(D.voters.length), avgLabel:B.avgLabel };
}
function sorted(){ return [...D.voters].sort((a,b)=>a[metric]-b[metric] || a.n.localeCompare(b.n)); }
const pos = (v,M)=>((v-M.min)/(M.max-M.min)*100);

function renderChart(){
  const M = axisFor(metric), list = sorted();
  const avg = list.reduce((s,v)=>s+v[metric],0)/list.length;
  byId("metric-desc").textContent = M.desc;
  byId("avg-label").textContent = M.avgLabel(avg);
  const guides = M.ticks.map(t=>`<i class="g" style="left:${pos(t,M)}%"></i>`).join("")+`<i class="avg" style="left:${pos(avg,M)}%"></i>`;
  const host = byId("vrows");
  const existing = new Map([...host.children].map(el=>[el.dataset.n,el]));
  existing.forEach((el,n)=>{ if(!list.some(x=>x.n===n)) el.remove(); });
  list.forEach((v,i)=>{
    let el = existing.get(v.n);
    if(!el){
      el = document.createElement("button");
      el.type = "button"; el.className = "vrow cols"; el.dataset.n = v.n;
      el.innerHTML = `<span class="vr"></span><span class="vn">${esc(v.n)}</span><span class="vt"></span><span class="vv"></span>`;
      el.addEventListener("click",()=>select(v.n));
    }
    const dotColor = i===0?"var(--main)":i===list.length-1?"var(--orig)":"var(--ink)";
    const vt = el.querySelector(".vt");
    const old = vt.querySelector(".dot");
    vt.innerHTML = guides+`<i class="ln"></i>`;
    const dot = old || document.createElement("i");
    dot.className = "dot"; dot.style.background = dotColor;
    vt.appendChild(dot);
    requestAnimationFrame(()=>{ dot.style.left = pos(v[metric],M)+"%"; });
    if(!old) dot.style.left = pos(v[metric],M)+"%";
    el.querySelector(".vr").textContent = i+1;
    el.querySelector(".vv").textContent = fr(v[metric]);
    el.setAttribute("aria-label",`${v.n}, rang ${i+1}, ${fr(v[metric])}`);
    el.setAttribute("aria-pressed", v.n===selected?"true":"false");
    host.appendChild(el);
  });
  byId("ticks").innerHTML = M.ticks.map(t=>`<span style="left:${pos(t,M)}%">${fr(t)}</span>`).join("");
  byId("m-mae").setAttribute("aria-pressed", metric==="mae");
  byId("m-dis").setAttribute("aria-pressed", metric==="dis");
}

function renderProfile(){
  const list = sorted(); if(!list.length) return;
  let i = list.findIndex(v=>v.n===selected); if(i<0){ selected = list[0].n; i = 0; }
  const v = list[i], N = list.length;
  const rankTxt = i===0?`1er sur ${N} · le plus mainstream`:i===N-1?`${N}e sur ${N} · le plus original`:`${i+1}e sur ${N}`;
  const gen = v.bias>0.15?"Note plus haut que le groupe":v.bias<-0.15?"Note plus bas que le groupe":"Note comme le groupe";
  const top = v.devs.slice(0,4).map(d=>`<li><span class="an">${esc(d.a)}</span><span class="dv ${d.d>0?"up":"down"}">${sg(d.d)}</span>
      <span class="ds">${chip(S2K[d.v])} contre ${fr(d.g)} pour les autres</span></li>`).join("");
  byId("profile").innerHTML = `
    <div style="display:flex;flex-direction:column;gap:4px">
      <p class="eyebrow">Profil du votant</p>
      <h3>${esc(v.n)}</h3>
      <p class="tag">${rankTxt}</p>
    </div>
    <dl class="kv">
      <dt>Écart moyen</dt><dd>${fr(v.mae)}</dd>
      <dt>Désaccord de classement</dt><dd>${fr(v.dis)}</dd>
      <dt>Note moyenne donnée</dt><dd>${fr(v.avg)} / ${T}</dd>
      <dd class="wide">${gen} (${sg(v.bias)} point en moyenne)</dd>
      <dt>Son « ${esc(TK[KEYS[0]])} »</dt><dd>${esc(v.goat||"Aucun")}</dd>
      <dt>${esc(cap(W.pluriel))} classés</dt><dd>${v.cnt}</dd>
    </dl>
    <div style="display:flex;flex-direction:column;gap:10px">
      <p class="eyebrow">Ses plus gros écarts</p>
      <ul class="devs">${top || "<li>Pas encore assez de votes en commun.</li>"}</ul>
    </div>`;
}
function select(n){
  selected = n;
  document.querySelectorAll(".vrow").forEach(el=>el.setAttribute("aria-pressed", el.dataset.n===n?"true":"false"));
  renderProfile();
}

// ---------- classement des éléments
function renderArtists(){
  const OPEN = new Set([...document.querySelectorAll("details.art[open]")].map(d=>d.dataset.n));
  byId("legend").innerHTML = KEYS.map(chip).join("");
  byId("arts").innerHTML = D.artists.map(a=>{
    const segs = KEYS.filter(k=>a.c[k]>0).map(k=>`<i style="flex:${a.c[k]};background:${esc(COL[k])}" title="${esc(TK[k])} : ${a.c[k]}">${a.c[k]}</i>`).join("");
    const who = KEYS.map(k=>`<span class="tn" style="background:${esc(COL[k])}">${esc(TK[k])}</span><span class="ps">${a.by[k].length?a.by[k].map(p=>`<span>${esc(p)}</span>`).join(""):"<em>Aucun vote</em>"}</span>`).join("");
    const note = a.un.length && a.cnt ? `<p class="nt">${a.un.map(esc).join(", ")} ${a.un.length>1?"n'ont":"n'a"} pas classé ${esc(W.ce)} : moyenne calculée sur ${pl(a.cnt,"vote")}.</p>` : "";
    return `<details class="art" data-n="${esc(a.n)}"${OPEN.has(a.n)?" open":""}><summary>
        <span class="ark">${a.rk}${a.tie?"<small>ex aequo</small>":""}</span>
        <img class="aph" src="${esc(a.img)}" alt="">
        <span class="anm"><b>${esc(a.n)}</b><span>${a.cnt?chip(tierOf(a.m)):""}</span></span>
        <span class="bar" aria-label="Répartition des ${a.cnt} votes">${segs}</span>
        <span class="amv">${a.cnt?fr(a.m):"–"}</span>
      </summary>
      <div class="adet"><p class="hl">${esc(a.h)}</p><div class="who">${who}</div>${note}</div>
    </details>`;
  }).join("");
}

// ---------- grille complète
function renderGrid(){
  const vs = [...D.voters].sort((a,b)=>a.mae-b.mae).map(v=>v.n);
  const head = `<thead><tr><th class="first"></th>${vs.map(n=>`<th scope="col"><span>${esc(n)}</span></th>`).join("")}<th scope="col"><span>Moyenne</span></th></tr></thead>`;
  const body = D.artists.map(a=>`<tr><th scope="row">${a.rk}. ${esc(a.n)}</th>${vs.map(n=>{
      const s = D.scores[n+"|"+a.n];
      return s?`<td class="c" style="background:${esc(COL[S2K[s]])}" title="${esc(n)} : ${esc(TK[S2K[s]])}">${s}</td>`:`<td class="c na" title="${esc(n)} : non classé">·</td>`;
    }).join("")}<td class="mean">${a.cnt?fr(a.m):"–"}</td></tr>`).join("");
  byId("vg").innerHTML = head+"<tbody>"+body+"</tbody>";
}

// ---------- textes et état vide
function joinFr(list){ return list.length<2 ? list.join("") : list.slice(0,-1).join(", ")+" et "+list[list.length-1]; }
function updateTexts(){
  const N = D.voters.length, A = D.artists.length;
  document.title = "Verdict · "+C.titre;
  byId("eyebrow").textContent = `${C.titre} · ${pl(N,"votant")} · ${A} ${W.pluriel}`;
  byId("lead").textContent = `${N} votant${N>1?"s ont":" a"} rangé ${A} ${W.pluriel} en ${T} tiers, de « ${TK[KEYS[0]]} » à « ${TK[KEYS[T-1]]} ». On commence par mesurer l'écart de chacun à la moyenne des autres. Le classement des ${W.pluriel} vient ensuite.`;
  byId("toc-art").textContent = "Les "+W.pluriel;
  byId("h-artistes").textContent = `Le classement des ${A} ${W.pluriel}`;
  byId("art-desc").textContent = `Note moyenne sur ${T}, avec la répartition des votes par tier. Ouvrez ${W.un} pour voir qui l'a classé où.`;
  byId("grille-desc").textContent = `Chaque case est un vote, de ${T} (${TK[KEYS[0]]}) à 1 (${TK[KEYS[T-1]]}). Les ${W.pluriel} sont rangés du 1er au ${A}e, les votants du plus mainstream au plus original.`;
  byId("meth-bareme").textContent = `${joinFr(KEYS.map((k,i)=>`« ${TK[k]} » vaut ${T-i}`))}. Ce barème suppose que les tiers sont également espacés, ce qui reste une convention.`;
  byId("meth-mae").textContent = `Pour chaque ${W.un.replace(/^(un|une|l'|le|la)\s*/i,"")}, on compare la note du votant à la moyenne des ${Math.max(N-1,0)} autres votants, sans lui. L'écart moyen est la moyenne de ces écarts en valeur absolue.`;
  const part = D.voters.filter(v=>v.cnt<A);
  const cas = !N ? "" : !part.length ? `Tous les votants ont classé tous les ${W.pluriel}.`
    : part.length<=3 ? part.map(v=>`${v.n} n'a classé que ${v.cnt} ${W.pluriel}`).join(" ; ")+" : les moyennes concernées reposent sur moins de votes."
    : `${part.length} votants n'ont pas classé tous les ${W.pluriel} : les moyennes concernées reposent sur moins de votes.`;
  byId("meth-cas").textContent = (cas?cas+" ":"")+`Deux ${W.pluriel} dont la moyenne arrondie est identique sont classés ex aequo.`;
  byId("foot").textContent = `${C.titre} · résultats au ${new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})} · ${pl(N,"votant")}`;
}
function renderAll(){
  const N = D.voters.length;
  updateTexts();
  const show = { ecarts:N>=2, artistes:N>=1, grille:N>=1, methode:N>=1 };
  Object.keys(show).forEach(id=>{ byId(id).hidden = !show[id]; const l = document.querySelector(`.toc a[href="#${id}"]`); if(l) l.hidden = !show[id]; });
  const em = byId("empty");
  em.hidden = N>=2;
  if(N<2){
    em.innerHTML = N===0
      ? (ETAT==="chargement" ? "<p>Chargement des votes…</p>"
        : ETAT==="erreur" ? "<p>Les votes n'ont pas pu être chargés. Réessaie dans un moment.</p>"
        : `<p>Personne n'a encore voté pour cette tier list.</p><a href="./">Faire ma tier list, et être le premier →</a>`)
      : `<p>Un seul classement pour l'instant : la comparaison entre votants apparaîtra dès le deuxième.</p><a href="./">Faire ma tier list →</a>`;
  }
  if(N>=2){ renderChart(); renderProfile(); }
  if(N>=1){ renderArtists(); renderGrid(); }
}
function setStatus(msg, err){ const s = byId("status"); s.textContent = msg; s.classList.toggle("err", !!err); }

byId("m-mae").addEventListener("click",()=>{ metric="mae"; renderChart(); renderProfile(); });
byId("m-dis").addEventListener("click",()=>{ metric="dis"; renderChart(); renderProfile(); });

// ---------- lancement : affichage immédiat des votes d'origine, puis ajout des votes en ligne
async function fetchLive(){
  const { fs, db } = await window.chargerFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, window.SITE.collection), fs.where("tierlist","==",C.id)));
  return snap.docs.map(d=>d.data());
}
build([]);
renderAll();
setStatus("Chargement des classements envoyés depuis le site…");
const O = BASE_SUBS.length;
Promise.race([fetchLive(), new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),12000))])
  .then(rows=>{
    ETAT = "ok"; build(validSubmissions(rows)); renderAll();
    const envoyes = `${LIVE} classement${LIVE>1?"s":""} envoyé${LIVE>1?"s":""} depuis le site`;
    setStatus(O
      ? (LIVE ? `${envoyes} ${LIVE>1?"s'ajoutent":"s'ajoute"} aux ${O} votes d'origine.` : `Aucun classement envoyé depuis le site pour l'instant : les résultats reposent sur les ${O} votes d'origine.`)
      : (LIVE ? cap(envoyes)+"." : "Aucun classement envoyé pour l'instant."));
  })
  .catch(()=>{
    ETAT = "erreur"; renderAll();
    setStatus(O ? `Les classements envoyés depuis le site n'ont pas pu être chargés : affichage des ${O} votes d'origine.`
                : "Les classements n'ont pas pu être chargés. Réessaie dans un moment.", true);
  });
})();
