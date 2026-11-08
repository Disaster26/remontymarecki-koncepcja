(function(){
  'use strict';
  var d=document;

  /* menu mobilne */
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function zamknij(){menu.classList.remove('otwarte');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('otwarte');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  /* aktywna pozycja menu = bieżąca sekcja */
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]'));
  var mapa={};linki.forEach(function(a){mapa[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wpisy){
      wpisy.forEach(function(w){
        if(w.isIntersecting){
          linki.forEach(function(a){a.classList.remove('akt');a.removeAttribute('aria-current');});
          var a=mapa[w.target.id]; if(a){a.classList.add('akt');a.setAttribute('aria-current','true');}
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    d.querySelectorAll('main section[id]').forEach(function(s){io.observe(s);});

    /* pasek dolny na telefonie po minięciu przycisków z hero */
    var mob=d.getElementById('mob'), ha=d.getElementById('heroAkcje');
    new IntersectionObserver(function(w){
      var widac=!w[0].isIntersecting && w[0].boundingClientRect.top<0;
      mob.classList.toggle('widac',widac);
    }).observe(ha);
  }

  /* przeciąganie myszą dla przewijanych torów */
  function ciagnij(tor,poKoncu){
    var x0=0,s0=0,wcisk=false,ruch=0;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse')return;
      wcisk=true;ruch=0;x0=e.clientX;s0=tor.scrollLeft;tor.classList.add('ciag');
    });
    window.addEventListener('pointermove',function(e){
      if(!wcisk)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));tor.scrollLeft=s0-dx;
    });
    window.addEventListener('pointerup',function(){
      if(!wcisk)return;wcisk=false;tor.classList.remove('ciag');
      if(poKoncu)poKoncu(s0);
    });
    tor.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();}},true);
  }

  /* karuzele w kartach */
  d.querySelectorAll('[data-karuzela]').forEach(function(k){
    var tor=k.querySelector('.kar-tor'), n=tor.children.length, licz=k.querySelector('.kar-licz');
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function idz(i){i=Math.max(0,Math.min(n-1,i));tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    var t;tor.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){if(licz)licz.textContent=(idx()+1)+' / '+n;},60);},{passive:true});
    k.querySelector('.kar-l').addEventListener('click',function(){idz(idx()-1);});
    k.querySelector('.kar-p').addEventListener('click',function(){idz(idx()+1);});
    tor.tabIndex=0;tor.setAttribute('aria-label','Galeria zdjęć, '+n+' zdjęć');
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    ciagnij(tor,function(s0){
      var w=tor.clientWidth, start=Math.round(s0/w), dx=tor.scrollLeft-s0;
      idz(Math.abs(dx)>w*0.15?start+(dx>0?1:-1):start);
    });
  });
  d.querySelectorAll('[data-przewijak]').forEach(function(t){ciagnij(t);});

  /* realizacje: więcej na telefonie */
  var rw=d.getElementById('realWiecej'), rg=d.getElementById('realG');
  rw.addEventListener('click',function(){rg.classList.add('wszystkie');rw.setAttribute('aria-expanded','true');});

  /* formularz pokazowy */
  var f=d.getElementById('form'), info=d.getElementById('formInfo');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    info.textContent='To podgląd strony - na docelowej wersji zapytanie trafi od razu na info@remonty-marecki.pl.';
  });

  var pl=d.getElementById('plik'), pn=d.getElementById('plikN');
  pl.addEventListener('change',function(){var n=pl.files.length;pn.textContent=n?(n===1?pl.files[0].name:'wybrano zdjęć: '+n):'nie wybrano plików';});

  d.getElementById('rok').textContent=new Date().getFullYear();
})();
