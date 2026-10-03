// ── Theme ─────────────────────────────────────────────────────
(function(){
  var saved = localStorage.getItem('ver-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
  var theme = saved||(prefersDark?'dark':'light');
  document.documentElement.setAttribute('data-theme',theme);
  updateToggle(theme);
})();
function toggleTheme(){
  var cur=document.documentElement.getAttribute('data-theme')||'light';
  var next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('ver-theme',next);
  updateToggle(next);
  drawDonut();
}
function updateToggle(t){
  var btn=document.getElementById('theme-toggle-btn');
  if(!btn)return;
  btn.innerHTML=t==='dark'
    ?'<span class="toggle-icon" style="transform:rotate(180deg);">&#9790;</span> Light'
    :'<span class="toggle-icon">&#9789;</span> Dark';
}
window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(e){
  if(!localStorage.getItem('ver-theme')){
    var t=e.matches?'dark':'light';
    document.documentElement.setAttribute('data-theme',t);
    updateToggle(t);