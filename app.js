'use strict';

// ===== STATIC DATA =====

const TARGET_HOURS = 29;

// Planning data — week of 27 Apr 2026
// Each slot: { on: bool, start: 'HH:MM', end: 'HH:MM' }
// Boutique opens 09:00–12:30 (matin) and 15:30–19:00 (après-midi)
const PLANNING = {
  weekOffset: 0,
  slots: {
    lun: { label: 'Lun', livraison: false, matin: { on: false, start: '09:00', end: '12:30' }, apresmidi: { on: false, start: '15:30', end: '19:00' } },
    mar: { label: 'Mar', livraison: false, matin: { on: true,  start: '09:00', end: '12:30' }, apresmidi: { on: false, start: '15:30', end: '19:00' } },
    mer: { label: 'Mer', livraison: false, matin: { on: true,  start: '09:00', end: '12:30' }, apresmidi: { on: true,  start: '15:30', end: '17:00' } },
    jeu: { label: 'Jeu', livraison: true,  matin: { on: true,  start: '09:00', end: '12:30' }, apresmidi: { on: true,  start: '15:30', end: '19:00' } },
    ven: { label: 'Ven', livraison: false, matin: { on: true,  start: '09:00', end: '12:30' }, apresmidi: { on: false, start: '15:30', end: '19:00' } },
    sam: { label: 'Sam', livraison: false, matin: { on: true,  start: '09:00', end: '12:30' }, apresmidi: { on: true,  start: '15:30', end: '19:00' } },
    dim: { label: 'Dim', livraison: false, matin: { on: true,  start: '09:00', end: '12:00' }, apresmidi: { on: false, start: '15:30', end: '19:00' } },
  }
};

// Week start dates (Mon) for navigation
const WEEK_STARTS = [
  new Date(2026, 3, 27),  // offset 0 : 27 avr
  new Date(2026, 4,  4),  // offset 1 :  4 mai
  new Date(2026, 4, 11),  // offset 2 : 11 mai
];

const STOCKS = [
  { id:1,  ref:'FR-001', nom:'Comté 24 mois',             cat:'Fromages',    stock:4.2,  seuil:2,   unite:'kg',       prixAchat:18.50, prixVente:28.90 },
  { id:2,  ref:'FR-002', nom:'Camembert de Normandie AOP',cat:'Fromages',    stock:12,   seuil:5,   unite:'pièce',    prixAchat:4.20,  prixVente:7.50  },
  { id:3,  ref:'FR-003', nom:'Roquefort AOP',             cat:'Fromages',    stock:1.8,  seuil:1.5, unite:'kg',       prixAchat:22.00, prixVente:38.00 },
  { id:4,  ref:'FR-004', nom:'Brie de Meaux AOP',         cat:'Fromages',    stock:2,    seuil:3,   unite:'pièce',    prixAchat:8.50,  prixVente:14.90 },
  { id:5,  ref:'FR-005', nom:'Chèvre frais',              cat:'Fromages',    stock:18,   seuil:8,   unite:'pièce',    prixAchat:2.10,  prixVente:4.20  },
  { id:6,  ref:'FR-006', nom:'Époisses AOP',              cat:'Fromages',    stock:0,    seuil:3,   unite:'pièce',    prixAchat:7.80,  prixVente:13.50 },
  { id:7,  ref:'FR-007', nom:'Munster AOP',               cat:'Fromages',    stock:3.5,  seuil:2,   unite:'kg',       prixAchat:14.00, prixVente:22.50 },
  { id:8,  ref:'FR-008', nom:'Reblochon fermier AOP',     cat:'Fromages',    stock:6,    seuil:4,   unite:'pièce',    prixAchat:6.40,  prixVente:11.20 },
  { id:9,  ref:'CH-001', nom:'Jambon de Bayonne IGP',     cat:'Charcuterie', stock:2.3,  seuil:1,   unite:'kg',       prixAchat:28.00, prixVente:45.00 },
  { id:10, ref:'CH-002', nom:'Saucisson sec pur porc',    cat:'Charcuterie', stock:8,    seuil:5,   unite:'pièce',    prixAchat:5.50,  prixVente:9.80  },
  { id:11, ref:'CH-003', nom:'Terrine maison canard',     cat:'Charcuterie', stock:4,    seuil:6,   unite:'pot',      prixAchat:6.20,  prixVente:11.50 },
  { id:12, ref:'EP-001', nom:'Confiture de figues',       cat:'Épicerie',    stock:14,   seuil:8,   unite:'pot',      prixAchat:2.30,  prixVente:4.50  },
  { id:13, ref:'EP-002', nom:'Miel de châtaignier',       cat:'Épicerie',    stock:6,    seuil:5,   unite:'pot',      prixAchat:8.50,  prixVente:14.90 },
  { id:14, ref:'EP-003', nom:'Vin rouge Côtes du Rhône',  cat:'Épicerie',    stock:0,    seuil:6,   unite:'bouteille',prixAchat:5.20,  prixVente:9.50  },
  { id:15, ref:'EP-004', nom:'Noix de Grenoble AOP',      cat:'Épicerie',    stock:3.2,  seuil:2,   unite:'kg',       prixAchat:9.00,  prixVente:16.00 },
  { id:16, ref:'EM-001', nom:'Boîtes plateau fromage M',  cat:'Emballages',  stock:45,   seuil:20,  unite:'pièce',    prixAchat:0.85,  prixVente:null  },
  { id:17, ref:'EM-002', nom:'Papier fromage kraft',      cat:'Emballages',  stock:8,    seuil:15,  unite:'rouleau',  prixAchat:12.00, prixVente:null  },
  { id:18, ref:'EM-003', nom:'Sacs papier kraft logo',    cat:'Emballages',  stock:120,  seuil:50,  unite:'pièce',    prixAchat:0.35,  prixVente:null  },
];

