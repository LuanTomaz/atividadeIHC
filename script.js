const library = document.querySelector('#libraryGrid');
const panel = document.querySelector('.instrument-panel');
const workbench = document.querySelector('.workbench');
const greenhouse = document.querySelector('.greenhouse');
const detailView = document.querySelector('.detail-view');
const detailArt = document.querySelector('#detailArt');
const detailName = document.querySelector('#detailName');
const detailType = document.querySelector('#detailType');
const previewArt = document.querySelector('.preview-art');
const previewName = document.querySelector('#previewName');
const previewType = document.querySelector('#previewType');
const message = document.querySelector('#message');
const filterMenu = document.querySelector('.filter-menu');
const meterFill = document.querySelector('#meterFill');
const meterValue = document.querySelector('#meterValue');

const state = { progress: 72, selected: null, selectedCard: null, paused: false, filtered: false };
const feedback = {
  select: ['jogo selecionado', 0],
  install: ['instalação iniciada', 12],
  pause: ['instalação pausada', 0],
  launch: ['jogo iniciado', 0],
  remove: ['jogo desinstalado', -18],
  filter: ['biblioteca filtrada', 0]
};

function updateProgress(change) {
  state.progress = Math.max(0, Math.min(100, state.progress + change));
  meterFill.style.width = `${state.progress}%`;
  meterValue.textContent = state.progress;
}

function selectCard(card) {
  document.querySelectorAll('.game-card').forEach((item) => item.classList.remove('selected'));
  card.classList.add('selected');
  state.selected = card.dataset.game;
  state.selectedCard = card;
  const artClass = [...card.querySelector('.game-art').classList].find((name) => name.startsWith('art-'));
  previewArt.className = `preview-art ${artClass}`;
  previewName.textContent = card.querySelector('strong').textContent;
  previewType.textContent = card.querySelector('small').textContent;
  detailArt.className = `detail-art ${artClass}`;
  detailName.textContent = card.querySelector('strong').textContent;
  detailType.textContent = card.querySelector('small').textContent;
  detailView.classList.remove('is-hidden');
  workbench.classList.add('detail-open');
  greenhouse.remove();
  panel.classList.remove('is-hidden');
  message.textContent = `${state.selected} selecionado`;
}

function runAction(action) {
  const [label, change] = feedback[action];
  message.textContent = label;

  if (action === 'pause') {
    state.paused = !state.paused;
    library.classList.toggle('is-paused', state.paused);
    message.textContent = state.paused ? 'instalação pausada' : 'instalação retomada';
  } else if (action === 'launch') {
    document.querySelectorAll('.game-card').forEach((card) => card.classList.remove('playing'));
    state.selectedCard.classList.add('playing');
    message.textContent = `${state.selected} em execução`;
  } else if (action === 'filter') {
    filterMenu.classList.toggle('is-hidden');
    message.textContent = filterMenu.classList.contains('is-hidden') ? 'filtros fechados' : 'filtros abertos';
  } else if (action === 'remove') {
    state.selectedCard.classList.add('removed');
    state.selectedCard.dataset.installed = 'false';
    updateProgress(change);
  } else if (action === 'select') {
    message.textContent = `${state.selected} já está selecionado`;
  } else if (action === 'install') {
    state.selectedCard.classList.remove('removed');
    state.selectedCard.dataset.installed = 'true';
    updateProgress(change);
  }

  document.querySelector(`[data-action="${action}"]`).animate(
    [{ filter: 'brightness(1)' }, { filter: 'brightness(1.65)' }, { filter: 'brightness(1)' }],
    { duration: 420, easing: 'ease-out' }
  );
}

document.querySelectorAll('[data-action]').forEach((control) => {
  control.addEventListener('click', () => runAction(control.dataset.action));
});

document.querySelectorAll('.game-card').forEach((card) => {
  card.addEventListener('click', () => selectCard(card));
});

document.querySelectorAll('[data-filter]').forEach((option) => {
  option.addEventListener('click', () => {
    const filter = option.dataset.filter;
    library.dataset.filter = filter;
    document.querySelectorAll('.filter-option').forEach((item) => item.classList.remove('active'));
    option.classList.add('active');
    message.textContent = filter === 'all' ? 'biblioteca completa' : 'filtro aplicado';
  });
});

document.querySelector('[data-nav="back"]').addEventListener('click', () => {
  workbench.insertBefore(greenhouse, detailView);
  detailView.classList.add('is-hidden');
  panel.classList.add('is-hidden');
  workbench.classList.remove('detail-open');
  message.textContent = 'biblioteca aberta';
});
