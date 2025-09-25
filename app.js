// … (EVENTS listen ve yardımcı fonksiyonlar aynı kalsın)

function buildCalendar(){
  const first=new Date(YEAR,MONTH,1);
  const startOffset=(first.getDay()+6)%7;
  const daysInMonth=new Date(YEAR,MONTH+1,0).getDate();
  const daysInPrev=new Date(YEAR,MONTH,0).getDate();

  $('#monthTitle').textContent =
    first.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})+' – Etkinlik Takvimi';

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

      dayEvents.slice(0,3).forEach(ev=>{
        const chip=document.createElement('button');
        chip.className='chip'; chip.dataset.cat=ev.category; chip.title=ev.title;
        chip.textContent=(ev.time?ev.time+' · ':'')+ev.title;
        chip.addEventListener('click',e=>{e.stopPropagation(); openEvent(ev);});
        chips.appendChild(chip);
      });
      if(dayEvents.length>3){
        const more=document.createElement('div'); more.className='more';
        more.textContent=`+${dayEvents.length-3} etkinlik`; chips.appendChild(more);
      }
      cell.addEventListener('click',()=>openDayDrawer(YEAR,MONTH,dayNum,dayEvents));
    }
    grid.appendChild(cell);
  }

  // küçük ekranda Ajanda'yı doldur
  if (window.matchMedia('(max-width: 480px)').matches) buildAgenda();
}

// ---- Mobil Ajanda ----
function buildAgenda(){
  const box = document.getElementById('agenda');
  const monthEvents = EVENTS
    .filter(ev => new Date(ev.date).getMonth() === MONTH)
    .sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));

  box.innerHTML = `<div class="agenda-hd" style="padding:10px 12px; font-weight:800;">
    Aylık Ajanda</div>` + monthEvents.map(ev=>{
      const d = new Date(ev.date+'T00:00:00');
      const day = d.toLocaleDateString('tr-TR',{ day:'2-digit', month:'2-digit' });
      const wk  = d.toLocaleDateString('tr-TR',{ weekday:'short' });
      const tm  = ev.time || '';
      return `<div class="a-item" data-cat="${ev.category}">
        <div class="a-date">${day}<br><span style="font-size:11px;color:#64748b">${wk}</span></div>
        <div class="a-dot"></div>
        <div style="flex:1;min-width:0">
          <div class="a-title">${ev.title}</div>
          <div class="a-time">${tm} ${ev.location? '· '+ev.location:''}</div>
        </div>
      </div>`;
    }).join('');

  // Tıklama → modal
  [...box.querySelectorAll('.a-item')].forEach((el, i)=>{
    el.addEventListener('click', ()=> openEvent(monthEvents[i]));
  });
}

// ---- Drawer & Modal fonksiyonların aynı ----
// (openDayDrawer, buildEventCard, openEvent, closeEvent … değişmedi)

buildCalendar();
