/* ==========================================================================
   Nimbus — app.js
   Vanilla JS, single-page demo banking prototype. All data is fictional
   and persisted to localStorage only. No network calls, no real data.
   ========================================================================== */

const STORAGE_KEY = 'nimbus_state_v1';

const CURRENCIES = {
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  USD: { symbol: '$', name: 'US Dollar' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' }
};

// Static demo FX rates, base = EUR
const FX_RATES = { EUR: 1, GBP: 0.86, USD: 1.09, CHF: 0.95, CAD: 1.47 };

const CATEGORY_COLORS = {
  'Food & Drink': '#F59E0B',
  'Transport': '#5B8DEF',
  'Shopping': '#7C6FF0',
  'Entertainment': '#EC4899',
  'Bills': '#F87171',
  'Travel': '#34D399',
  'Income': '#34D399',
  'Other': '#8B93A7'
};

const CATEGORY_ICONS = {
  'Food & Drink': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 3v7a4 4 0 0 0 4 4v7M4 3h8v7a4 4 0 0 1-4 4M8 3v7M17 3v18M17 3c-2.5 0-4 2-4 5s1.5 5 4 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Transport': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="8" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M5 10l2-5h10l2 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="18" r="1.4" fill="currentColor"/><circle cx="16.5" cy="18" r="1.4" fill="currentColor"/></svg>',
  'Shopping': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  'Entertainment': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 14v-2a8 8 0 0 1 16 0v2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><rect x="2.5" y="14" width="5" height="6.5" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="16.5" y="14" width="5" height="6.5" rx="2" stroke="currentColor" stroke-width="1.7"/></svg>',
  'Bills': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  'Travel': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10.5 20.5 12 15l-7.5 2L3 15.5 13.5 9 8.8 3.6a1 1 0 0 1 1.4-1.4L16 6.8l5-3 1.6 1.6-3 5 4.4 5.8a1 1 0 0 1-1.4 1.4L17 15.5 15 22l-1.5-1.5-2-2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  'Income': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v13M12 17l-5-5M12 17l5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 20h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Other': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M2.5 9.5h19" stroke="currentColor" stroke-width="1.7"/></svg>'
};

const INVEST_HOLDINGS = [
  { symbol: 'GTE', name: 'Global Tech ETF', value: 1240.50, pct: 2.3 },
  { symbol: 'S&P', name: 'S&P 500 Index Fund', value: 980.20, pct: 1.1 },
  { symbol: 'GRN', name: 'Green Energy Fund', value: 415.75, pct: -0.8 },
  { symbol: 'BND', name: 'Government Bond Fund', value: 300.00, pct: 0.2 }
];

const CRYPTO_HOLDINGS = [
  { symbol: 'BTC', name: 'Bitcoin', value: 612.40, pct: 3.4 },
  { symbol: 'ETH', name: 'Ethereum', value: 288.10, pct: -1.6 },
  { symbol: 'SOL', name: 'Solana', value: 94.60, pct: 5.2 }
];

const RECIPIENTS = [
  { id: 'r1', name: 'Aoife Byrne', sub: '@aoife.b' },
  { id: 'r2', name: 'Marcus Webb', sub: '@marcuswebb' },
  { id: 'r3', name: 'Priya Nair', sub: '@priya.nair' },
  { id: 'r4', name: 'Tomás Ó Riain', sub: '@tomasor' },
  { id: 'r5', name: 'Sofia Conti', sub: '@sofia.c' }
];

function nowIso(offsetHours = 0) {
  const d = new Date(Date.now() - offsetHours * 3600 * 1000);
  return d.toISOString();
}

function defaultData() {
  return {
    user: { name: 'LtHalkin', account: '4471', currency: 'EUR' },
    balances: { available: 8420.50, savings: 2100.00 },
    card: {
      status: 'active', // active | frozen
      limit: 1500,
      onlinePayments: true,
      contactless: true,
      virtualNumber: '5399 4821 0073 4471',
      physicalNumber: '5399 4821 0091 2290',
      expiry: '09/29',
      cvv: '482'
    },
    transactions: [
      { id: 't1', name: 'Spotify', category: 'Entertainment', amount: -10.99, date: nowIso(3), reference: 'Monthly subscription', method: 'Virtual card' },
      { id: 't2', name: 'Starbucks', category: 'Food & Drink', amount: -5.40, date: nowIso(7), reference: 'Coffee', method: 'Physical card' },
      { id: 't3', name: 'Salary', category: 'Income', amount: 2850.00, date: nowIso(30), reference: 'Monthly salary', method: 'Bank transfer' },
      { id: 't4', name: 'Amazon', category: 'Shopping', amount: -64.99, date: nowIso(20), reference: 'Order #884-2211', method: 'Virtual card' },
      { id: 't5', name: 'Dublin Bus', category: 'Transport', amount: -3.30, date: nowIso(28), reference: 'Leap top-up', method: 'Physical card' },
      { id: 't6', name: 'Electric Ireland', category: 'Bills', amount: -78.20, date: nowIso(50), reference: 'Utility bill', method: 'Direct debit' },
      { id: 't7', name: 'Ryanair', category: 'Travel', amount: -142.00, date: nowIso(90), reference: 'Flight booking', method: 'Virtual card' },
      { id: 't8', name: 'Aoife Byrne', category: 'Other', amount: 35.00, date: nowIso(110), reference: 'Dinner split', method: 'Bank transfer' }
    ]
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    if (!parsed.user || !parsed.balances || !parsed.transactions) return defaultData();
    return parsed;
  } catch (e) {
    return defaultData();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function fmtMoney(amount, currency = state.user.currency, showSign = false) {
  const cur = CURRENCIES[currency] || CURRENCIES.EUR;
  const sign = amount < 0 ? '-' : (showSign ? '+' : '');
  const abs = Math.abs(amount).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sign}${cur.symbol}${abs}`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
}

function fmtDateShort(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor((today - d) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
}

function genId() {
  return 'tx' + Math.random().toString(36).slice(2, 9);
}
function genRef() {
  return Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.floor(Math.random() * 9000 + 1000);
}

/* ==========================================================================
   Toast
   ========================================================================== */
function toast(message, type = 'default') {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  }, 2600);
}

/* ==========================================================================
   Modal (confirmation)
   ========================================================================== */
function showModal({ title, body, confirmLabel = 'Confirm', danger = true, onConfirm }) {
  const backdrop = document.getElementById('modalBackdrop');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  const confirmBtn = document.getElementById('modalConfirmBtn');
  confirmBtn.textContent = confirmLabel;
  confirmBtn.className = danger ? 'danger-btn primary-btn mt-0' : 'primary-btn mt-0';
  confirmBtn.style.flex = '1';
  backdrop.classList.add('open');

  const cleanup = () => { backdrop.classList.remove('open'); };
  const confirmHandler = () => { cleanup(); onConfirm && onConfirm(); };
  const cancelHandler = () => { cleanup(); };

  const newConfirm = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
  newConfirm.addEventListener('click', confirmHandler);

  const cancelBtn = document.getElementById('modalCancelBtn');
  const newCancel = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
  newCancel.addEventListener('click', cancelHandler);
}
document.getElementById('modalBackdrop').addEventListener('click', (e) => {
  if (e.target.id === 'modalBackdrop') e.target.classList.remove('open');
});

/* ==========================================================================
   Navigation
   ========================================================================== */
const NAV_SCREENS = ['home', 'payments', 'cards', 'analytics', 'profile'];
let currentScreen = 'home';
let activeTxId = null;

function nav(screenKey) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenKey);
  if (target) target.classList.add('active');
  currentScreen = screenKey;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.navkey === screenKey);
  });
  const shell = document.querySelector('.app-shell');
  if (shell) shell.scrollTop = 0;
  window.scrollTo(0, 0);

  if (screenKey === 'home') renderHome();
  if (screenKey === 'transactions') renderTransactionsScreen();
  if (screenKey === 'txdetail') renderTxDetail();
  if (screenKey === 'txedit') renderTxEdit();
  if (screenKey === 'cards') renderCards();
  if (screenKey === 'payments') resetPaymentFlow();
  if (screenKey === 'exchange') resetExchangeFlow();
  if (screenKey === 'analytics') renderAnalytics();
  if (screenKey === 'invest') renderPortfolio('invest');
  if (screenKey === 'crypto') renderPortfolio('crypto');
  if (screenKey === 'profile') renderProfile();
  if (screenKey === 'admin') renderAdmin();
}

document.body.addEventListener('click', (e) => {
  const navBtn = e.target.closest('[data-nav]');
  if (navBtn) nav(navBtn.dataset.nav);
});

/* ==========================================================================
   Home screen
   ========================================================================== */
let balanceHidden = false;

function greetingForTime() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function renderHome() {
  document.getElementById('avatarInitials').textContent = initials(state.user.name);

  const cur = CURRENCIES[state.user.currency] || CURRENCIES.EUR;
  document.getElementById('balanceCurrencySymbol').textContent = cur.symbol;
  document.getElementById('balanceAmount').textContent = state.balances.available.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('balanceSub').textContent = `Personal · ${state.user.currency}`;

  const list = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const container = document.getElementById('homeTxList');
  container.innerHTML = list.length ? list.map(txRowHtml).join('') : `<div class="tx-empty">No transactions yet</div>`;
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'U';
}

document.getElementById('eyeBtn').addEventListener('click', () => {
  balanceHidden = !balanceHidden;
  document.getElementById('balanceAmount').classList.toggle('hidden-amt', balanceHidden);
  document.getElementById('eyeIconOpen').style.display = balanceHidden ? 'none' : 'block';
  document.getElementById('eyeIconClosed').style.display = balanceHidden ? 'block' : 'none';
});

document.getElementById('qaAddMoney').addEventListener('click', () => {
  state.balances.available += 100;
  saveState();
  toast('€100.00 added (demo top-up)', 'success');
  if (currentScreen === 'home') renderHome();
});

/* ==========================================================================
   Transaction row + list/detail/edit
   ========================================================================== */
function txRowHtml(tx) {
  const positive = tx.amount > 0;
  const icon = CATEGORY_ICONS[tx.category] || CATEGORY_ICONS['Other'];
  const color = CATEGORY_COLORS[tx.category] || '#6B7280';
  return `
    <div class="tx-row" data-tx-id="${tx.id}">
      <div class="tx-icon" style="background:${color}1F; border-color:transparent; color:${color}">${icon}</div>
      <div class="tx-mid">
        <div class="tx-name">${escapeHtml(tx.name)}</div>
        <div class="tx-sub">${escapeHtml(tx.category)} · ${fmtDateShort(tx.date)}</div>
      </div>
      <div class="tx-amount ${positive ? 'positive' : 'negative'}">${fmtMoney(tx.amount, state.user.currency, positive)}</div>
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.body.addEventListener('click', (e) => {
  const row = e.target.closest('.tx-row');
  if (row) {
    activeTxId = row.dataset.txId;
    nav('txdetail');
  }
});

let txFilterType = 'all';
let txFilterCat = 'all';
let txFilterDate = '';
let txSearchQuery = '';

function renderTransactionsScreen() {
  document.getElementById('txSearch').value = txSearchQuery;
  document.getElementById('txDateFilter').value = txFilterDate;
  renderFullTxList();
}

function renderFullTxList() {
  let list = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (txFilterType === 'income') list = list.filter(t => t.amount > 0);
  if (txFilterType === 'expense') list = list.filter(t => t.amount < 0);
  if (txFilterCat !== 'all') list = list.filter(t => t.category === txFilterCat);
  if (txFilterDate) list = list.filter(t => t.date.slice(0, 10) === txFilterDate);
  if (txSearchQuery.trim()) {
    const q = txSearchQuery.trim().toLowerCase();
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.reference || '').toLowerCase().includes(q));
  }
  const container = document.getElementById('fullTxList');
  container.innerHTML = list.length ? list.map(txRowHtml).join('') : `<div class="tx-empty">No transactions match your filters</div>`;
}

document.getElementById('txSearch').addEventListener('input', (e) => {
  txSearchQuery = e.target.value;
  renderFullTxList();
});
document.getElementById('filterRow').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-filter-type]');
  if (!chip) return;
  txFilterType = chip.dataset.filterType;
  document.querySelectorAll('#filterRow .chip').forEach(c => c.classList.toggle('active', c === chip));
  renderFullTxList();
});
document.getElementById('filterRowCats').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-filter-cat]');
  if (!chip) return;
  txFilterCat = chip.dataset.filterCat;
  document.querySelectorAll('#filterRowCats .chip').forEach(c => c.classList.toggle('active', c === chip));
  renderFullTxList();
});
document.getElementById('txDateFilter').addEventListener('change', (e) => {
  txFilterDate = e.target.value;
  renderFullTxList();
});
document.getElementById('clearDateFilter').addEventListener('click', () => {
  txFilterDate = '';
  document.getElementById('txDateFilter').value = '';
  renderFullTxList();
});
document.getElementById('addTxBtn').addEventListener('click', () => {
  activeTxId = null;
  nav('txedit');
});

