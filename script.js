const STORAGE_KEY = 'atlas-local-games-v2';
const defaultGames = [
  { id: 'vertice', title: 'Vértice', description: 'Exploração orbital', genre: 'explore', image: 'assets/vertice.jpg', size: 18, owned: true, installed: true },
  { id: 'nevoa', title: 'Névoa', description: 'Puzzle atmosférico', genre: 'puzzle', image: 'assets/nevoa.jpg', size: 8, owned: true, installed: true },
  { id: 'rastro', title: 'Rastro', description: 'Corrida noturna', genre: 'race', image: 'assets/rastro.jpg', size: 24, owned: true, installed: true },
  { id: 'orbe', title: 'Orbe', description: 'Jardim gravitacional', genre: 'explore', image: 'assets/orbe.jpg', size: 12, owned: true, installed: false },
  { id: 'circuito', title: 'Circuito 09', description: 'Corrida experimental', genre: 'race', image: 'assets/rastro.jpg', size: 16, owned: false, installed: false, price: 19.9 }
];
const $ = (selector) => document.querySelector(selector);
const dialog = $('#gameDialog');
const form = $('#gameForm');
const filterOrder = ['all', 'explore', 'puzzle', 'race'];
let games = loadGames();
let currentView = 'library';
let currentFilter = 'all';
let searchTerm = '';
let selectedImage = '';

function loadGames() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) && saved.length ? saved : defaultGames; }
  catch (error) { return defaultGames; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(games)); }
function genreLabel(genre) { return { explore: 'Exploração', puzzle: 'Puzzle', race: 'Corrida' }[genre] || 'Outro'; }
function escapeHtml(value) { return String(value).replace(/[&<>\'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }
function visibleGames() {
  return games.filter((game) => {
    const inView = currentView === 'library' ? game.owned && game.installed : true;
    const inGenre = currentFilter === 'all' || game.genre === currentFilter;
    return inView && inGenre && `${game.title} ${game.description}`.toLowerCase().includes(searchTerm.toLowerCase());
  });
}
function render() {
  const visible = visibleGames();
  $('#gameGrid').innerHTML = visible.map((game, index) => {
    const cardAction = currentView === 'store' ? (game.owned ? (game.installed ? 'launch' : 'install') : 'buy') : 'remove';
    const secondaryAction = currentView === 'library' ? 'launch' : '';
    const actionGlyph = cardAction === 'buy' || cardAction === 'install' ? '<img src="assets/icons8-sword-50.png" alt="" width="22" height="22">' : '<i></i>';
    return `<article class="game-card seed-${index % 4}" data-id="${game.id}"><div class="game-art"><img src="${game.image}" alt="Capa de ${escapeHtml(game.title)}"><span class="genre-stamp">${genreLabel(game.genre)}</span></div><div class="game-name"><h2>${escapeHtml(game.title)}</h2><p>${escapeHtml(game.description)}</p></div><div class="seed-actions"><button class="seed-button action-${cardAction}" data-action="${cardAction}" data-id="${game.id}" aria-label="Ação principal de ${escapeHtml(game.title)}">${actionGlyph}</button>${secondaryAction ? `<button class="seed-button action-${secondaryAction}" data-action="${secondaryAction}" data-id="${game.id}" aria-label="Ação secundária de ${escapeHtml(game.title)}"><i></i></button>` : ''}</div></article>`;
  }).join('');
  const installed = games.filter((game) => game.installed);
  $('#libraryCount').textContent = installed.length;
  $('#ownedReadout').textContent = `${games.filter((game) => game.owned).length} adquiridos`;
  $('#storageReadout').textContent = `${installed.reduce((total, game) => total + Number(game.size || 0), 0)} GB`;
  document.querySelectorAll('.seed-button').forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action, button.dataset.id)));
  updateFilterReadout();
}
function handleAction(action, id) {
  const game = games.find((item) => item.id === id);
  if (!game) return;
  if (action === 'buy') { game.owned = true; game.installed = true; showToast(`${game.title} atravessou o campo e foi adquirido`); }
  if (action === 'install') { game.installed = true; showToast(`${game.title} criou raízes na biblioteca`); }
  if (action === 'launch') { showToast(`${game.title} está emitindo sinal`); document.querySelector(`[data-id="${id}"]`)?.classList.add('is-awake'); }
  if (action === 'remove') { game.installed = false; showToast(`${game.title} voltou para o catálogo`); }
  persist(); render();
}
function setView(view) {
  currentView = view; currentFilter = 'all';
  document.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  $('#viewTitle').innerHTML = view === 'library' ? 'Sementes<br><em>em repouso.</em>' : 'Clareira<br><em>de descobertas.</em>';
  $('#viewDescription').textContent = view === 'library' ? 'Um pequeno arquivo para cultivar, reunir e revisitar mundos digitais.' : 'Fragmentos disponíveis para entrar no seu arquivo local.';
  render();
}
function updateFilterReadout() { $('#filterReadout').textContent = currentFilter === 'all' ? 'campo inteiro' : `zona ${genreLabel(currentFilter).toLowerCase()}`; }
function showToast(text) { $('#message').textContent = text; const toast = $('#toast'); toast.textContent = text; toast.classList.add('visible'); window.clearTimeout(showToast.timeout); showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2800); }

document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
$('#cycleFilter').addEventListener('click', () => { currentFilter = filterOrder[(filterOrder.indexOf(currentFilter) + 1) % filterOrder.length]; render(); showToast(`zona alterada: ${currentFilter === 'all' ? 'campo inteiro' : genreLabel(currentFilter)}`); });
$('#toggleSearch').addEventListener('click', () => { $('#searchPanel').classList.toggle('is-hidden'); if (!$('#searchPanel').classList.contains('is-hidden')) $('#searchInput').focus(); });
$('#closeSearch').addEventListener('click', () => $('#searchPanel').classList.add('is-hidden'));
$('#searchInput').addEventListener('input', (event) => { searchTerm = event.target.value; render(); });
$('#openAddGame').addEventListener('click', () => dialog.showModal());
$('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
$('#gameImage').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { selectedImage = reader.result; $('#imagePreview').innerHTML = `<img src="${selectedImage}" alt="Prévia da capa"><small>Trocar imagem</small>`; }; reader.readAsDataURL(file); });
form.addEventListener('submit', (event) => { event.preventDefault(); const title = $('#gameTitle').value.trim(); games.unshift({ id: `custom-${Date.now()}`, title, description: $('#gameDescription').value.trim(), genre: $('#gameGenre').value, image: selectedImage || 'assets/orbe.jpg', size: Number($('#gameSize').value), owned: true, installed: true }); persist(); form.reset(); selectedImage = ''; $('#imagePreview').innerHTML = '＋<small>Escolher imagem</small>'; dialog.close(); setView('library'); showToast(`${title} plantado no arquivo`); });
render();
