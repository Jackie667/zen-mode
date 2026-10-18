(function(){
  // tabs
  var tabs=document.querySelectorAll('[role="tab"]');
  tabs.forEach(function(t){ t.addEventListener('click', function(){
    tabs.forEach(function(o){ o.setAttribute('aria-selected', o===t?'true':'false'); document.getElementById(o.getAttribute('aria-controls')).hidden = (o!==t); });
  });});

  // ---------- slide navigation ----------
  var secs=[].slice.call(document.querySelectorAll('section'));
  var links=[].slice.call(document.querySelectorAll('#chapters a'));
  var counter=document.getElementById('counter'), prog=document.getElementById('progress');
  var total=secs.length, cur=0;
  function pad(n){return (n<10?'0':'')+n;}
  secs.forEach(function(sec,i){ var n=document.createElement('span'); n.className='slide-no'; n.textContent=pad(i+1)+' / '+pad(total); sec.appendChild(n); });
  function setActive(i){
    cur=i; var ch=secs[i].dataset.ch;
    counter.textContent=pad(i+1)+' / '+pad(total);
    links.forEach(function(a){ var on=a.dataset.ch===ch; a.setAttribute('aria-current', on?'true':'false'); if(on && a.scrollIntoView){ var ol=a.parentNode.parentNode; ol.scrollTo({left:a.offsetLeft-ol.clientWidth/2+a.clientWidth/2,behavior:'smooth'}); } });
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in-view'); } }); },{threshold:.15});
    secs.forEach(function(s){ io.observe(s); });
  } else secs.forEach(function(s){ s.classList.add('in-view'); });
  function onScroll(){
    var y=window.scrollY+window.innerHeight*0.4, idx=0;
    secs.forEach(function(s,i){ if(s.offsetTop<=y) idx=i; });
    if(idx!==cur || counter.textContent==='') setActive(idx);
    var max=document.documentElement.scrollHeight-window.innerHeight;
    prog.style.width=(max>0? window.scrollY/max*100 : 0)+'%';
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll(); setActive(cur);
  function go(d){ var i=Math.max(0,Math.min(total-1,cur+d)); secs[i].scrollIntoView({behavior:'smooth'}); }
  document.getElementById('next').addEventListener('click',function(){go(1);});
  document.getElementById('prev').addEventListener('click',function(){go(-1);});
  document.addEventListener('keydown',function(e){
    var t=e.target.tagName; if(t==='INPUT'||t==='TEXTAREA'||e.metaKey||e.ctrlKey||e.altKey) return;
    if(e.key==='ArrowRight'||e.key==='PageDown'){ e.preventDefault(); go(1); }
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); go(-1); }
  });
  // count-up stat tiles
  var statIO='IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; statIO.unobserve(e.target);
      var b=e.target, txt=b.textContent, m=txt.match(/^([+]?)(\d+)(%)$/); if(!m) return; var end=+m[2], t0=null;
      function step(ts){ if(!t0) t0=ts; var k=Math.min(1,(ts-t0)/900); b.textContent=m[1]+Math.round(end*k)+m[3]; if(k<1) requestAnimationFrame(step); }
      requestAnimationFrame(step); }); },{threshold:.6}) : null;
  if(statIO && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.stat b').forEach(function(b){ statIO.observe(b); });
})();