function renderTxDetail() {
  const tx = state.transactions.find(t => t.id === activeTxId);
  if (!tx) { nav('transactions'); return; }
  const color = CATEGORY_COLORS[tx.category] || '#6B7280';
  const iconEl = document.getElementById('txdIcon');
  iconEl.innerHTML = (CATEGORY_ICONS[tx.category] || CATEGORY_ICONS['Other']).replace('width="18" height="18"', 'width="26" height="26"');
  iconEl.style.background = color + '1F';
  iconEl.style.borderColor = 'transparent';
  iconEl.style.color = color;
  document.getElementById('txdAmount').textContent = fmtMoney(tx.amount, state.user.currency, tx.amount > 0);
  document.getElementById('txdAmount').style.color = tx.amount > 0 ? 'var(--positive)' : 'var(--text)';
  document.getElementById('txdMerchant').textContent = tx.name;
  document.getElementById('txdCategory').textContent = tx.category;
  document.getElementById('txdDate').textContent = fmtDate(tx.date);
  document.getElementById('txdMethod').textContent = tx.method || 'Bank transfer';
  document.getElementById('txdReference').textContent = tx.reference || '—';
  document.getElementById('txdId').textContent = tx.id.toUpperCase();
}

document.getElementById('editTxBtn').addEventListener('click', () => nav('txedit'));
document.getElementById('deleteTxBtn').addEventListener('click', () => {
  showModal({
    title: 'Remove transaction?',
    body: 'This will permanently remove this transaction from your demo data.',
    confirmLabel: 'Remove',
    onConfirm: () => {
      state.transactions = state.transactions.filter(t => t.id !== activeTxId);
      saveState();
      toast('Transaction removed', 'success');
      nav('transactions');
    }
  });
});

