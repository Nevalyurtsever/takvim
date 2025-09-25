// Takvim: Ekim 2025 (0=Ocak, 9=Ekim)
const YEAR = 2025;
const MONTH = 9;

const $ = (s,r=document)=>r.querySelector(s);
function sameDay(iso,y,m,d){ const dt=new Date(iso+'T00:00:00'); return dt.getFullYear()===y&&dt.getMonth()===m&&dt.getDate()===d; }
function trDate(iso){
  const d=new Date(iso+'T00:00:00');
  return d.toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric',weekday:'long'});
}

// International kaldırıldı
function categoryLabel(c){
  return ({culture:'Kültür',social:'Sosyal',edu:'Eğitim',lang:'Dil',web:'Webinar'}[c] || 'Etkinlik');
}

function placeholderDataURL(title){
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'>
    <defs><linearGradient id='g' x1='0' x2='1'><stop offset='0%' stop-color='#eaf2ff'/><stop offset='100%' stop-color='#fff7ed'/></linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='Segoe UI, Roboto, Arial' font-size='46' fill='#1f2937'>${title.replace(/&/g,'&amp;')}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function safeImg(img,title){ img.loading='lazy'; img.onerror=()=>{ img.src=placeholderDataURL(title); } }

// ---- ETKİNLİKLER (International yok) ----
const EVENTS = [
  { id:'2025-10-11-yap-offline', title:'YAP Offline Toplantısı', date:'2025-10-11', time:'13:00', category:'social',
    image:'assets/yap-offline.jpg', detailImage:'assets/yap-offline.jpg',
    location:'Vistula – B Blok, Toplantı Odası', summary:'Aylık değerlendirme ve yeni dönem planı. Katılım: tüm çekirdek ekip.', tags:['Toplantı'] },

  { id:'2025-10-12-ssp-workshop', title:'Roket Atölyesi (SSP)', date:'2025-10-12', time:'11:00', category:'edu',
    image:'assets/ssp-workshop.jpg', detailImage:'assets/ssp-workshop.jpg',
    location:'Maker Lab', summary:'Temel roket fiziği ve güvenlik. Mini atım düzeneği üzerinde uygulama.', tags:['Atölye'] },

  { id:'2025-10-16-orientation-eng', title:'Tanışma ve Bilgilendirme (ENG)', date:'2025-10-16', time:'17:00', category:'edu',
    image:'assets/orientation-eng.jpg', detailImage:'assets/orientation-eng.jpg',
    location:'CIC Warsaw', summary:'Yeni katılımcılar için İngilizce tanışma ve bilgilendirme.', tags:['Tanışma'] },

  { id:'2025-10-17-it-meet', title:'İT Tanışma Toplantısı (İT)', date:'2025-10-17', time:'18:00', category:'edu',
    image:'assets/it-meet.jpg', detailImage:'assets/it-meet.jpg',
    location:'Lab 2', summary:'İT ekipleri ile tanışma ve süreçlerin üzerinden geçiş.', tags:['IT'] },

  { id:'2025-10-18-thesis-webinar', title:'Tez Webinar', date:'2025-10-18', time:'11:00', category:'web',
    image:'assets/thesis-webinar.jpg', detailImage:'assets/thesis-webinar.jpg',
    location:'Çevrim içi', summary:'Tez yazım süreci, kaynak yönetimi ve soru-cevap.', tags:['Webinar'] },

  { id:'2025-10-18-museum-lj', title:'Müze Gezisi (LJ)', date:'2025-10-18', time:'14:00', category:'culture',
    image:'assets/museum-lj.jpg', detailImage:'assets/museum-lj.jpg',
    location:'Şehir Müzesi', summary:'LJ ile şehir müzesi keşfi.', tags:['Gezi'] },

  { id:'2025-10-22-mentee-orientation', title:'Mentee Oryantasyon Günü', date:'2025-10-22', time:'10:00', category:'edu',
    image:'assets/mentee-orientation.jpg', detailImage:'assets/mentee-orientation.jpg',
    location:'Konferans Salonu', summary:'Program kuralları, hedefler ve kaynaklar.', tags:['Oryantasyon'] },

  { id:'2025-10-24-polin', title:'Polin Müze Gezisi', date:'2025-10-24', time:'14:00', category:'culture',
    image:'assets/polin.jpg', detailImage:'assets/polin.jpg',
    location:'POLIN Müzesi', summary:'POLIN Müzesi rehberli tur.', tags:['Gezi'] },

  { id:'2025-10-25-book-exchange', title:'Kitap Değişim Programı', date:'2025-10-25', time:'12:00', category:'culture',
    image:'assets/kitap.jpg', detailImage:'assets/kitap.jpg',
    location:'CIC Warsaw, Chmielna 73', summary:'“Oku, Anlat, Paylaş!” – herkes bir kitap getirir.', tags:['Kültür'] },

  { id:'2025-10-25-culture-exchange', title:'Culture Exchange', date:'2025-10-25', time:'15:00', category:'culture',
    image:'assets/culture-exchange.jpg', detailImage:'assets/culture-exchange.jpg',
    location:'CIC Warsaw', summary:'Holidays and Celebrations – kültür paylaşımı etkinliği.', tags:['Kültür'] },

  { id:'2025-10-26-start-polish', title:'Start Polish (PL)', date:'2025-10-26', time:'10:00', category:'lang',
    image:'assets/pexels-karolina-grabowska-4887203.jpg', detailImage:'assets/pexels-karolina-grabowska-4887203.jpg',
    location:'CIC Warsaw', summary:'Başlangıç seviye Lehçe pratik oturumu.', tags:['Dil'] },
];

// ---- Takvim kur ----
function buildCalendar(){
  const first=new Date(YEAR,MONTH,1);
  const startOffset=(first.getDay()+6)%7;
  const daysInMonth=new Date(YEAR,MONTH+1,0).getDate();
  const daysInPrev=new Date(YEAR,MONTH,0).getDate();

  $('#monthTitle').textContent = first.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})+' – Etkinlik Takvimi';

  const grid=$('#grid'); grid.innerHTML='';

  for(let i=0;i<42;i++){
    const cell=document.createElement('div'); cell.className='day';
    const dayNum=i-startOffset+1;
    const chipsHtml='<div class="chips"></div>';

    if(dayNum<1){
      const d=daysInPrev+dayNum; cell.classList.add('other');
      cell.innerHTML=`<div class="date">${d}</div>${chipsHtml}`;
    }else if(dayNum>daysInMonth){
      const d=dayNum-daysInMonth; cell.classList.add('other');
      cell.innerHTML=`<div class="date">${d}</div>${chipsHtml}`;
    }else{
      cell.innerHTML=`<div class="date">${dayNum}</div>${chipsHtml}`;
      const chips=cell.querySelector('.chips');

      const dayEvents=EVENTS.filter(ev=>sameDay(ev.date,YEAR,MONTH,dayNum))
        .sort((a,b)=>(a.time||'00:00').localeCompare(b.time||'00:00'));

      // Küçük ekranda taşmayı azalt
      const isSmall = window.matchMedia('(max-width: 480px)').matches;
      const maxChips = isSmall ? 2 : 3;

      dayEvents.slice(0,maxChips).forEach(ev=>{
        const chip=document.createElement('button');
        chip.className='chip'; chip.dataset.cat=ev.category; chip.title=ev.title;
        chip.textContent=(ev.time?ev.time+' · ':'')+ev.title;
        chip.addEventListener('click',e=>{e.stopPropagation(); openEvent(ev);});
        chips.appendChild(chip);
      });
      if(dayEvents.length>maxChips){
        const more=document.createElement('div'); more.className='more';
        more.textContent=`+${dayEvents.length-maxChips} etkinlik`; chips.appendChild(more);
      }
      cell.addEventListener('click',()=>openDayDrawer(YEAR,MONTH,dayNum,dayEvents));
    }
    grid.appendChild(cell);
  }
}

