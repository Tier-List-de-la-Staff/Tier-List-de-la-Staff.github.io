/* Moteur de statistiques du verdict.
   Fonction pure : elle ne touche pas à la page, elle calcule à partir des votes bruts.
   subs  : [{ n: "Hugo", r: { "Dalida": 5, ... } }]   (score de 1 = dernier tier à T = premier tier)
   names : les éléments, dans l'ordre de config.js
   tiers : les identifiants des tiers, du meilleur au moins bon */
(function(root){
  "use strict";
  const r2 = x => Math.round(x*100)/100;

  // rangs moyens (les ex aequo partagent la moyenne de leurs rangs)
  function rankAvg(vals){
    const idx = vals.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]), out = new Array(vals.length);
    let i = 0;
    while(i<idx.length){
      let j = i; while(j+1<idx.length && idx[j+1][0]===idx[i][0]) j++;
      const rk = (i+j)/2+1; for(let k=i;k<=j;k++) out[idx[k][1]] = rk;
      i = j+1;
    }
    return out;
  }
  function pearson(a,b){
    const n=a.length, ma=a.reduce((s,x)=>s+x,0)/n, mb=b.reduce((s,x)=>s+x,0)/n;
    let sab=0, saa=0, sbb=0;
    for(let i=0;i<n;i++){ sab+=(a[i]-ma)*(b[i]-mb); saa+=(a[i]-ma)**2; sbb+=(b[i]-mb)**2; }
    return saa&&sbb ? sab/Math.sqrt(saa*sbb) : 0;
  }

  function derive(names, subs, tiers){
    const T = tiers.length, S2K = {};
    tiers.forEach((id,i)=>{ S2K[T-i] = id; });
    const empty = () => Object.fromEntries(tiers.map(id=>[id,0]));
    const emptyL = () => Object.fromEntries(tiers.map(id=>[id,[]]));
    const sum = {}, cnt = {};
    names.forEach(a=>{ sum[a]=0; cnt[a]=0; subs.forEach(s=>{ if(s.r[a]){ sum[a]+=s.r[a]; cnt[a]++; } }); });

    // éléments : moyenne, répartition par tier, rang (ex aequo si même moyenne arrondie)
    const A = names.map(a=>{
      const vals = subs.filter(s=>s.r[a]).map(s=>s.r[a]), n = vals.length;
      const m = n ? sum[a]/n : 0;
      const sd = n ? Math.sqrt(vals.reduce((t,x)=>t+(x-m)**2,0)/n) : 0;
      const c = empty(), by = emptyL();
      subs.forEach(s=>{ if(s.r[a]){ c[S2K[s.r[a]]]++; by[S2K[s.r[a]]].push(s.n); } });
      return { n:a, m:r2(m), raw:m, sd, cnt:n, c, by, un:subs.filter(s=>!s.r[a]).map(s=>s.n) };
    }).sort((x,y)=>y.m-x.m || y.raw-x.raw || (x.n<y.n?-1:x.n>y.n?1:0));
    A.forEach((a,i)=>{ a.rk = (i>0 && A[i-1].m===a.m) ? A[i-1].rk : i+1; });
    A.forEach(a=>{ a.tie = A.filter(b=>b.m===a.m).length>1; });
    const rankOf = Object.fromEntries(A.map((a,i)=>[a.n,i]));

    // votants : écart à la moyenne des AUTRES, biais, corrélation de rang
    const V = subs.map(s=>{
      const arts = names.filter(a=>s.r[a]), devs=[], mine=[], others=[];
      arts.forEach(a=>{
        const oc = cnt[a]-1; if(oc<=0) return;
        const g = (sum[a]-s.r[a])/oc;
        devs.push({a, v:s.r[a], g:r2(g), d:r2(s.r[a]-g), raw:s.r[a]-g}); mine.push(s.r[a]); others.push(g);
      });
      const n = devs.length;
      const mae = n ? devs.reduce((t,x)=>t+Math.abs(x.raw),0)/n : 0;
      const bias = n ? devs.reduce((t,x)=>t+x.raw,0)/n : 0;
      const rho = n>2 ? pearson(rankAvg(mine),rankAvg(others)) : 0;
      const avg = arts.length ? arts.reduce((t,a)=>t+s.r[a],0)/arts.length : 0;
      devs.sort((x,y)=>Math.abs(y.d)-Math.abs(x.d) || rankOf[x.a]-rankOf[y.a]);
      devs.forEach(x=>{ delete x.raw; });
      return { n:s.n, mae:r2(mae), bias:r2(bias), rho:r2(rho), dis:r2(1-rho), avg:r2(avg),
               cnt:arts.length, goat:arts.find(a=>s.r[a]===T)||null, devs };
    });

    const scores = {};
    subs.forEach(s=>names.forEach(a=>{ if(s.r[a]) scores[s.n+"|"+a] = s.r[a]; }));
    return { voters:V, artists:A, scores };
  }

  root.TierStats = { derive };
  if(typeof module!=="undefined" && module.exports) module.exports = { derive };
})(typeof window!=="undefined" ? window : globalThis);