function renderTxEdit() {
  const tx = state.transactions.find(t => t.id === activeTxId);
  document.getElementById('txeditTitle').textContent = tx ? 'Edit transaction' : 'Add transaction';
  document.getElementById('txeName').value = tx ? tx.name : '';
  document.getElementById('txeAmount').value = tx ? tx.amount : '';
  document.getElementById('txeCategory').value = tx ? tx.category : 'Other';
  document.getElementById('txeDate').value = tx ? tx.date.slice(0, 16) : new Date().toISOString().slice(0, 16);
  document.getElementById('txeReference').value = tx ? (tx.reference || '') : '';
}

document.getElementById('txeSaveBtn').addEventListener('click', () => {
  const name = document.getElementById('txeName').value.trim();
  const amount = parseFloat(document.getElementById('txeAmount').value);
  const category = document.getElementById('txeCategory').value;
  const dateVal = document.getElementById('txeDate').value;
  const reference = document.getElementById('txeReference').value.trim();

  if (!name || isNaN(amount) || !dateVal) {
    toast('Please fill in name, amount and date', 'error');
    return;
  }
  const isoDate = new Date(dateVal).toISOString();

  if (activeTxId) {
    const tx = state.transactions.find(t => t.id === activeTxId);
    if (tx) {
      const delta = amount - tx.amount;
      Object.assign(tx, { name, amount, category, date: isoDate, reference });
      state.balances.available += delta;
    }
    toast('Transaction updated', 'success');
  } else {
    state.transactions.push({ id: genId(), name, amount, category, date: isoDate, reference, method: 'Manual entry' });
    state.balances.available += amount;
    activeTxId = state.transactions[state.transactions.length - 1].id;
    toast('Transaction added', 'success');
  }
  saveState();
  nav('txdetail');
});

