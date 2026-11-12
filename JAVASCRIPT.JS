const G=[
{id:1,t:'Void Runners',g:'Shooter',p:39.99,o:59.99,r:4.8,pl:['PC','PS5','Xbox'],a:'#1b1464',b:'#7B4DFF',d:'Fast squad-based shooter set on drifting space stations. Hack doors, flank enemies and outplay rival crews.'},
{id:2,t:'Crimson Vale',g:'RPG',p:49.99,o:69.99,r:4.9,pl:['PC','PS5'],a:'#5b0f2c',b:'#FF3D7F',d:'A dark fantasy open world with deep choices, huge bosses and a story that reacts to every decision you make.'},
{id:3,t:'Neon Drift',g:'Racing',p:29.99,o:44.99,r:4.6,pl:['PC','Xbox','Switch'],a:'#06406b',b:'#5CF2FF',d:'Arcade street racing through rainy neon cities. Tune your car, master drifts and climb the global ranks.'},
{id:4,t:'Titan Frontier',g:'Strategy',p:34.99,o:49.99,r:4.7,pl:['PC'],a:'#2d3a0f',b:'#B6E35A',d:'Build a colony, command giant war machines and survive on a hostile planet in this deep real-time strategy game.'},
{id:5,t:'Shadow Protocol',g:'Action',p:44.99,o:59.99,r:4.7,pl:['PC','PS5','Xbox'],a:'#12121f',b:'#8A8AFF',d:'Stealth action thriller. Slip past guards, use gadgets and take down a global conspiracy from the shadows.'},
{id:6,t:'Skyforge Online',g:'RPG',p:0,o:0,r:4.4,pl:['PC','PS5'],a:'#6b3a06',b:'#FFC857',d:'Free-to-play fantasy MMO with sky islands, dragon mounts and huge co-op raids with friends.'},
{id:7,t:'Pixel Kingdom',g:'Strategy',p:14.99,o:24.99,r:4.5,pl:['PC','Switch'],a:'#0f4a3a',b:'#3CE6A5',d:'A cozy retro strategy game. Grow your kingdom, train heroes and defend your castle one pixel at a time.'},
{id:8,t:'Dead Signal',g:'Shooter',p:24.99,o:39.99,r:4.5,pl:['PC','PS5','Xbox'],a:'#3b0a0a',b:'#FF5A4D',d:'Survival horror shooter. Scavenge supplies, follow a mysterious radio signal and survive the night.'},
{id:9,t:'Apex Circuit',g:'Racing',p:54.99,o:69.99,r:4.8,pl:['PC','PS5','Xbox'],a:'#4a1b00',b:'#FF8A3D',d:'Premium motorsport simulation with real physics, 60 tracks and a full career mode.'},
{id:10,t:'Mythborne',g:'Action',p:42.99,o:59.99,r:4.9,pl:['PC','PS5'],a:'#1d1747',b:'#B38CFF',d:'Cinematic god-slaying action. Fight legendary creatures with fast combat and stunning visuals.'},
{id:11,t:'Last Orbit',g:'Action',p:19.99,o:29.99,r:4.6,pl:['PC','Switch','Xbox'],a:'#0a2342',b:'#4DA3FF',d:'A short, emotional sci-fi adventure about the last engineer on a dying space station.'},
{id:12,t:'Gridlock FC',g:'Sports',p:49.99,o:69.99,r:4.3,pl:['PC','PS5','Xbox','Switch'],a:'#0b4d1c',b:'#5CE67A',d:'Next-gen football with fluid gameplay, online leagues and ultimate team building.'}
];
const $=s=>document.querySelector(s);
let cat='All',cart={},wish=new Set(),qs='',sort='pop';
try{cart=JSON.parse(localStorage.getItem('voltra')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('voltra',JSON.stringify(cart))}catch(e){}};
const money=n=>n===0?'Free':'$'+n.toFixed(2);
const cover=(x,txt)=>`style="background:linear-gradient(150deg,${x.a},${x.b})" data-l="${x.t[0]}"`;

// chips
const cats=['All',...new Set(G.map(x=>x.g))];
$('#chips').innerHTML=cats.map(c=>`<button class="chip${c==='All'?' on':''}" data-c="${c}">${c}</button>`).join('')+
 `<select id="so" aria-label="Sort"><option value="pop">Top rated</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select>`;
$('#chips').addEventListener('click',e=>{const c=e.target.dataset.c;if(!c)return;cat=c;document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.c===c));draw()});
$('#so').onchange=e=>{sort=e.target.value;draw()};
$('#q').oninput=e=>{qs=e.target.value.toLowerCase();draw()};

// grid
function draw(){
  let l=G.filter(x=>(cat==='All'||x.g===cat)&&x.t.toLowerCase().includes(qs));
  l.sort((a,b)=>sort==='lo'?a.p-b.p:sort==='hi'?b.p-a.p:b.r-a.r);
  $('#res').textContent=l.length+' games';
  $('#grid').innerHTML=l.length?l.map(x=>{
    const off=x.o?Math.round((1-x.p/x.o)*100):0;
    return `<article class="card"><div class="cv" ${cover(x)} role="button" tabindex="0" data-open="${x.id}">
      ${off?`<span class="off">-${off}%</span>`:''}<button class="heart${wish.has(x.id)?' on':''}" data-w="${x.id}" aria-label="Wishlist">${wish.has(x.id)?'♥':'♡'}</button><span>${x.t}</span></div>
      <div class="info"><div class="meta"><span>${x.g}</span><span class="stars">★ ${x.r}</span></div>
      <div class="plat">${x.pl.map(p=>`<em>${p}</em>`).join('')}</div>
      <div class="buy"><div class="price"><b>${money(x.p)}</b>${x.o?`<s>${money(x.o)}</s>`:''}</div><button class="add" data-a="${x.id}">Add</button></div></div></article>`}).join(''):
    '<div class="none">No games found. Try a different search.</div>';
}
$('#grid').addEventListener('click',e=>{
  const a=e.target.closest('[data-a]'),w=e.target.closest('[data-w]'),o=e.target.closest('[data-open]');
  if(a)add(+a.dataset.a);else if(w){const i=+w.dataset.w;wish.has(i)?wish.delete(i):wish.add(i);draw();toast(wish.has(i)?'Added to wishlist':'Removed from wishlist')}else if(o)openM(+o.dataset.open);
});
$('#grid').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.open)openM(+e.target.dataset.open)});