// Plateaux Maison Nola (noms réels du système C&C)
const CC_PRODUCTS = [
  'Sélection du mois',
  'Plateau de la semaine',
  'Apéro 2 pers',
  'Table 4/6 pers',
  'Table 6/8 pers',
];
const CC_FROMAGES = ['Mixte', 'B/C', 'Vache'];

const CC_ORDERS = [
  {
    id:'CC001', heure:'10:00', client:'Marie Dupont', tel:'06 12 34 56 78',
    statut: { preparer:true, pret:true, collecte:true }, montant:38.50,
    items:[ { nom:'Plateau de la semaine', fromage:'Mixte', qte:1, note:'' } ]
  },
  {
    id:'CC002', heure:'11:30', client:'Pierre Martin', tel:'06 98 76 54 32',
    statut: { preparer:true, pret:true, collecte:false }, montant:56.00,
    items:[ { nom:'Table 4/6 pers', fromage:'Vache', qte:1, note:'' } ]
  },
  {
    id:'CC003', heure:'12:00', client:'Lucie Bernard', tel:'07 11 22 33 44',
    statut: { preparer:true, pret:false, collecte:false }, montant:85.00,
    items:[ { nom:'Table 6/8 pers', fromage:'Mixte', qte:1, note:'⚠ Époisses en rupture — voir substitut' } ]
  },
  {
    id:'CC004', heure:'16:00', client:'Sophie Leclerc', tel:'06 55 44 33 22',
    statut: { preparer:false, pret:false, collecte:false }, montant:42.00,
    items:[ { nom:'Apéro 2 pers', fromage:'B/C', qte:2, note:'' } ]
  },
  {
    id:'CC005', heure:'17:30', client:'Jean-Paul Moreau', tel:'06 77 88 99 00',
    statut: { preparer:false, pret:false, collecte:false }, montant:67.50,
    items:[
      { nom:'Sélection du mois', fromage:'Vache', qte:1, note:'Bien affiné svp' },
      { nom:'Plateau de la semaine', fromage:'Mixte', qte:1, note:'' },
    ]
  },
];

// Historique — mélange caisse + C&C, quelques C&C payés en caisse (paieCaisse:true → ne pas compter 2x)
const HISTORIQUE = [
  { date:'2026-04-25', heure:'10:15', client:'Marie Dupont',      ref:'CC001', canal:'C&C',    detail:'Plateau découverte',           montant:38.50,  paiement:'CB en ligne', paieCaisse:false },
  { date:'2026-04-25', heure:'10:42', client:'—',                 ref:'C-0421',canal:'Caisse', detail:'Vente comptoir fromages',       montant:22.30,  paiement:'CB',          paieCaisse:false },
  { date:'2026-04-25', heure:'11:08', client:'—',                 ref:'C-0422',canal:'Caisse', detail:'Comté + Chèvre + Saucisson',    montant:31.80,  paiement:'Espèces',     paieCaisse:false },
  { date:'2026-04-25', heure:'11:30', client:'Pierre Martin',     ref:'CC002', canal:'C&C',    detail:'Assortiment AOP + Charcuterie', montant:56.00,  paiement:'CB caisse',   paieCaisse:true  },
  { date:'2026-04-25', heure:'11:32', client:'Pierre Martin',     ref:'C-0423',canal:'Caisse', detail:'Règlement C&C CC002',           montant:56.00,  paiement:'CB',          isCCPayment:true },
  { date:'2026-04-24', heure:'09:30', client:'—',                 ref:'C-0418',canal:'Caisse', detail:'Ouverture — ventes matin',      montant:47.60,  paiement:'Mixte',       paieCaisse:false },
  { date:'2026-04-24', heure:'16:15', client:'Claire Fontaine',   ref:'CC0-19',canal:'C&C',    detail:'Plateau fromages fin',          montant:62.00,  paiement:'CB en ligne', paieCaisse:false },
  { date:'2026-04-24', heure:'17:00', client:'—',                 ref:'C-0419',canal:'Caisse', detail:'Vente comptoir après-midi',     montant:34.20,  paiement:'CB',          paieCaisse:false },
  { date:'2026-04-23', heure:'10:05', client:'—',                 ref:'C-0414',canal:'Caisse', detail:'Plateau apéritif + vins',       montant:58.40,  paiement:'Espèces',     paieCaisse:false },
  { date:'2026-04-23', heure:'11:20', client:'Marc Leblanc',      ref:'CC017', canal:'C&C',    detail:'Commande séminaire',            montant:148.00, paiement:'Virement',    paieCaisse:false },
  { date:'2026-04-22', heure:'09:50', client:'—',                 ref:'C-0410',canal:'Caisse', detail:'Ventes matinée',                montant:29.70,  paiement:'CB',          paieCaisse:false },
  { date:'2026-04-22', heure:'16:30', client:'Isabelle Morin',    ref:'CC015', canal:'C&C',    detail:'Fromages AOP sélection',        montant:44.50,  paiement:'CB en ligne', paieCaisse:false },
  { date:'2026-04-19', heure:'10:30', client:'—',                 ref:'C-0405',canal:'Caisse', detail:'Ventes comptoir',               montant:38.90,  paiement:'Mixte',       paieCaisse:false },
  { date:'2026-04-18', heure:'11:00', client:'Thomas Girard',     ref:'CC011', canal:'C&C',    detail:'Plateau entreprise',            montant:92.00,  paiement:'CB caisse',   paieCaisse:true  },
  { date:'2026-04-18', heure:'11:05', client:'Thomas Girard',     ref:'C-0402',canal:'Caisse', detail:'Règlement C&C CC011',           montant:92.00,  paiement:'CB',          isCCPayment:true },
];