/* ==========================================================================
   Cards
   ========================================================================== */
let activeCardTab = 'virtual';
let cardRevealed = { virtual: false, physical: false };

function renderCards() {
  document.querySelectorAll('.card-tab').forEach(t => t.classList.toggle('active', t.dataset.cardtab === activeCardTab));
  const c = state.card;
  const frozen = c.status === 'frozen';
  const number = activeCardTab === 'virtual' ? c.virtualNumber : c.physicalNumber;
  const revealed = cardRevealed[activeCardTab];
  const displayNumber = revealed ? number : maskCardNumber(number);
  const displayCvv = revealed ? c.cvv : '•••';

  document.getElementById('cardVisualWrap').innerHTML = `
    <div class="card-visual ${frozen ? 'frozen' : ''}">
      ${frozen ? '<div class="card-frozen-badge">❄ Frozen</div>' : ''}
      <div class="row1">
        <div class="card-brand">nimbus</div>
        <div class="card-chip"></div>
      </div>
      <div class="card-number">${displayNumber}</div>
      <div class="card-bottom-row">
        <div>
          <div class="card-field-label">Card holder</div>
          <div class="card-field-value">${escapeHtml(state.user.name.toUpperCase())}</div>
        </div>
        <div>
          <div class="card-field-label">Expires</div>
          <div class="card-field-value">${c.expiry}</div>
        </div>
        <div class="card-network">nimbus pay</div>
      </div>
    </div>`;

  document.getElementById('cardControls').innerHTML = `
    <div class="control-row">
      <div>
        <div class="control-label">${frozen ? 'Card frozen' : 'Freeze card'}</div>
        <div class="control-sub">Instantly block new payments</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="freezeToggle" ${frozen ? 'checked' : ''}>
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="control-row">
      <div>
        <div class="control-label">Card details</div>
        <div class="control-sub">${revealed ? `CVV ${displayCvv}` : 'Number and CVV hidden'}</div>
      </div>
      <button class="reveal-btn" id="revealBtn">${revealed ? 'Hide' : 'Reveal'}</button>
    </div>
    <div class="control-row">
      <div>
        <div class="control-label">Online payments</div>
        <div class="control-sub">Allow e-commerce transactions</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="onlineToggle" ${c.onlinePayments ? 'checked' : ''}>
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="control-row">
      <div>
        <div class="control-label">Contactless</div>
        <div class="control-sub">Tap to pay in stores</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="contactlessToggle" ${c.contactless ? 'checked' : ''}>
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="control-row" style="flex-direction:column; align-items:stretch; gap:12px">
      <div class="slider-row">
        <div class="slider-row-top">
          <span class="control-label">Spending limit</span>
          <span class="mono-small" id="limitValue">${fmtMoney(c.limit)}</span>
        </div>
        <input type="range" id="limitSlider" min="50" max="5000" step="50" value="${c.limit}">
      </div>
    </div>`;

  document.getElementById('freezeToggle').addEventListener('change', (e) => {
    state.card.status = e.target.checked ? 'frozen' : 'active';
    saveState();
    toast(state.card.status === 'frozen' ? 'Card frozen' : 'Card unfrozen', 'success');
    renderCards();
  });
  document.getElementById('revealBtn').addEventListener('click', () => {
    cardRevealed[activeCardTab] = !cardRevealed[activeCardTab];
    renderCards();
  });
  document.getElementById('onlineToggle').addEventListener('change', (e) => {
    state.card.onlinePayments = e.target.checked;
    saveState();
    toast('Online payments ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
  });
  document.getElementById('contactlessToggle').addEventListener('change', (e) => {
    state.card.contactless = e.target.checked;
    saveState();
    toast('Contactless ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
  });
  document.getElementById('limitSlider').addEventListener('input', (e) => {
    document.getElementById('limitValue').textContent = fmtMoney(parseFloat(e.target.value));
  });
  document.getElementById('limitSlider').addEventListener('change', (e) => {
    state.card.limit = parseFloat(e.target.value);
    saveState();
    toast('Spending limit updated', 'success');
  });
}

function maskCardNumber(num) {
  const parts = num.split(' ');
  return parts.map((p, i) => i < parts.length - 1 ? '••••' : p).join(' ');
}

document.querySelectorAll('.card-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    activeCardTab = tab.dataset.cardtab;
    renderCards();
  });
});