// ---- Gün çekmecesi ----
function openDayDrawer(y,m,d,list){
  $('#drawerTitle').textContent=new Date(y,m,d).toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric',weekday:'long'});
  const body=$('#drawerBody'); body.innerHTML='';
  if(!list||!list.length){
    const empty=document.createElement('div'); empty.style.gridColumn='1/-1'; empty.style.opacity='.7';
    empty.textContent='Bu günde etkinlik yok.'; body.appendChild(empty);
  }else{
    list.forEach(ev=>body.appendChild(buildEventCard(ev)));
  }
  $('#drawer').classList.add('open');
  $('#drawer').setAttribute('aria-hidden','false');
}
function closeDayDrawer(){ $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden','true'); }
$('#drawerClose').addEventListener('click', closeDayDrawer);

function buildEventCard(ev){
  const a=document.createElement('article'); a.className='evcard';
  a.innerHTML=`
    <div class="evthumb"><img alt="${ev.title}"></div>
    <div class="evbody">
      <div class="evtitle">${ev.title}</div>
      <div class="evtime">${(ev.time?ev.time+' · ':'')+trDate(ev.date)}</div>
    </div>`;
  const img=a.querySelector('img'); img.src=ev.image||ev.detailImage||''; safeImg(img, ev.title);
  a.addEventListener('click', ()=>openEvent(ev));
  return a;
}

// ---- Modal ----
function openEvent(ev){
  $('#evTitle').textContent=ev.title;
  $('#evDate').textContent=`${trDate(ev.date)}${ev.time?' · '+ev.time:''}`;
  $('#evDesc').textContent=ev.summary||'';
  const img=$('#evImg'); img.src=ev.detailImage||ev.image||''; safeImg(img, ev.title);

  const tagBox=$('#evTags'); tagBox.innerHTML='';
  const cat=document.createElement('span'); cat.className='tag'; cat.textContent=categoryLabel(ev.category); tagBox.appendChild(cat);
  (ev.tags||[]).forEach(t=>{ const s=document.createElement('span'); s.className='tag'; s.textContent=t; tagBox.appendChild(s); });

  // Arka plan kaymasını engelle
  document.body.dataset.scrollLock = '1';
  document.body.style.overflow = 'hidden';

  $('#modal').classList.add('open');
  $('#modal').setAttribute('aria-hidden','false');
}
function closeEvent(){
  $('#modal').classList.remove('open');
  $('#modal').setAttribute('aria-hidden','true');

  // Kaydırmayı geri aç
  if (document.body.dataset.scrollLock){
    document.body.style.overflow = '';
    delete document.body.dataset.scrollLock;
  }
}
$('#modalClose').addEventListener('click', closeEvent);
$('#modal').addEventListener('click', e=>{ if(e.target.id==='modal') closeEvent(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeEvent(); closeDayDrawer(); }});

// Başlat
buildCalendar();