// ===== STATE =====
let currentPanel = 'planning';
let stockFilter = 'Tous';
let stockSearch = '';
let histoFilter = 'semaine';
let stockData = STOCKS.map(s => ({ ...s }));
let ccOrders = CC_ORDERS.map(o => ({ ...o, statut: { ...o.statut } }));

// ===== UTILS =====
const fmt = n => typeof n === 'number' ? n.toFixed(2).replace('.', ',') + ' €' : '—';
const fmtH = h => {
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return mm ? `${hh}h${String(mm).padStart(2,'0')}` : `${hh}h`;
};
function timeToH(t) {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}
function slotDuration(slot) {
  if (!slot.on) return 0;
  return Math.max(0, timeToH(slot.end) - timeToH(slot.start));
}
function totalPlannedHours() {
  return Object.values(PLANNING.slots).reduce((acc, day) => {
    return acc + slotDuration(day.matin) + slotDuration(day.apresmidi);
  }, 0);
}

const DAY_KEYS = ['lun','mar','mer','jeu','ven','sam','dim'];
const DAY_OFFSETS = [0,1,2,3,4,5,6];

function weekDates(offset) {
  const base = WEEK_STARTS[Math.min(offset, WEEK_STARTS.length - 1)];
  return DAY_OFFSETS.map(d => {
    const dt = new Date(base);
    dt.setDate(base.getDate() + d);
    return dt;
  });
}
function fmtDate(d) {
  return d.toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
}
function fmtWeekRange(offset) {
  const dates = weekDates(offset);
  const opts = { day:'numeric', month:'short' };
  return `${dates[0].toLocaleDateString('fr-FR', opts)} – ${dates[6].toLocaleDateString('fr-FR', opts)} ${dates[0].getFullYear()}`;
}