/* ==========================================================================
   Payments
   ========================================================================== */
let selectedRecipient = null;

function resetPaymentFlow() {
  document.getElementById('payStep1').style.display = 'block';
  document.getElementById('payStep2').style.display = 'none';
  document.getElementById('payStep3').style.display = 'none';
  document.getElementById('payAmount').value = '';
  document.getElementById('payReference').value = '';
  selectedRecipient = null;
  document.getElementById('payCurrencySymbol').textContent = CURRENCIES[state.user.currency].symbol;

  const list = document.getElementById('recipientList');
  list.innerHTML = RECIPIENTS.map(r => `
    <div class="recipient-item" data-rid="${r.id}">
      <div class="recipient-avatar">${initials(r.name)}</div>
      <div>
        <div class="recipient-name">${escapeHtml(r.name)}</div>
        <div class="recipient-sub">${escapeHtml(r.sub)}</div>
      </div>
    </div>`).join('');
  list.querySelectorAll('.recipient-item').forEach(item => {
    item.addEventListener('click', () => {
      selectedRecipient = RECIPIENTS.find(r => r.id === item.dataset.rid);
      list.querySelectorAll('.recipient-item').forEach(i => i.classList.toggle('selected', i === item));
    });
  });
}

document.getElementById('reviewPaymentBtn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('payAmount').value);
  if (!selectedRecipient) { toast('Choose a recipient', 'error'); return; }
  if (!amount || amount <= 0) { toast('Enter a valid amount', 'error'); return; }
  if (amount > state.balances.available) { toast('Insufficient available balance', 'error'); return; }

  const ref = document.getElementById('payReference').value.trim();
  document.getElementById('reviewRecipient').textContent = selectedRecipient.name;
  document.getElementById('reviewAmount').textContent = fmtMoney(amount);
  document.getElementById('reviewReference').textContent = ref || '—';
  document.getElementById('payStep1').style.display = 'none';
  document.getElementById('payStep2').style.display = 'block';
});

document.getElementById('backToStep1Btn').addEventListener('click', () => {
  document.getElementById('payStep2').style.display = 'none';
  document.getElementById('payStep1').style.display = 'block';
});

document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('payAmount').value);
  const ref = document.getElementById('payReference').value.trim();

  state.transactions.push({
    id: genId(), name: selectedRecipient.name, category: 'Other', amount: -amount,
    date: new Date().toISOString(), reference: ref || 'Payment', method: 'Bank transfer'
  });
  state.balances.available -= amount;
  saveState();

  document.getElementById('successSummary').textContent = `You sent ${fmtMoney(amount)} to ${selectedRecipient.name}`;
  document.getElementById('payStep2').style.display = 'none';
  document.getElementById('payStep3').style.display = 'flex';
});

document.getElementById('doneBtn').addEventListener('click', () => nav('home'));

/* ==========================================================================
   Exchange
   ========================================================================== */
let exFromCurrency = 'EUR';
let exToCurrency = 'GBP';
let currencyPickerTarget = null;

function resetExchangeFlow() {
  document.getElementById('exchangeStep1').style.display = 'block';
  document.getElementById('exchangeStep2').style.display = 'none';
  document.getElementById('exchangeStep3').style.display = 'none';
  exFromCurrency = state.user.currency;
  exToCurrency = exFromCurrency === 'GBP' ? 'EUR' : 'GBP';
  document.getElementById('exFromAmount').value = 100;
  updateExchangeUI();
}

function exRate(from, to) {
  return FX_RATES[to] / FX_RATES[from];
}

function updateExchangeUI() {
  document.getElementById('exFromCurrencyBtn').textContent = exFromCurrency;
  document.getElementById('exToCurrencyBtn').textContent = exToCurrency;
  const amt = parseFloat(document.getElementById('exFromAmount').value) || 0;
  const rate = exRate(exFromCurrency, exToCurrency);
  const converted = amt * rate;
  document.getElementById('exToAmount').value = converted.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('exRateLine').textContent = `1 ${exFromCurrency} = ${rate.toFixed(4)} ${exToCurrency}`;
}

document.getElementById('exFromAmount').addEventListener('input', updateExchangeUI);

