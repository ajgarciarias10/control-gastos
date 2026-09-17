/**
 * Control de Gastos - Lógica Principal (Vanilla JS)
 * Modo 100% Local y Privado con Look Nativo PWA
 */

(() => {
  'use strict';

  // ==========================================
  // CONFIGURACIÓN DE CATEGORÍAS & CONCEPTOS
  // ==========================================
  const CATEGORIES = {
    mensual: {
      supermercado: { label: '🛒 Supermercado / Comida', icon: '🛒', chips: ['Mercadona', 'Carrefour', 'Lidl', 'Carnicería', 'Frutería'] },
      deporte: { label: '🏋️‍♂️ Deporte / Gimnasio', icon: '🏋️‍♂️', chips: ['Cuota Gimnasio', 'Pádel', 'Crossfit', 'Piscina'] },
      vivienda: { label: '🏠 Vivienda / Alquiler', icon: '🏠', chips: ['Alquiler', 'Comunidad', 'Hipoteca'] },
      servicios: { label: '💡 Facturas / Suministros', icon: '💡', chips: ['Luz', 'Agua', 'Internet / Fibra', 'Móvil'] },
      ocio: { label: '🍽️ Restaurantes / Ocio', icon: '🍽️', chips: ['Cena fuera', 'Café / Desayuno', 'Cine', 'Copas'] },
      transporte: { label: '🚗 Transporte / Gasolina', icon: '🚗', chips: ['Gasolina', 'Metro / Bus', 'Parking', 'Peaje'] },
      salud: { label: '💊 Farmacia / Salud', icon: '💊', chips: ['Farmacia', 'Dentista', 'Fisioterapeuta'] },
      otros: { label: '📦 Otros recurrentes', icon: '📦', chips: ['Varios', 'Limpieza', 'Lavandería'] }
    },
    superfluo: {
      deporte: { label: '🏋️‍♂️ Deporte / Suplementación', icon: '🏋️‍♂️', chips: ['Proteína Whey 2kg', 'Creatina Creapure', 'Zapatillas gym', 'Ropa entreno', 'Cinturón gym'] },
      caprichos: { label: '🛍️ Caprichos / Gustos', icon: '🛍️', chips: ['Perfume', 'Juego / Libro', 'Cena especial'] },
      ropa: { label: '👟 Ropa / Calzado', icon: '👟', chips: ['Zapatillas', 'Chaqueta', 'Camisetas', 'Pantalones'] },
      tecnologia: { label: '💻 Tecnología / Gadgets', icon: '💻', chips: ['Auriculares', 'Cargador', 'Smartwatch', 'Accesorio PC'] },
      viajes: { label: '✈️ Viajes / Escapadas', icon: '✈️', chips: ['Billetes / Vuelos', 'Hotel escapada', 'Entradas ocio'] },
      otros: { label: '📦 Otros puntuales', icon: '📦', chips: ['Mueble', 'Herramienta', 'Reparación'] }
    }
  };

  const STORAGE_KEY = 'gastos_app_data_v1';

  // ==========================================
  // ESTADO DE LA APLICACIÓN
  // ==========================================
  const now = new Date();
  const state = {
    currentTab: 'mensual',
    selectedYear: now.getFullYear(),
    selectedMonth: now.getMonth(), // 0 = Enero, 8 = Septiembre
    expenses: [],
    searchQuery: { mensual: '', superfluo: '' },
    categoryFilter: { mensual: 'todas', superfluo: 'todas' }
  };

  // ==========================================
  // ELEMENTOS DOM
  // ==========================================
  const dom = {
    btnOpenSettings: document.getElementById('btn-open-settings'),

    // Month navigation
    monthSelectorBar: document.getElementById('month-selector-bar'),
    currentMonthLabel: document.getElementById('current-month-label'),
    btnPrevMonth: document.getElementById('btn-prev-month'),
    btnNextMonth: document.getElementById('btn-next-month'),
    btnToday: document.getElementById('btn-today'),

    // Tabs
    tabMensual: document.getElementById('tab-mensual'),
    tabSuperfluo: document.getElementById('tab-superfluo'),
    tabStats: document.getElementById('tab-stats'),
    desktopNavTabs: document.querySelectorAll('.desktop-nav .nav-tab'),
    mobileNavTabs: document.querySelectorAll('.mobile-bottom-nav .bottom-nav-item'),

    // Cards Mensual
    totalMensualAmount: document.getElementById('total-mensual-amount'),
    totalMensualCount: document.getElementById('total-mensual-count'),
    mediaDiariaAmount: document.getElementById('media-diaria-amount'),
    diasTranscurridosLabel: document.getElementById('dias-transcurridos-label'),
    listaMensualContainer: document.getElementById('lista-mensual-container'),
    searchMensual: document.getElementById('search-mensual'),
    filterCatMensual: document.getElementById('filter-cat-mensual'),

    // Cards Superfluo
    totalSuperfluoAmount: document.getElementById('total-superfluo-amount'),
    totalSuperfluoCount: document.getElementById('total-superfluo-count'),
    amortizacionSuperfluoAmount: document.getElementById('amortizacion-superfluo-amount'),
    listaSuperfluoContainer: document.getElementById('lista-superfluo-container'),
    searchSuperfluo: document.getElementById('search-superfluo'),
    filterCatSuperfluo: document.getElementById('filter-cat-superfluo'),

    // Stats
    statsPctMensual: document.getElementById('stats-pct-mensual'),
    statsPctSuperfluo: document.getElementById('stats-pct-superfluo'),
    barMensual: document.getElementById('bar-mensual'),
    barSuperfluo: document.getElementById('bar-superfluo'),
    categoryBreakdownList: document.getElementById('category-breakdown-list'),
    monthlyHistoryBars: document.getElementById('monthly-history-bars'),

    // FAB & Modal Add
    btnFabAdd: document.getElementById('btn-fab-add'),
    modalAddExpense: document.getElementById('modal-add-expense'),
    modalTitle: document.getElementById('modal-title'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancelExpense: document.getElementById('btn-cancel-expense'),
    formExpense: document.getElementById('form-expense'),
    expenseId: document.getElementById('expense-id'),
    typeMensualRadio: document.getElementById('type-mensual'),
    typeSuperfluoRadio: document.getElementById('type-superfluo'),
    typeExplanation: document.getElementById('type-explanation'),
    expenseAmount: document.getElementById('expense-amount'),
    expenseConcept: document.getElementById('expense-concept'),
    quickConceptChips: document.getElementById('quick-concept-chips'),
    expenseCategory: document.getElementById('expense-category'),
    expenseDate: document.getElementById('expense-date'),
    expenseNotes: document.getElementById('expense-notes'),

    // Modal Settings
    modalSettings: document.getElementById('modal-settings'),
    btnCloseSettings: document.getElementById('btn-close-settings'),
    btnExportJson: document.getElementById('btn-export-json'),
    inputImportJson: document.getElementById('input-import-json'),
    btnLoadDemo: document.getElementById('btn-load-demo'),
    btnClearAll: document.getElementById('btn-clear-all'),
    pwaInstallContainer: document.getElementById('pwa-install-container'),
    btnInstallPwa: document.getElementById('btn-install-pwa')
  };

  // ==========================================
  // HELPERS
  // ==========================================
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getMonthName = (monthIdx, year) => {
    const date = new Date(year, monthIdx, 1);
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const formatDateDisplay = (dateString) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    
    const isToday = today.getFullYear() === y && today.getMonth() === (m - 1) && today.getDate() === d;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = yesterday.getFullYear() === y && yesterday.getMonth() === (m - 1) && yesterday.getDate() === d;

    if (isToday) return 'Hoy';
    if (isYesterday) return 'Ayer';

    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(12); } catch (_) {}
    }
  };

  // ==========================================
  // PERSISTENCIA LOCAL (OFFLINE-FIRST)
  // ==========================================
  const loadLocalExpenses = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        state.expenses = JSON.parse(raw);
      } else {
        state.expenses = [];
      }
    } catch (err) {
      console.error('Error leyendo LocalStorage:', err);
      state.expenses = [];
    }
  };

  const saveLocalExpenses = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expenses));
    } catch (err) {
      console.error('Error guardando en LocalStorage:', err);
    }
  };

  // ==========================================
  // RENDERIZADO PRINCIPAL
  // ==========================================
  const renderAll = () => {
    renderMonthHeader();
    renderMensualView();
    renderSuperfluoView();
    renderStatsView();
  };

  const renderMonthHeader = () => {
    dom.currentMonthLabel.textContent = getMonthName(state.selectedMonth, state.selectedYear);
    
    const isCurrentMonth = state.selectedYear === now.getFullYear() && state.selectedMonth === now.getMonth();
    dom.btnToday.style.display = isCurrentMonth ? 'none' : 'inline-block';
    dom.monthSelectorBar.style.display = state.currentTab === 'mensual' ? 'flex' : 'none';
  };

  // ---- TAB 1: GASTOS MENSUALES ----
  const renderMensualView = () => {
    const year = state.selectedYear;
    const month = state.selectedMonth;

    const monthExpenses = state.expenses.filter(exp => {
      if (exp.tipo !== 'mensual') return false;
      const [ey, em] = exp.fecha.split('-').map(Number);
      return ey === year && (em - 1) === month;
    });

    const query = state.searchQuery.mensual.toLowerCase().trim();
    const catFilter = state.categoryFilter.mensual;

    const filtered = monthExpenses.filter(exp => {
      const matchCat = catFilter === 'todas' || exp.categoria === catFilter;
      const matchQuery = !query || exp.concepto.toLowerCase().includes(query) || (exp.notas && exp.notas.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    filtered.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

    const total = monthExpenses.reduce((acc, curr) => acc + Number(curr.importe || 0), 0);
    dom.totalMensualAmount.textContent = formatCurrency(total);
    dom.totalMensualCount.textContent = `${monthExpenses.length} ${monthExpenses.length === 1 ? 'movimiento' : 'movimientos'}`;

    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysConsidered = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
    const media = total / daysConsidered;
    dom.mediaDiariaAmount.textContent = formatCurrency(media);
    dom.diasTranscurridosLabel.textContent = isCurrentMonth ? `en ${daysConsidered} días transcurridos` : `en los ${daysInMonth} días del mes`;

    if (filtered.length === 0) {
      dom.listaMensualContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <div class="empty-title">Sin gastos este mes</div>
          <div class="empty-text">Pulsa el botón <strong>+</strong> abajo para anotar tu primer gasto de ${getMonthName(month, year)}.</div>
        </div>
      `;
      return;
    }

    const groups = {};
    filtered.forEach(exp => {
      if (!groups[exp.fecha]) groups[exp.fecha] = [];
      groups[exp.fecha].push(exp);
    });

    let html = '';
    Object.keys(groups).sort((a, b) => b.localeCompare(a)).forEach(fecha => {
      const dayExpenses = groups[fecha];
      const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.importe), 0);

      html += `
        <div class="day-group">
          <div class="day-header">
            <span>${formatDateDisplay(fecha)}</span>
            <span class="day-total">${formatCurrency(dayTotal)}</span>
          </div>
          ${dayExpenses.map(exp => renderExpenseItem(exp)).join('')}
        </div>
      `;
    });

    dom.listaMensualContainer.innerHTML = html;
  };

  // ---- TAB 2: GASTOS SUPERFLUOS ----
  const renderSuperfluoView = () => {
    const superfluoExpenses = state.expenses.filter(exp => exp.tipo === 'superfluo');

    const query = state.searchQuery.superfluo.toLowerCase().trim();
    const catFilter = state.categoryFilter.superfluo;

    const filtered = superfluoExpenses.filter(exp => {
      const matchCat = catFilter === 'todas' || exp.categoria === catFilter;
      const matchQuery = !query || exp.concepto.toLowerCase().includes(query) || (exp.notas && exp.notas.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    filtered.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

    const total = superfluoExpenses.reduce((acc, curr) => acc + Number(curr.importe || 0), 0);
    dom.totalSuperfluoAmount.textContent = formatCurrency(total);
    dom.totalSuperfluoCount.textContent = `${superfluoExpenses.length} compras fuera de presupuesto mensual`;

    const amortizacion = total / 12;
    dom.amortizacionSuperfluoAmount.textContent = `${formatCurrency(amortizacion)} / mes`;

    if (filtered.length === 0) {
      dom.listaSuperfluoContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏋️‍♂️</div>
          <div class="empty-title">Sin gastos superfluos registrados</div>
          <div class="empty-text">Anota aquí compras como proteína, creatina, ropa o compras especiales que no pertenecen a tus gastos corrientes del mes.</div>
        </div>
      `;
      return;
    }

    let html = '';
    const groups = {};
    filtered.forEach(exp => {
      if (!groups[exp.fecha]) groups[exp.fecha] = [];
      groups[exp.fecha].push(exp);
    });

    Object.keys(groups).sort((a, b) => b.localeCompare(a)).forEach(fecha => {
      const dayExpenses = groups[fecha];
      const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.importe), 0);

      html += `
        <div class="day-group">
          <div class="day-header">
            <span>${formatDateDisplay(fecha)}</span>
            <span class="day-total">${formatCurrency(dayTotal)}</span>
          </div>
          ${dayExpenses.map(exp => renderExpenseItem(exp)).join('')}
        </div>
      `;
    });

    dom.listaSuperfluoContainer.innerHTML = html;
  };

  const renderExpenseItem = (exp) => {
    const catConfig = (CATEGORIES[exp.tipo] && CATEGORIES[exp.tipo][exp.categoria]) || { label: exp.categoria, icon: '💰' };
    const notesText = exp.notas ? `<span class="badge-pill">${escapeHTML(exp.notas)}</span>` : '';

    return `
      <div class="expense-item" data-id="${exp.id}">
        <div class="expense-left">
          <div class="expense-cat-icon">${catConfig.icon}</div>
          <div class="expense-info">
            <span class="expense-concept">${escapeHTML(exp.concepto)}</span>
            <div class="expense-meta">
              <span>${catConfig.label.split(' ')[1] || catConfig.label}</span>
              ${notesText}
            </div>
          </div>
        </div>
        <div class="expense-right">
          <span class="expense-amount">${formatCurrency(exp.importe)}</span>
          <button class="expense-delete-btn" onclick="window.GastosApp.confirmDelete('${exp.id}')" title="Eliminar gasto" aria-label="Eliminar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  };

  // ---- TAB 3: ESTADÍSTICAS & BALANCE ----
  const renderStatsView = () => {
    const totalMensual = state.expenses
      .filter(e => e.tipo === 'mensual')
      .reduce((sum, e) => sum + Number(e.importe), 0);
    
    const totalSuperfluo = state.expenses
      .filter(e => e.tipo === 'superfluo')
      .reduce((sum, e) => sum + Number(e.importe), 0);

    const totalGeneral = totalMensual + totalSuperfluo;
    const pctMensual = totalGeneral > 0 ? Math.round((totalMensual / totalGeneral) * 100) : 50;
    const pctSuperfluo = totalGeneral > 0 ? (100 - pctMensual) : 50;

    dom.statsPctMensual.textContent = `${pctMensual}% (${formatCurrency(totalMensual)})`;
    dom.statsPctSuperfluo.textContent = `${pctSuperfluo}% (${formatCurrency(totalSuperfluo)})`;
    dom.barMensual.style.width = `${pctMensual}%`;
    dom.barSuperfluo.style.width = `${pctSuperfluo}%`;

    const catTotals = {};
    state.expenses.forEach(e => {
      catTotals[e.categoria] = (catTotals[e.categoria] || 0) + Number(e.importe);
    });

    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const maxCat = sortedCats.length > 0 ? sortedCats[0][1] : 1;

    let catHtml = '';
    if (sortedCats.length === 0) {
      catHtml = '<div style="color:var(--text-muted); font-size:0.8rem;">Sin datos para mostrar categorías.</div>';
    } else {
      sortedCats.forEach(([catKey, sum]) => {
        let label = catKey;
        let icon = '🏷️';
        if (CATEGORIES.mensual[catKey]) {
          label = CATEGORIES.mensual[catKey].label;
          icon = CATEGORIES.mensual[catKey].icon;
        } else if (CATEGORIES.superfluo[catKey]) {
          label = CATEGORIES.superfluo[catKey].label;
          icon = CATEGORIES.superfluo[catKey].icon;
        }
        const pctWidth = Math.max(5, Math.round((sum / maxCat) * 100));

        catHtml += `
          <div class="cat-breakdown-item">
            <div class="cat-breakdown-header">
              <span>${icon} ${label}</span>
              <span>${formatCurrency(sum)}</span>
            </div>
            <div class="cat-breakdown-bar-track">
              <div class="cat-breakdown-bar-fill" style="width: ${pctWidth}%;"></div>
            </div>
          </div>
        `;
      });
    }
    dom.categoryBreakdownList.innerHTML = catHtml;

    renderMonthlyHistoryBars();
  };

  const renderMonthlyHistoryBars = () => {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleDateString('es-ES', { month: 'short' }).slice(0, 3)
      });
    }

    const monthTotals = months.map(m => {
      const total = state.expenses.reduce((sum, e) => {
        if (e.tipo !== 'mensual') return sum;
        const [ey, em] = e.fecha.split('-').map(Number);
        if (ey === m.year && (em - 1) === m.month) {
          return sum + Number(e.importe);
        }
        return sum;
      }, 0);
      return { ...m, total };
    });

    const maxMonthTotal = Math.max(1, ...monthTotals.map(m => m.total));

    let barsHtml = '';
    monthTotals.forEach(m => {
      const heightPct = Math.max(8, Math.round((m.total / maxMonthTotal) * 100));
      const isCurrent = m.year === today.getFullYear() && m.month === today.getMonth();
      barsHtml += `
        <div class="history-column ${isCurrent ? 'current' : ''}">
          <div style="font-size:0.68rem; font-weight:600; color:var(--text-muted);">${m.total > 0 ? Math.round(m.total) + '€' : ''}</div>
          <div class="history-bar-container">
            <div class="history-bar-inner" style="height: ${heightPct}%;"></div>
          </div>
          <div class="history-label">${m.label}</div>
        </div>
      `;
    });

    dom.monthlyHistoryBars.innerHTML = barsHtml;
  };

  const escapeHTML = (str) => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  // ==========================================
  // MANEJO DE PESTAÑAS (TABS)
  // ==========================================
  const setTab = (tabName) => {
    triggerHaptic();
    state.currentTab = tabName;

    dom.desktopNavTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    dom.mobileNavTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    dom.tabMensual.classList.toggle('active', tabName === 'mensual');
    dom.tabSuperfluo.classList.toggle('active', tabName === 'superfluo');
    dom.tabStats.classList.toggle('active', tabName === 'stats');

    renderMonthHeader();

    if (tabName === 'stats') {
      renderStatsView();
    }
  };

  // ==========================================
  // MODAL AÑADIR GASTO
  // ==========================================
  const updateCategorySelectAndChips = (tipo) => {
    const catGroup = CATEGORIES[tipo];
    let selectHtml = '';
    let chipsHtml = '';

    Object.entries(catGroup).forEach(([key, cfg]) => {
      selectHtml += `<option value="${key}">${cfg.label}</option>`;
      cfg.chips.slice(0, 2).forEach(chipText => {
        chipsHtml += `<button type="button" class="quick-chip" onclick="window.GastosApp.pickChip('${escapeHTML(chipText)}', '${key}')">${chipText}</button>`;
      });
    });

    dom.expenseCategory.innerHTML = selectHtml;
    dom.quickConceptChips.innerHTML = chipsHtml;

    if (tipo === 'mensual') {
      dom.typeExplanation.textContent = 'Gasto recurrente habitual que computa en el mes actual.';
    } else {
      dom.typeExplanation.textContent = 'Gasto no periódico (proteína, zapatillas, caprichos) para no alterar tus cuentas del mes.';
    }
  };

  const openExpenseModal = (existing = null) => {
    triggerHaptic();
    dom.formExpense.reset();

    if (existing) {
      dom.modalTitle.textContent = 'Editar Gasto';
      dom.expenseId.value = existing.id;
      dom.expenseAmount.value = existing.importe;
      dom.expenseConcept.value = existing.concepto;
      dom.expenseDate.value = existing.fecha;
      dom.expenseNotes.value = existing.notas || '';

      if (existing.tipo === 'superfluo') {
        dom.typeSuperfluoRadio.checked = true;
      } else {
        dom.typeMensualRadio.checked = true;
      }
      updateCategorySelectAndChips(existing.tipo);
      dom.expenseCategory.value = existing.categoria;
    } else {
      dom.modalTitle.textContent = 'Nuevo Gasto';
      dom.expenseId.value = '';

      if (state.currentTab === 'superfluo') {
        dom.typeSuperfluoRadio.checked = true;
        updateCategorySelectAndChips('superfluo');
      } else {
        dom.typeMensualRadio.checked = true;
        updateCategorySelectAndChips('mensual');
      }

      const todayIso = new Date().toISOString().split('T')[0];
      dom.expenseDate.value = todayIso;
    }

    dom.modalAddExpense.classList.remove('hidden');
    setTimeout(() => dom.expenseAmount.focus(), 150);
  };

  const closeExpenseModal = () => {
    dom.modalAddExpense.classList.add('hidden');
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    triggerHaptic();

    const id = dom.expenseId.value || crypto.randomUUID();
    const tipo = dom.typeSuperfluoRadio.checked ? 'superfluo' : 'mensual';
    const importe = parseFloat(dom.expenseAmount.value);
    const concepto = dom.expenseConcept.value.trim();
    const categoria = dom.expenseCategory.value;
    const fecha = dom.expenseDate.value;
    const notas = dom.expenseNotes.value.trim();

    if (!concepto || isNaN(importe) || importe <= 0 || !fecha) {
      alert('Por favor, completa todos los campos requeridos con un importe válido.');
      return;
    }

    const expenseObj = {
      id,
      concepto,
      importe,
      tipo,
      categoria,
      fecha,
      notas,
      actualizado_en: new Date().toISOString()
    };

    const existingIndex = state.expenses.findIndex(x => x.id === id);
    if (existingIndex >= 0) {
      state.expenses[existingIndex] = expenseObj;
    } else {
      expenseObj.creado_en = new Date().toISOString();
      state.expenses.unshift(expenseObj);
    }

    saveLocalExpenses();
    renderAll();
    closeExpenseModal();
  };

  const confirmDeleteExpense = (id) => {
    triggerHaptic();
    const exp = state.expenses.find(x => x.id === id);
    if (!exp) return;

    if (confirm(`¿Eliminar el gasto "${exp.concepto}" (${formatCurrency(exp.importe)})?`)) {
      state.expenses = state.expenses.filter(x => x.id !== id);
      saveLocalExpenses();
      renderAll();
    }
  };

  // ==========================================
  // AJUSTES, BACKUPS Y PWA
  // ==========================================
  const exportToJson = () => {
    triggerHaptic();
    const dataStr = JSON.stringify(state.expenses, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gastos_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJson = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          state.expenses = imported;
          saveLocalExpenses();
          renderAll();
          alert(`Copia restaurada correctamente (${imported.length} gastos cargados).`);
        } else {
          alert('El archivo no tiene el formato de copia de gastos válido.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const loadDemoData = () => {
    triggerHaptic();
    if (state.expenses.length > 0 && !confirm('¿Deseas añadir los datos de ejemplo a tu lista actual?')) {
      return;
    }

    const y = state.selectedYear;
    const m = String(state.selectedMonth + 1).padStart(2, '0');

    const demoItems = [
      // Mensuales habituales (incluyendo deporte / gimnasio)
      { id: crypto.randomUUID(), concepto: 'Cuota Gimnasio mensual', importe: 34.90, tipo: 'mensual', categoria: 'deporte', fecha: `${y}-${m}-01`, notas: 'Gimnasio Fitness' },
      { id: crypto.randomUUID(), concepto: 'Compra Mercadona semana', importe: 78.45, tipo: 'mensual', categoria: 'supermercado', fecha: `${y}-${m}-04`, notas: 'Comida fresca y verdura' },
      { id: crypto.randomUUID(), concepto: 'Alquiler piso', importe: 650.00, tipo: 'mensual', categoria: 'vivienda', fecha: `${y}-${m}-01`, notas: 'Transferencia mensual' },
      { id: crypto.randomUUID(), concepto: 'Fibra + Móvil', importe: 39.90, tipo: 'mensual', categoria: 'servicios', fecha: `${y}-${m}-05`, notas: 'Factura mensual' },
      { id: crypto.randomUUID(), concepto: 'Gasolina Repsol', importe: 55.00, tipo: 'mensual', categoria: 'transporte', fecha: `${y}-${m}-08`, notas: 'Depósito lleno' },
      { id: crypto.randomUUID(), concepto: 'Cena pizzería amigos', importe: 24.50, tipo: 'mensual', categoria: 'ocio', fecha: `${y}-${m}-12`, notas: 'Salida viernes' },

      // Superfluos / No mensuales (Proteína, creatina, zapatillas gym, gadgets)
      { id: crypto.randomUUID(), concepto: 'Proteína Whey Isolate 2kg HSN', importe: 54.90, tipo: 'superfluo', categoria: 'deporte', fecha: `${y}-${m}-02`, notas: 'Sabor chocolate, dura 2 meses' },
      { id: crypto.randomUUID(), concepto: 'Creatina Creapure 500g', importe: 26.50, tipo: 'superfluo', categoria: 'deporte', fecha: `${y}-${m}-02`, notas: 'Dura 3 meses' },
      { id: crypto.randomUUID(), concepto: 'Zapatillas entrenamiento gym', importe: 75.00, tipo: 'superfluo', categoria: 'ropa', fecha: `${y}-${m}-10`, notas: 'Oferta Nike' }
    ];

    state.expenses = [...demoItems, ...state.expenses];
    saveLocalExpenses();
    renderAll();
    alert('¡Datos de ejemplo cargados con éxito!');
  };

  const clearAllData = () => {
    triggerHaptic();
    if (confirm('¿Estás seguro de que quieres borrar TODOS los gastos? Esta acción no se puede deshacer.')) {
      state.expenses = [];
      saveLocalExpenses();
      renderAll();
      alert('Se han borrado todos los gastos locales.');
    }
  };

  // ==========================================
  // EVENT LISTENERS & INICIALIZACIÓN
  // ==========================================
  const setupEventListeners = () => {
    // Navegación de mes
    dom.btnPrevMonth.addEventListener('click', () => {
      triggerHaptic();
      state.selectedMonth--;
      if (state.selectedMonth < 0) {
        state.selectedMonth = 11;
        state.selectedYear--;
      }
      renderAll();
    });

    dom.btnNextMonth.addEventListener('click', () => {
      triggerHaptic();
      state.selectedMonth++;
      if (state.selectedMonth > 11) {
        state.selectedMonth = 0;
        state.selectedYear++;
      }
      renderAll();
    });

    dom.btnToday.addEventListener('click', () => {
      triggerHaptic();
      state.selectedYear = now.getFullYear();
      state.selectedMonth = now.getMonth();
      renderAll();
    });

    // Pestañas Desktop
    dom.desktopNavTabs.forEach(btn => {
      btn.addEventListener('click', () => setTab(btn.dataset.tab));
    });

    // Pestañas Mobile
    dom.mobileNavTabs.forEach(btn => {
      btn.addEventListener('click', () => setTab(btn.dataset.tab));
    });

    // FAB
    dom.btnFabAdd.addEventListener('click', () => openExpenseModal());

    // Modal Add Expense
    dom.btnCloseModal.addEventListener('click', closeExpenseModal);
    dom.btnCancelExpense.addEventListener('click', closeExpenseModal);
    dom.formExpense.addEventListener('submit', handleSaveExpense);

    // Toggle tipo en modal
    dom.typeMensualRadio.addEventListener('change', () => updateCategorySelectAndChips('mensual'));
    dom.typeSuperfluoRadio.addEventListener('change', () => updateCategorySelectAndChips('superfluo'));

    // Clic fuera del modal para cerrar
    dom.modalAddExpense.addEventListener('click', (e) => {
      if (e.target === dom.modalAddExpense) closeExpenseModal();
    });

    // Modal Settings
    dom.btnOpenSettings.addEventListener('click', () => {
      triggerHaptic();
      dom.modalSettings.classList.remove('hidden');
    });
    dom.btnCloseSettings.addEventListener('click', () => {
      dom.modalSettings.classList.add('hidden');
    });
    dom.modalSettings.addEventListener('click', (e) => {
      if (e.target === dom.modalSettings) dom.modalSettings.classList.add('hidden');
    });

    // Copias de seguridad
    dom.btnExportJson.addEventListener('click', exportToJson);
    dom.inputImportJson.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importFromJson(e.target.files[0]);
      }
    });
    dom.btnLoadDemo.addEventListener('click', loadDemoData);
    dom.btnClearAll.addEventListener('click', clearAllData);

    // Búsqueda y filtros
    dom.searchMensual.addEventListener('input', (e) => {
      state.searchQuery.mensual = e.target.value;
      renderMensualView();
    });
    dom.filterCatMensual.addEventListener('change', (e) => {
      state.categoryFilter.mensual = e.target.value;
      renderMensualView();
    });
    dom.searchSuperfluo.addEventListener('input', (e) => {
      state.searchQuery.superfluo = e.target.value;
      renderSuperfluoView();
    });
    dom.filterCatSuperfluo.addEventListener('change', (e) => {
      state.categoryFilter.superfluo = e.target.value;
      renderSuperfluoView();
    });
  };

  // Métodos globales
  window.GastosApp = {
    confirmDelete: confirmDeleteExpense,
    pickChip: (text, catKey) => {
      dom.expenseConcept.value = text;
      dom.expenseCategory.value = catKey;
      triggerHaptic();
      dom.expenseAmount.focus();
    }
  };

  // PWA Install Banner
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    dom.pwaInstallContainer.classList.remove('hidden');
  });

  dom.btnInstallPwa.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        dom.pwaInstallContainer.classList.add('hidden');
      }
      deferredPrompt = null;
    }
  });

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registrado correctamente'))
        .catch((err) => console.warn('No se pudo registrar Service Worker:', err));
    }
  };

  const init = () => {
    loadLocalExpenses();
    setupEventListeners();
    updateCategorySelectAndChips('mensual');
    renderAll();
    registerServiceWorker();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
