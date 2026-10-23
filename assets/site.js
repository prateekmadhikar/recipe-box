const search = document.querySelector('[data-search-input]');
if (search) {
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    const cards = [...document.querySelectorAll('[data-card]')];
    let visible = 0;
    for (const card of cards) {
      const matches = card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    }
    document.querySelector('[data-result-count]').textContent = `${String(visible).padStart(2, '0')} recipe${visible === 1 ? '' : 's'}`;
    document.querySelector('.empty-search').hidden = visible > 0;
    document.querySelector('.future-card').hidden = Boolean(query);
  });
}

const recipe = document.body.dataset.recipe;
if (recipe) {
  const key = `recipe-box:v1:${recipe}`;
  const checks = [...document.querySelectorAll('[data-check]')];
  const sections = [...document.querySelectorAll('.recipe-section')];
  const saveNote = document.querySelector('[data-save-note]');
  let state = {};
  try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); if (saved && typeof saved === 'object' && !Array.isArray(saved)) state = saved; }
  catch { saveNote.textContent = 'Checkmarks are available for this visit. Browser storage is unavailable.'; }
  function updateProgress() {
    for (const counter of document.querySelectorAll('[data-progress]')) {
      const items = [...document.getElementById(counter.dataset.progress).querySelectorAll('[data-check]')];
      const done = items.filter(c => c.checked).length;
      counter.textContent = `${done} / ${items.length}`;
      counter.setAttribute('aria-label', `${done} of ${items.length} completed`);
    }
  }
  function persist() {
    state = Object.fromEntries(checks.filter(c=>c.checked).map(c=>[c.dataset.check,true]));
    try { localStorage.setItem(key,JSON.stringify(state)); }
    catch { saveNote.textContent = 'Checkmarks are available for this visit. Browser storage is unavailable.'; }
    updateProgress();
  }
  for (const check of checks) {check.checked = state[check.dataset.check] === true; check.addEventListener('change',persist);}
  updateProgress();
  for (const button of document.querySelectorAll('[data-reset]')) {
    button.addEventListener('click',()=>{
      for (const check of document.getElementById(button.dataset.reset).querySelectorAll('[data-check]')) check.checked=false;
      persist();
      const toast = document.querySelector('.toast');
      toast.textContent = 'Checklist reset. Ready for the next cook.';
      toast.hidden = false;
      clearTimeout(window.recipeToastTimeout);
      window.recipeToastTimeout = setTimeout(()=>{toast.hidden=true;},2500);
    });
  }
  const expand = document.querySelector('[data-expand]');
  function updateExpand() {expand.textContent = sections.every(s=>s.open) ? 'Collapse all sections' : 'Expand all sections';}
  expand.addEventListener('click',()=>{const open = !sections.every(s=>s.open);for (const section of sections) section.open=open;updateExpand();});
  sections.forEach(s=>s.addEventListener('toggle',updateExpand));
  function revealHash() { const target=document.getElementById(location.hash.slice(1));if(target?.classList.contains('recipe-section')) target.open=true; }
  window.addEventListener('hashchange',revealHash);
  document.querySelectorAll('.recipe-nav a,.hero-actions a').forEach(a=>a.addEventListener('click',()=>{const target=document.getElementById(a.hash.slice(1));if(target) target.open=true;}));
  revealHash();
  let printState = null;
  window.addEventListener('beforeprint',()=>{if (!printState) printState=sections.map(s=>s.open);sections.forEach(s=>{s.open=true;});});
  window.addEventListener('afterprint',()=>{if (printState) sections.forEach((s,i)=>{s.open=printState[i];});printState=null;updateExpand();});
  document.querySelector('[data-print]').addEventListener('click',()=>window.print());
}