// featured
const F=G[0];
$('#feat').innerHTML=`<div class="cv" ${cover(F)}><span class="off" style="position:absolute">-33%</span><span>${F.t}</span></div>
<div class="in"><div><h3>${F.t}</h3><small style="color:var(--mute)">${F.g} · ★ ${F.r}</small></div><button class="btn p" id="fa" style="padding:10px 20px">${money(F.p)}</button></div>`;
$('#fa').onclick=()=>add(F.id);

// cart
function add(id){cart[id]=(cart[id]||0)+1;save();upd();toast(G.find(x=>x.id===id).t+' added to cart')}
function upd(){
  const ids=Object.keys(cart);let tot=0,n=0;
  $('#ci').innerHTML=ids.length?ids.map(i=>{const x=G.find(g=>g.id==i),q=cart[i];tot+=x.p*q;n+=q;
    return `<div class="it"><div class="th" style="background:linear-gradient(150deg,${x.a},${x.b})"></div><div class="t"><b>${x.t}</b><small>${money(x.p)}</small>
    <div class="qty"><button data-m="${i}" aria-label="Less">−</button><span>${q}</span><button data-p="${i}" aria-label="More">+</button></div></div><button class="rm" data-r="${i}" aria-label="Remove">✕</button></div>`}).join(''):
    '<p class="empty">Your cart is empty.<br>Find your next game in the store.</p>';
  $('#tt').textContent='$'+tot.toFixed(2);$('#cnt').textContent=n;
}
$('#ci').addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.p)cart[t.dataset.p]++;
  if(t.dataset.m&&--cart[t.dataset.m]<1)delete cart[t.dataset.m];
  if(t.dataset.r)delete cart[t.dataset.r];
  save();upd();
});
const panel=on=>{$('#cart').classList.toggle('on',on);$('#ov').classList.toggle('on',on)};
$('#cartBtn').onclick=()=>panel(true);$('#cx').onclick=()=>panel(false);
$('#ov').onclick=()=>{panel(false);closeM()};
$('#co').onclick=()=>{
  if(!Object.keys(cart).length)return toast('Your cart is empty');
  cart={};save();upd();panel(false);toast('Order placed! Your keys are on the way.');
};

// modal
function openM(id){
  const x=G.find(g=>g.id===id);
  $('#mb').innerHTML=`<button class="x" id="mx" aria-label="Close">✕</button><div class="cv" ${cover(x)}><span>${x.t}</span></div>
  <div class="bd"><div class="meta"><span>${x.g}</span><span class="stars">★ ${x.r}</span></div><h2>${x.t}</h2><p>${x.d}</p>
  <div class="plat">${x.pl.map(p=>`<em>${p}</em>`).join('')}</div>
  <div class="buy"><div class="price"><b>${money(x.p)}</b>${x.o?`<s>${money(x.o)}</s>`:''}</div><button class="btn p" id="ma">Add to cart</button></div></div>`;
  $('#modal').classList.add('on');$('#ov').classList.add('on');
  $('#mx').onclick=closeM;$('#ma').onclick=()=>{add(id);closeM()};
}
function closeM(){$('#modal').classList.remove('on');if(!$('#cart').classList.contains('on'))$('#ov').classList.remove('on')}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeM();panel(false)}});

// toast, newsletter
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}
$('#nf').onsubmit=e=>{e.preventDefault();e.target.reset();toast('Subscribed! Watch your inbox.')};

// countdown (always 3 days from first visit this session)
const end=Date.now()+3*864e5-1e3*60*17;
(function tick(){
  let s=Math.max(0,Math.floor((end-Date.now())/1e3));
  const p=(i,v)=>$(i).textContent=String(v).padStart(2,'0');
  p('#d',Math.floor(s/86400));p('#h',Math.floor(s%86400/3600));p('#m',Math.floor(s%3600/60));p('#s',s%60);
  setTimeout(tick,1000);
})();

// hero canvas: floating network
(function(){
  const c=$('#fx'),x=c.getContext('2d');let W,H,P=[],mx=-999,my=-999;
  const rs=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;P=Array.from({length:Math.min(90,W/14|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5}))};
  rs();addEventListener('resize',rs);
  c.parentElement.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  (function f(){
    x.clearRect(0,0,W,H);
    P.forEach((a,i)=>{
      if(!still){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1}
      x.fillStyle='#5CF2FF';x.globalAlpha=.7;x.beginPath();x.arc(a.x,a.y,1.8,0,7);x.fill();
      for(let j=i+1;j<P.length;j++){const b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<120){x.globalAlpha=(1-d/120)*.35;x.strokeStyle='#7B4DFF';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
      const m=Math.hypot(a.x-mx,a.y-my);
      if(m<170){x.globalAlpha=(1-m/170)*.8;x.strokeStyle='#FF3D7F';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke()}
    });
    requestAnimationFrame(f);
  })();
})();

draw();upd();