document.getElementById('exSwapBtn').addEventListener('click', () => {
  [exFromCurrency, exToCurrency] = [exToCurrency, exFromCurrency];
  updateExchangeUI();
});

function openCurrencySheet(target) {
  currencyPickerTarget = target;
  openActionSheet(target === 'from' ? 'Send in' : 'Receive in', Object.keys(CURRENCIES).map(code => ({
    label: CURRENCIES[code].name,
    sub: code,
    badge: code,
    onSelect: () => {
      if (currencyPickerTarget === 'from') exFromCurrency = code;
      else exToCurrency = code;
      updateExchangeUI();
    }
  })));
}

/* Generic bottom action sheet — used for currency picking, Move, More, etc. */
function openActionSheet(title, options) {
  document.getElementById('actionSheetTitle').textContent = title;
  const body = document.getElementById('actionSheetBody');
  body.innerHTML = options.map((opt, i) => `
    <div class="sheet-option" data-idx="${i}">
      <div class="sheet-option-flag">${opt.badge || opt.label.slice(0, 2).toUpperCase()}</div>
      <div>
        <div style="font-weight:500">${escapeHtml(opt.label)}</div>
        ${opt.sub ? `<div class="recipient-sub">${escapeHtml(opt.sub)}</div>` : ''}
      </div>
    </div>`).join('');
  body.querySelectorAll('.sheet-option').forEach(el => {
    el.addEventListener('click', () => {
      closeSheet();
      options[parseInt(el.dataset.idx, 10)].onSelect();
    });
  });
  document.getElementById('sheetBackdrop').classList.add('open');
  document.getElementById('actionSheet').classList.add('open');
}

