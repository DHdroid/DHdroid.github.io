const tabs = [...document.querySelectorAll('#results [role="tab"]')];
const modelSelect = document.getElementById('model-select');
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
for (const panel of panels) {
  const table = panel.querySelector('table');
  table.setAttribute('aria-label', panel.dataset.caption);
  table.querySelectorAll('thead th').forEach(cell => cell.scope = 'col');
  for (const row of table.querySelectorAll('tbody tr')) {
    row.classList.toggle('ours', row.cells[1].textContent.trim() === 'TaSQ');
  }
}
let activePanel;

function filterModel() {
  for (const row of activePanel.querySelectorAll('tbody tr')) {
    row.hidden = row.cells[0].textContent.trim() !== modelSelect.value;
  }
  activePanel.querySelector('table').setAttribute('aria-label', `${modelSelect.value} — ${activePanel.dataset.caption}`);
}

function activate(tab) {
  const previousModel = modelSelect.value;
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  activePanel = document.getElementById(tab.getAttribute('aria-controls'));
  const models = [...new Set([...activePanel.querySelectorAll('tbody tr')].map(row => row.cells[0].textContent.trim()))];
  modelSelect.replaceChildren(...models.map(model => new Option(model, model)));
  modelSelect.value = models.includes(previousModel) ? previousModel : models[0];
  modelSelect.setAttribute('aria-controls', activePanel.id);
  filterModel();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (next) { event.preventDefault(); activate(next); next.focus(); }
  });
});
modelSelect.addEventListener('change', filterModel);
activate(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
document.querySelector('.model-control').hidden = false;
document.getElementById('results').classList.add('model-filtered');