// ===== NAVIGATION =====
function showPanel(name) {
  currentPanel = name;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.panel === name));
  document.querySelectorAll('.bn-item').forEach(n => n.classList.toggle('active', n.dataset.panel === name));
  const titles = { planning:'Planning', stocks:'Gestion des stocks', cc:'Click & Collect', historique:'Historique' };
  document.getElementById('topbar-title').textContent = titles[name];
  renderTopbarActions(name);
  renderPanel(name);
  // close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function renderTopbarActions(panel) {
  const el = document.getElementById('topbar-actions');
  if (panel === 'planning') {
    el.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openShareModal()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      Partager
    </button>`;
  } else if (panel === 'stocks') {
    el.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openAddStockModal()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Nouveau produit
    </button>`;
  } else if (panel === 'historique') {
    el.innerHTML = `<button class="btn btn-gold btn-sm" onclick="openExportModal()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export comptabilité
    </button>`;
  } else {
    el.innerHTML = '';
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

// ===== RENDER PANEL DISPATCH =====
function renderPanel(name) {
  const map = { planning: renderPlanning, stocks: renderStocks, cc: renderCC, historique: renderHistorique };
  if (map[name]) map[name]();
}

// ===== PLANNING =====
function renderPlanning() {
  const el = document.getElementById('panel-planning');
  const total = totalPlannedHours();
  const remaining = TARGET_HOURS - total;
  const pct = Math.min(100, (total / TARGET_HOURS) * 100);
  const fillClass = remaining < 0 ? 'over' : remaining === 0 ? 'ok' : '';
  const remainLabel = remaining < 0
    ? `${fmtH(Math.abs(remaining))} de trop`
    : remaining === 0
    ? '✓ Planning complet'
    : `${fmtH(remaining)} à affecter`;
  const remainClass = remaining < 0 ? 'over' : remaining === 0 ? 'ok' : '';

  const dates = weekDates(PLANNING.weekOffset);

  let rows = '';
  DAY_KEYS.forEach((key, i) => {
    const day = PLANNING.slots[key];
    const dTotal = slotDuration(day.matin) + slotDuration(day.apresmidi);
    const dateStr = fmtDate(dates[i]);
    const badgeHtml = day.livraison ? `<span class="day-badge livraison">🚚 Livraison</span>` : '';
    const badge = (!day.matin.on && !day.apresmidi.on) ? `<span class="day-badge">Repos</span>` : badgeHtml;

    rows += `<tr>
      <td>
        <div class="day-label">
          <span class="day-name">${day.label}</span>
          <span class="day-date">${dateStr}</span>
          ${badge}
        </div>
      </td>
      <td>${renderSlot(key, 'matin', day.matin, '09:00', '12:30')}</td>
      <td>${renderSlot(key, 'apresmidi', day.apresmidi, '15:30', '19:00')}</td>
      <td class="day-total ${dTotal === 0 ? 'zero' : ''}">${dTotal > 0 ? fmtH(dTotal) : '—'}</td>
    </tr>`;
  });

  el.innerHTML = `
    <div class="section-hd">
      <div>
        <h2>Planning semaine</h2>
        <div class="section-sub">Camille — 29h / semaine</div>
      </div>
      <div class="planning-nav">
        <button class="btn-icon" onclick="changeWeek(-1)" ${PLANNING.weekOffset===0?'disabled':''}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="planning-week-label">${fmtWeekRange(PLANNING.weekOffset)}</span>
        <button class="btn-icon" onclick="changeWeek(1)" ${PLANNING.weekOffset>=WEEK_STARTS.length-1?'disabled':''}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <div class="hours-bar-wrap">
      <div class="hours-bar-top">
        <span class="hours-bar-label">${fmtH(total)} / ${TARGET_HOURS}h planifiées</span>
        <span class="hours-bar-remaining ${remainClass}">${remainLabel}</span>
      </div>
      <div class="hours-bar-track">
        <div class="hours-bar-fill ${fillClass}" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="card" style="overflow-x:auto">
      <table class="planning-table">
        <thead>
          <tr>
            <th>Jour</th>
            <th>Matin &nbsp;<span style="font-weight:300;text-transform:none;letter-spacing:0;color:var(--faint)">09:00–12:30</span></th>
            <th>Après-midi &nbsp;<span style="font-weight:300;text-transform:none;letter-spacing:0;color:var(--faint)">15:30–19:00</span></th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderSlot(dayKey, period, slot, minTime, maxTime) {
  const dur = slotDuration(slot);
  const durStr = dur > 0 ? `<span class="slot-duration">${fmtH(dur)}</span>` : '';
  return `
    <div class="slot-block ${slot.on ? 'active' : 'inactive'}">
      <div class="slot-toggle ${slot.on ? 'on' : ''}" onclick="toggleSlot('${dayKey}','${period}')"></div>
      ${slot.on
        ? `<div class="slot-times">
            <input class="slot-time-input" type="time" value="${slot.start}" min="${minTime}" max="${slot.end}"
              onchange="updateSlotTime('${dayKey}','${period}','start',this.value)">
            <span class="slot-time-sep">–</span>
            <input class="slot-time-input" type="time" value="${slot.end}" min="${slot.start}" max="${maxTime}"
              onchange="updateSlotTime('${dayKey}','${period}','end',this.value)">
            ${durStr}
          </div>`
        : `<span class="slot-off">—</span>`}
    </div>`;
}

function toggleSlot(dayKey, period) {
  PLANNING.slots[dayKey][period].on = !PLANNING.slots[dayKey][period].on;
  renderPlanning();
}
function updateSlotTime(dayKey, period, field, value) {
  PLANNING.slots[dayKey][period][field] = value;
  renderPlanning();
}
function changeWeek(delta) {
  const next = PLANNING.weekOffset + delta;
  if (next >= 0 && next < WEEK_STARTS.length) {
    PLANNING.weekOffset = next;
    renderPlanning();
  }
}

// ===== SHARE MODAL =====
function openShareModal() {
  const dates = weekDates(PLANNING.weekOffset);
  let lines = [`📅 Planning semaine du ${fmtWeekRange(PLANNING.weekOffset)}`, ''];
  DAY_KEYS.forEach((key, i) => {
    const day = PLANNING.slots[key];
    const hasMatin = day.matin.on;
    const hasAM = day.apresmidi.on;
    if (!hasMatin && !hasAM) {
      lines.push(`${day.label} ${fmtDate(dates[i])} : repos`);
    } else {
      let parts = [];
      if (hasMatin) parts.push(`matin ${day.matin.start}–${day.matin.end}`);
      if (hasAM) parts.push(`après-midi ${day.apresmidi.start}–${day.apresmidi.end}`);
      lines.push(`${day.label} ${fmtDate(dates[i])} : ${parts.join(' | ')}${day.livraison ? ' 🚚' : ''}`);
    }
  });
  lines.push('', `Total : ${fmtH(totalPlannedHours())} / ${TARGET_HOURS}h`);
  lines.push('', 'Bonne semaine ! 🧀');
  const preview = lines.join('\n');
  openModal(`
    <div class="modal-hd">
      <h3>Partager le planning</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="margin-bottom:14px">
        <label>Destinataire</label>
        <input type="text" value="Camille — 06 87 65 43 21">
      </div>
      <div class="card-title">Aperçu du message</div>
      <div class="share-preview">${preview}</div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Annuler</button>
      <button class="btn btn-green" onclick="alert('Message envoyé ! (maquette)')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Envoyer par SMS
      </button>
    </div>`);
}

// ===== STOCKS =====
function renderStocks() {
  const cats = ['Tous', ...new Set(STOCKS.map(s => s.cat))];
  const filtered = stockData.filter(s => {
    const matchCat = stockFilter === 'Tous' || s.cat === stockFilter;
    const matchSearch = !stockSearch || s.nom.toLowerCase().includes(stockSearch.toLowerCase()) || s.ref.toLowerCase().includes(stockSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = stockData.length;
  const alerts = stockData.filter(s => s.stock > 0 && s.stock <= s.seuil).length;
  const ruptures = stockData.filter(s => s.stock === 0).length;
  const valeur = stockData.reduce((acc, s) => acc + (s.stock * (s.prixAchat || 0)), 0);

  let rows = filtered.map(s => {
    const statusClass = s.stock === 0 ? 'out' : s.stock <= s.seuil ? 'low' : 'ok';
    const statusLabel = s.stock === 0 ? 'Rupture' : s.stock <= s.seuil ? 'Stock bas' : 'OK';
    const pillClass = s.stock === 0 ? 'pill-red' : s.stock <= s.seuil ? 'pill-gold' : 'pill-green';
    const rowClass = s.stock === 0 ? 'row-alert' : s.stock <= s.seuil ? 'row-warn' : '';
    return `<tr class="${rowClass}">
      <td><strong>${s.nom}</strong><br><span style="font-size:10px;color:var(--faint)">${s.ref}</span></td>
      <td><span class="pill pill-brown">${s.cat}</span></td>
      <td>
        <div class="stock-qty-ctrl">
          <button class="qty-btn" onclick="adjustStock(${s.id},-1)">−</button>
          <input class="qty-val" type="number" value="${s.stock}" min="0" step="0.1"
            onchange="setStock(${s.id}, parseFloat(this.value))" style="width:54px">
          <button class="qty-btn" onclick="adjustStock(${s.id},1)">+</button>
          <span style="font-size:11px;color:var(--faint);margin-left:2px">${s.unite}</span>
        </div>
      </td>
      <td style="color:var(--faint);font-size:11px">${s.seuil} ${s.unite}</td>
      <td>${s.prixVente ? fmt(s.prixVente) : '<span style="color:var(--faint)">—</span>'}</td>
      <td><span class="pill ${pillClass}">${statusLabel}</span></td>
    </tr>`;
  }).join('');

  const el = document.getElementById('panel-stocks');
  el.innerHTML = `
    <div class="section-hd" style="margin-bottom:16px">
      <h2>Gestion des stocks</h2>
    </div>

    <div class="kpi-strip" style="margin-bottom:18px">
      <div class="kpi-card"><div class="kpi-label">Produits</div><div class="kpi-val">${total}</div><div class="kpi-sub">références actives</div></div>
      <div class="kpi-card"><div class="kpi-label">Alertes stock</div><div class="kpi-val" style="color:var(--gold)">${alerts}</div><div class="kpi-sub">sous le seuil</div></div>
      <div class="kpi-card red"><div class="kpi-label">Ruptures</div><div class="kpi-val" style="color:var(--red-soft)">${ruptures}</div><div class="kpi-sub">à commander</div></div>
      <div class="kpi-card green"><div class="kpi-label">Valeur stock</div><div class="kpi-val" style="font-size:1.4rem">${fmt(valeur)}</div><div class="kpi-sub">prix achat</div></div>
    </div>

    ${ruptures > 0 ? `<div class="alert-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${ruptures} produit${ruptures>1?'s':''} en rupture — penser à commander
    </div>` : ''}

    <div class="stock-filters">
      <input class="stock-search" type="search" placeholder="Rechercher un produit ou une référence…"
        value="${stockSearch}" oninput="stockSearch=this.value;renderStocks()">
      <div class="cat-tabs">
        ${cats.map(c => `<button class="cat-tab ${stockFilter===c?'active':''}" onclick="stockFilter='${c}';renderStocks()">${c}</button>`).join('')}
      </div>
    </div>

    <div class="card" style="overflow-x:auto;padding:0">
      <table class="tbl" style="padding:0">
        <thead>
          <tr style="background:var(--cream)">
            <th style="padding:12px 10px 10px 16px">Produit</th>
            <th>Catégorie</th>
            <th>Stock actuel</th>
            <th>Seuil alerte</th>
            <th>Prix vente</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody style="font-size:12px">
          ${rows || `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--muted)">Aucun produit trouvé</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function adjustStock(id, delta) {
  const item = stockData.find(s => s.id === id);
  if (item) { item.stock = Math.max(0, Math.round((item.stock + delta) * 10) / 10); renderStocks(); }
}
function setStock(id, val) {
  const item = stockData.find(s => s.id === id);
  if (item && !isNaN(val)) { item.stock = Math.max(0, val); }
}

function openAddStockModal() {
  const cats = [...new Set(STOCKS.map(s => s.cat))];
  openModal(`
    <div class="modal-hd">
      <h3>Nouveau produit</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="grid2">
        <div class="form-row"><label>Nom du produit</label><input type="text" placeholder="Ex: Comté 36 mois"></div>
        <div class="form-row"><label>Référence</label><input type="text" placeholder="Ex: FR-009"></div>
      </div>
      <div class="grid2">
        <div class="form-row"><label>Catégorie</label>
          <select>${cats.map(c => `<option>${c}</option>`).join('')}</select>
        </div>
        <div class="form-row"><label>Unité</label><input type="text" placeholder="kg, pièce, pot…"></div>
      </div>
      <div class="grid2">
        <div class="form-row"><label>Stock initial</label><input type="number" min="0" step="0.1" value="0"></div>
        <div class="form-row"><label>Seuil d'alerte</label><input type="number" min="0" step="0.1" value="5"></div>
      </div>
      <div class="grid2">
        <div class="form-row"><label>Prix achat HT (€)</label><input type="number" min="0" step="0.01"></div>
        <div class="form-row"><label>Prix vente TTC (€)</label><input type="number" min="0" step="0.01"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Annuler</button>
      <button class="btn btn-primary" onclick="alert('Produit ajouté ! (maquette)');closeModal()">Enregistrer</button>
    </div>`);
}

// ===== C&C =====
function renderCC() {
  const el = document.getElementById('panel-cc');
  const today = 'samedi 25 avril 2026';
  const sorted = [...ccOrders].sort((a, b) => a.heure.localeCompare(b.heure));

  const total = sorted.reduce((a, o) => a + o.montant, 0);
  const nbPreparer = sorted.filter(o => !o.statut.preparer).length;
  const nbPret     = sorted.filter(o => o.statut.preparer && !o.statut.pret).length;
  const nbCollecte = sorted.filter(o => o.statut.collecte).length;

  const tableRows = sorted.map(o => {
    const rowClass = o.statut.collecte ? 'cc-row-collecte' : '';
    const hasAlert = o.items.some(i => i.note && i.note.startsWith('⚠'));

    const itemsHtml = o.items.map(i => {
      const qteStr = i.qte > 1 ? `×${i.qte}` : '';
      const fromageTag = `<span class="cc-fromage-tag">${i.fromage}</span>`;
      const alertHtml = i.note && i.note.startsWith('⚠')
        ? `<span class="cc-item-alert">${i.note}</span>` : '';
      return `<div class="cc-item-line">${fromageTag}<span class="cc-item-name">${i.nom}</span><span class="cc-item-qte">${qteStr}</span>${alertHtml}</div>`;
    }).join('');

    const chk = (step, blocked) => `<td class="cc-step-col">
      <label class="cc-chk-wrap ${o.statut[step] ? 'checked' : ''} ${blocked ? 'blocked' : ''}">
        <input type="checkbox" class="cc-check" ${o.statut[step] ? 'checked' : ''} ${blocked ? 'disabled' : ''}
          onchange="toggleCCStep('${o.id}','${step}',this.checked)">
      </label>
    </td>`;

    return `<tr class="${rowClass} ${hasAlert ? 'cc-row-alert' : ''}">
      <td class="cc-heure-cell">
        <div class="cc-heure">${o.heure}</div>
        <div class="cc-tel">${o.tel}</div>
      </td>
      <td>
        <div class="cc-client">${o.client}</div>
        <div class="cc-montant">${fmt(o.montant)}</div>
      </td>
      <td class="cc-items-cell">${itemsHtml}</td>
      ${chk('preparer', false)}
      ${chk('pret',     !o.statut.preparer)}
      ${chk('collecte', !o.statut.pret)}
    </tr>`;
  }).join('');

  // Synthèse À préparer : agréger par plateau × type fromage (hors "collecté")
  const notCollected = sorted.filter(o => !o.statut.collecte);
  const synthese = CC_PRODUCTS.map(prodName => {
    const counts = { Mixte: 0, 'B/C': 0, Vache: 0 };
    notCollected.forEach(o => o.items.forEach(i => {
      if (i.nom === prodName) counts[i.fromage] = (counts[i.fromage] || 0) + (i.qte || 1);
    }));
    const total = counts.Mixte + counts['B/C'] + counts.Vache;
    return { prodName, ...counts, total };
  }).filter(r => r.total > 0);

  const syntheseRows = synthese.map(r => `<tr>
    <td><strong>${r.prodName}</strong></td>
    <td style="text-align:center">${r.Mixte  || '<span style="color:var(--faint)">—</span>'}</td>
    <td style="text-align:center">${r['B/C'] || '<span style="color:var(--faint)">—</span>'}</td>
    <td style="text-align:center">${r.Vache  || '<span style="color:var(--faint)">—</span>'}</td>
    <td style="text-align:center"><strong>${r.total}</strong></td>
  </tr>`).join('');

  el.innerHTML = `
    <div class="cc-day-header">
      <div class="cc-day-date">Commandes du jour — ${today}</div>
      <div class="cc-day-stats">
        <span class="cc-stat"><strong>${sorted.length}</strong> commandes</span>
        <span class="cc-stat"><strong>${fmt(total)}</strong> à encaisser</span>
        <span class="cc-stat"><span class="pill pill-terra">${nbPreparer} à préparer</span></span>
        <span class="cc-stat"><span class="pill pill-gold">${nbPret} en attente collecte</span></span>
        <span class="cc-stat"><span class="pill pill-green">${nbCollecte} collecté${nbCollecte>1?'s':''}</span></span>
      </div>
    </div>

    <div class="card" style="overflow-x:auto;padding:0;margin-bottom:20px">
      <table class="tbl cc-table">
        <thead>
          <tr style="background:var(--cream)">
            <th style="padding:12px 10px 10px 16px;width:72px">Heure</th>
            <th style="width:140px">Client</th>
            <th>Commande</th>
            <th class="cc-step-col cc-step-hd">À préparer</th>
            <th class="cc-step-col cc-step-hd">Prêt</th>
            <th class="cc-step-col cc-step-hd">Collecté</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>

    <div class="card" style="padding:0">
      <div style="padding:14px 16px 10px;border-bottom:1px solid var(--warm);display:flex;align-items:center;justify-content:space-between">
        <div class="card-title" style="margin:0">À préparer — Synthèse du jour</div>
        <span style="font-size:11px;color:var(--faint)">Hors commandes collectées</span>
      </div>
      ${synthese.length === 0
        ? `<p style="color:var(--muted);font-size:12px;text-align:center;padding:18px">Toutes les commandes ont été collectées ✓</p>`
        : `<div style="overflow-x:auto"><table class="tbl">
            <thead><tr>
              <th style="padding:10px 10px 8px 16px">Produit</th>
              <th style="text-align:center;width:80px">Mixte</th>
              <th style="text-align:center;width:80px">B/C</th>
              <th style="text-align:center;width:80px">Vache</th>
              <th style="text-align:center;width:80px">Total</th>
            </tr></thead>
            <tbody style="font-size:13px">${syntheseRows}</tbody>
          </table></div>`}
    </div>`;
}

function toggleCCStep(id, step, value) {
  const order = ccOrders.find(o => o.id === id);
  if (!order) return;
  if (step === 'preparer') { order.statut.preparer = value; if (!value) { order.statut.pret = false; order.statut.collecte = false; } }
  if (step === 'pret') { order.statut.pret = value; if (!value) order.statut.collecte = false; }
  if (step === 'collecte') order.statut.collecte = value;
  renderCC();
}

// ===== HISTORIQUE =====
function renderHistorique() {
  const el = document.getElementById('panel-historique');
  const today = '2026-04-25';

  function filterByPeriod(rows) {
    if (histoFilter === 'today') return rows.filter(r => r.date === today);
    if (histoFilter === 'semaine') {
      const cutoff = new Date('2026-04-20');
      return rows.filter(r => new Date(r.date) >= cutoff);
    }
    if (histoFilter === 'mois') return rows.filter(r => r.date.startsWith('2026-04'));
    return rows;
  }

  // Exclude C&C orders that were paid at the cash register (isCCPayment:true)
  // and flag C&C orders marked paieCaisse so we know their total is in caisse
  const canalRows = HISTORIQUE.filter(r => !r.isCCPayment);
  const filtered = filterByPeriod(canalRows);

  const caTotal = filtered.filter(r => r.canal === 'Caisse').reduce((a, r) => a + r.montant, 0);
  const ccTotal = filtered.filter(r => r.canal === 'C&C' && !r.paieCaisse).reduce((a, r) => a + r.montant, 0);
  const total = caTotal + ccTotal;
  const nb = filtered.length;

  const tableRows = filtered.map(r => {
    const canalClass = r.canal === 'Caisse' ? 'canal-caisse' : r.paieCaisse ? 'canal-both' : 'canal-cc';
    const canalLabel = r.canal === 'Caisse' ? 'Caisse' : r.paieCaisse ? 'C&C (payé caisse)' : 'C&C en ligne';
    const montantColor = r.paieCaisse ? 'var(--faint)' : 'var(--text)';
    const strikeStyle = r.paieCaisse ? 'text-decoration:line-through;' : '';
    return `<tr>
      <td style="white-space:nowrap">${r.date.slice(8)}&nbsp;avr&nbsp;—&nbsp;${r.heure}</td>
      <td>${r.client !== '—' ? `<strong>${r.client}</strong>` : '<span style="color:var(--faint)">—</span>'}</td>
      <td><span class="canal-badge ${canalClass}">${canalLabel}</span></td>
      <td style="font-size:11px;color:var(--muted)">${r.detail}</td>
      <td style="font-weight:700;${strikeStyle}color:${montantColor};white-space:nowrap">${fmt(r.montant)}</td>
      <td style="font-size:11px;color:var(--faint)">${r.paiement}</td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    <div class="section-hd">
      <h2>Historique des ventes</h2>
    </div>

    <div class="kpi-strip" style="margin-bottom:18px">
      <div class="kpi-card"><div class="kpi-label">CA total</div><div class="kpi-val" style="font-size:1.5rem">${fmt(total)}</div><div class="kpi-sub">caisse + C&C en ligne</div></div>
      <div class="kpi-card"><div class="kpi-label">CA caisse</div><div class="kpi-val" style="font-size:1.5rem">${fmt(caTotal)}</div><div class="kpi-sub">dont règlements C&C</div></div>
      <div class="kpi-card green"><div class="kpi-label">CA C&C en ligne</div><div class="kpi-val" style="font-size:1.5rem">${fmt(ccTotal)}</div><div class="kpi-sub">paiements online</div></div>
      <div class="kpi-card"><div class="kpi-label">Transactions</div><div class="kpi-val">${nb}</div><div class="kpi-sub">lignes comptables</div></div>
    </div>

    <div class="histo-filters">
      ${['today','semaine','mois','tout'].map(f => {
        const labels = { today:"Aujourd'hui", semaine:'Cette semaine', mois:'Ce mois', tout:'Tout' };
        return `<button class="histo-filter-btn ${histoFilter===f?'active':''}" onclick="histoFilter='${f}';renderHistorique()">${labels[f]}</button>`;
      }).join('')}
      <div class="histo-date-range">
        <input type="date" value="2026-04-01">
        <span style="color:var(--faint)">→</span>
        <input type="date" value="2026-04-25">
      </div>
    </div>

    <div style="margin-bottom:10px;font-size:11px;color:var(--muted)">
      Les lignes <em>C&C (payé caisse)</em> sont affichées à titre informatif mais <strong>non comptées dans le CA</strong> pour éviter les doublons.
    </div>

    <div class="card" style="overflow-x:auto;padding:0">
      <table class="tbl">
        <thead>
          <tr style="background:var(--cream)">
            <th style="padding:12px 10px 10px 16px">Date / Heure</th>
            <th>Client</th>
            <th>Canal</th>
            <th>Détail</th>
            <th>Montant TTC</th>
            <th>Paiement</th>
          </tr>
        </thead>
        <tbody style="font-size:12px">${tableRows}</tbody>
      </table>
    </div>`;
}

function openExportModal() {
  openModal(`
    <div class="modal-hd">
      <h3>Export comptabilité</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row"><label>Période</label>
        <select><option>Avril 2026</option><option>Mars 2026</option><option>T1 2026</option></select>
      </div>
      <div class="form-row"><label>Format</label>
        <select><option>CSV — Comptabilité générale (FEC)</option><option>Excel (.xlsx)</option><option>JSON</option></select>
      </div>
      <div class="form-row"><label>Adresse email du comptable</label>
        <input type="email" placeholder="comptable@cabinet.fr">
      </div>
      <div style="background:var(--cream);border:1px solid var(--border);border-radius:6px;padding:12px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:6px">
        <strong style="color:var(--brown-dk)">Contenu du fichier :</strong><br>
        ✓ Toutes les ventes caisse (journal VTE)<br>
        ✓ Commandes C&C payées en ligne (journal C&C)<br>
        ✗ Règlements C&C en caisse exclus (déjà comptés)<br>
        ✓ TVA ventilée par taux (5,5 % / 10 % / 20 %)<br>
        ✓ Numérotation séquentielle des pièces
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Annuler</button>
      <button class="btn btn-primary" onclick="alert('Fichier généré et envoyé au comptable ! (maquette)');closeModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Exporter &amp; envoyer
      </button>
    </div>`);
}

// ===== MODAL =====
function openModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').style.display = 'flex';
}
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').style.display = 'none';
  }
}

// ===== INIT =====
(function init() {
  // Sidebar date
  const now = new Date();
  document.getElementById('sf-date').textContent =
    now.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  renderTopbarActions('planning');
  renderPlanning();
})();