function openDetailsSheet() {
  document.getElementById('actionSheetTitle').textContent = 'Account details';
  const body = document.getElementById('actionSheetBody');
  const iban = 'IE29 NIMB 9900 12' + state.user.account;
  body.innerHTML = `
    <div class="detail-list" style="margin-bottom:8px">
      <div class="detail-row"><span>Account holder</span><span>${escapeHtml(state.user.name)}</span></div>
      <div class="detail-row"><span>Account number</span><span class="mono-small">•••• ${escapeHtml(state.user.account)}</span></div>
      <div class="detail-row"><span>IBAN</span><span class="mono-small">${iban}</span></div>
      <div class="detail-row"><span>BIC</span><span class="mono-small">NIMBIE2D</span></div>
      <div class="detail-row"><span>Currency</span><span>${state.user.currency}</span></div>
    </div>`;
  document.getElementById('sheetBackdrop').classList.add('open');
  document.getElementById('actionSheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('sheetBackdrop').classList.remove('open');
  document.getElementById('actionSheet').classList.remove('open');
}
document.getElementById('sheetBackdrop').addEventListener('click', closeSheet);
document.getElementById('exFromCurrencyBtn').addEventListener('click', () => openCurrencySheet('from'));
document.getElementById('exToCurrencyBtn').addEventListener('click', () => openCurrencySheet('to'));

document.getElementById('exReviewBtn').addEventListener('click', () => {
  const amt = parseFloat(document.getElementById('exFromAmount').value);
  if (!amt || amt <= 0) { toast('Enter a valid amount', 'error'); return; }
  if (exFromCurrency === state.user.currency && amt > state.balances.available) {
    toast('Insufficient available balance', 'error'); return;
  }
  const rate = exRate(exFromCurrency, exToCurrency);
  document.getElementById('exReviewFrom').textContent = `${amt.toFixed(2)} ${exFromCurrency}`;
  document.getElementById('exReviewTo').textContent = `${(amt * rate).toFixed(2)} ${exToCurrency}`;
  document.getElementById('exReviewRate').textContent = `1 ${exFromCurrency} = ${rate.toFixed(4)} ${exToCurrency}`;
  document.getElementById('exchangeStep1').style.display = 'none';
  document.getElementById('exchangeStep2').style.display = 'block';
});
document.getElementById('exBackBtn').addEventListener('click', () => {
  document.getElementById('exchangeStep2').style.display = 'none';
  document.getElementById('exchangeStep1').style.display = 'block';
});
document.getElementById('exConfirmBtn').addEventListener('click', () => {
  const amt = parseFloat(document.getElementById('exFromAmount').value);
  const rate = exRate(exFromCurrency, exToCurrency);
  const converted = amt * rate;

  if (exFromCurrency === state.user.currency) {
    state.balances.available -= amt;
    state.transactions.push({
      id: genId(), name: `Exchange to ${exToCurrency}`, category: 'Other', amount: -amt,
      date: new Date().toISOString(), reference: `Converted to ${converted.toFixed(2)} ${exToCurrency}`, method: 'Currency exchange'
    });
  } else if (exToCurrency === state.user.currency) {
    state.balances.available += converted;
    state.transactions.push({
      id: genId(), name: `Exchange from ${exFromCurrency}`, category: 'Other', amount: converted,
      date: new Date().toISOString(), reference: `Converted from ${amt.toFixed(2)} ${exFromCurrency}`, method: 'Currency exchange'
    });
  }
  saveState();
  document.getElementById('exSuccessSummary').textContent = `Converted ${amt.toFixed(2)} ${exFromCurrency} to ${converted.toFixed(2)} ${exToCurrency}`;
  document.getElementById('exchangeStep2').style.display = 'none';
  document.getElementById('exchangeStep3').style.display = 'flex';
});
document.getElementById('exDoneBtn').addEventListener('click', () => nav('home'));

/* ==========================================================================
   Analytics
   ========================================================================== */
function renderAnalytics() {
  const now = new Date();
  const monthTx = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const source = monthTx.length ? monthTx : state.transactions;

  const income = source.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = source.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const remaining = income - expenses;

  document.getElementById('anIncome').textContent = fmtMoney(income);
  document.getElementById('anExpenses').textContent = fmtMoney(expenses);
  document.getElementById('anRemaining').textContent = fmtMoney(remaining);
  document.getElementById('anRemaining').className = 'an-stat-value ' + (remaining >= 0 ? 'positive' : 'negative');

  const byCat = {};
  source.filter(t => t.amount < 0).forEach(t => {
    byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount);
  });
  const total = Object.values(byCat).reduce((a, b) => a + b, 0);
  document.getElementById('donutCenterAmount').textContent = fmtMoney(total);

  const donut = document.getElementById('donutChart');
  const legend = document.getElementById('catLegend');

  if (total === 0) {
    donut.innerHTML = `<circle cx="100" cy="100" r="80" fill="none" stroke="var(--surface-hi)" stroke-width="26"/>`;
    legend.innerHTML = `<div class="cat-empty">No spending recorded yet</div>`;
    return;
  }

  let offset = 0;
  const circumference = 2 * Math.PI * 80;
  let arcs = '';
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  entries.forEach(([cat, amt]) => {
    const frac = amt / total;
    const dash = frac * circumference;
    arcs += `<circle cx="100" cy="100" r="80" fill="none" stroke="${CATEGORY_COLORS[cat] || '#8B93A7'}" stroke-width="26"
      stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
    offset += dash;
  });
  donut.innerHTML = arcs;

  legend.innerHTML = entries.map(([cat, amt]) => `
    <div class="cat-legend-row">
      <span class="cat-dot" style="background:${CATEGORY_COLORS[cat] || '#8B93A7'}"></span>
      <span class="cat-legend-name">${escapeHtml(cat)}</span>
      <span class="cat-legend-amt">${fmtMoney(amt)} · ${Math.round((amt / total) * 100)}%</span>
    </div>`).join('');
}

/* ==========================================================================
   Invest / Crypto (demo portfolios)
   ========================================================================== */
function renderPortfolio(kind) {
  const holdings = kind === 'invest' ? INVEST_HOLDINGS : CRYPTO_HOLDINGS;
  const total = holdings.reduce((s, h) => s + h.value, 0);
  const weightedPct = holdings.reduce((s, h) => s + h.value * h.pct, 0) / total;
  const changeAmt = total * (weightedPct / 100);

  document.getElementById(kind + 'Total').textContent = fmtMoney(total);
  const changeEl = document.getElementById(kind + 'Change');
  changeEl.textContent = `${changeAmt >= 0 ? '+' : ''}${fmtMoney(changeAmt)} today (${weightedPct >= 0 ? '+' : ''}${weightedPct.toFixed(1)}%)`;
  changeEl.className = 'portfolio-change ' + (changeAmt < 0 ? 'negative' : '');

  const list = document.getElementById(kind + 'List');
  list.innerHTML = holdings.map(h => `
    <div class="holding-row">
      <div class="holding-icon">${h.symbol.slice(0, 3)}</div>
      <div class="holding-mid">
        <div class="holding-name">${escapeHtml(h.name)}</div>
        <div class="holding-sub">${h.symbol}</div>
      </div>
      <div class="holding-right">
        <div class="holding-value">${fmtMoney(h.value)}</div>
        <div class="holding-pct ${h.pct >= 0 ? 'positive' : 'negative'}">${h.pct >= 0 ? '+' : ''}${h.pct.toFixed(1)}%</div>
      </div>
    </div>`).join('');
}

/* ==========================================================================
   Home hero interactions — search, accounts, promo, quick actions
   ========================================================================== */
document.getElementById('searchPillBtn').addEventListener('click', () => toast('Search is not available in this prototype'));
document.getElementById('accountsPillBtn').addEventListener('click', () => toast('Only one demo account is available in this prototype'));
document.getElementById('promoCloseBtn').addEventListener('click', () => {
  document.getElementById('promoCard').classList.add('dismissed');
});

document.getElementById('qaMove').addEventListener('click', () => {
  openActionSheet('Move money', [
    { label: 'Send to a recipient', sub: 'Pay a friend or contact', onSelect: () => nav('payments') },
    { label: 'Currency exchange', sub: 'Convert between currencies', onSelect: () => nav('exchange') }
  ]);
});

document.getElementById('qaMore').addEventListener('click', () => {
  openActionSheet('More', [
    { label: 'Cards', sub: 'Manage your virtual and physical cards', onSelect: () => nav('cards') },
    { label: 'Analytics', sub: 'See your spending breakdown', onSelect: () => nav('analytics') },
    { label: 'Request money', sub: 'Share a payment request link', onSelect: () => toast('Payment request link copied') }
  ]);
});

document.getElementById('qaDetails').addEventListener('click', () => {
  openDetailsSheet();
});

/* ==========================================================================
   Profile
   ========================================================================== */
function renderProfile() {
  document.getElementById('avatarLg').textContent = initials(state.user.name);
  document.getElementById('profileName').textContent = state.user.name;
  document.getElementById('profileAccount').textContent = `Account •••• ${state.user.account}`;
}
document.querySelectorAll('[data-settings]').forEach(row => {
  row.addEventListener('click', () => toast('This is a demo prototype — nothing to configure here yet'));
});

/* ==========================================================================
   Admin panel
   ========================================================================== */
function renderAdmin() {
  document.getElementById('admName').value = state.user.name;
  document.getElementById('admAccount').value = state.user.account;
  document.getElementById('admCurrency').value = state.user.currency;
  document.getElementById('admAvailBalance').value = state.balances.available;
  document.getElementById('admSavings').value = state.balances.savings;
  document.getElementById('admCardLimit').value = state.card.limit;
  document.getElementById('admCardStatus').value = state.card.status;
  renderAdminTxList();
}

function renderAdminTxList() {
  const list = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const container = document.getElementById('admTxList');
  container.innerHTML = list.map(tx => `
    <div class="admin-tx-card" data-atx="${tx.id}">
      <div class="admin-tx-head">
        <span>${escapeHtml(tx.name)}</span>
        <button class="admin-tx-remove" data-remove="${tx.id}">Remove</button>
      </div>
      <div class="admin-grid2">
        <div class="admin-field"><label>Name</label><input type="text" class="text-input atx-name" value="${escapeHtml(tx.name)}"></div>
        <div class="admin-field"><label>Amount</label><input type="number" step="0.01" class="text-input atx-amount" value="${tx.amount}"></div>
        <div class="admin-field"><label>Category</label>
          <select class="text-input atx-category">
            ${Object.keys(CATEGORY_ICONS).map(c => `<option value="${c}" ${c === tx.category ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="admin-field"><label>Date</label><input type="datetime-local" class="text-input date-input atx-date" value="${tx.date.slice(0,16)}"></div>
      </div>
    </div>`).join('');

  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.transactions = state.transactions.filter(t => t.id !== btn.dataset.remove);
      renderAdminTxList();
    });
  });
}

document.getElementById('admAddTxBtn').addEventListener('click', () => {
  state.transactions.push({
    id: genId(), name: 'New transaction', category: 'Other', amount: -10,
    date: new Date().toISOString(), reference: genRef(), method: 'Manual entry'
  });
  renderAdminTxList();
});

document.getElementById('admSaveBtn').addEventListener('click', () => {
  state.user.name = document.getElementById('admName').value.trim() || state.user.name;
  state.user.account = document.getElementById('admAccount').value.trim() || state.user.account;
  state.user.currency = document.getElementById('admCurrency').value;
  state.balances.available = parseFloat(document.getElementById('admAvailBalance').value) || 0;
  state.balances.savings = parseFloat(document.getElementById('admSavings').value) || 0;
  state.card.limit = parseFloat(document.getElementById('admCardLimit').value) || 0;
  state.card.status = document.getElementById('admCardStatus').value;

  document.querySelectorAll('.admin-tx-card').forEach(card => {
    const id = card.dataset.atx;
    const tx = state.transactions.find(t => t.id === id);
    if (!tx) return;
    tx.name = card.querySelector('.atx-name').value.trim() || tx.name;
    tx.amount = parseFloat(card.querySelector('.atx-amount').value) || 0;
    tx.category = card.querySelector('.atx-category').value;
    const dateVal = card.querySelector('.atx-date').value;
    if (dateVal) tx.date = new Date(dateVal).toISOString();
  });

  saveState();
  toast('Demo data saved', 'success');
  renderAdmin();
});

document.getElementById('admRestoreBtn').addEventListener('click', () => {
  showModal({
    title: 'Restore default data?',
    body: 'This replaces all current demo data with the original sample dataset.',
    confirmLabel: 'Restore',
    danger: false,
    onConfirm: () => {
      state = defaultData();
      saveState();
      toast('Default data restored', 'success');
      renderAdmin();
    }
  });
});

document.getElementById('admResetBtn').addEventListener('click', () => {
  showModal({
    title: 'Reset demo data?',
    body: 'This clears all balances and transactions back to zero. This cannot be undone.',
    confirmLabel: 'Reset',
    onConfirm: () => {
      state = {
        user: { name: state.user.name, account: state.user.account, currency: state.user.currency },
        balances: { available: 0, savings: 0 },
        card: { ...state.card, status: 'active' },
        transactions: []
      };
      saveState();
      toast('Demo data reset', 'success');
      renderAdmin();
    }
  });
});

/* ==========================================================================
   Init
   ========================================================================== */
nav('home');
