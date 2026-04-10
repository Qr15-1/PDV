// src/scripts/auth-ui.js
import { authService } from '../services/authService.js';
import { fetchMetricasDesdeSupabase } from '../services/resumenService.js';

export async function runAuthCheck() {
  const { data } = await authService.getSession();
  const isLoginPage = window.location.pathname === '/login';

  if (!data.session && !isLoginPage) {
    window.location.href = '/login';
    return;
  } else if (data.session && isLoginPage) {
    window.location.href = '/';
    return;
  }

  if (data.session) {
    updateGlobalUI(data.session.user);
    initSedeSelector(data.session.user);
    // Cargar métricas reales desde Supabase (client-side)
    await loadMetricsUI();
  }
}

// ── Cargar métricas del dashboard en el cliente ────────────────────────────
async function loadMetricsUI() {
  try {
    const data = await fetchMetricasDesdeSupabase();
    if (!data || !data.metricas) return;

    const m = data.metricas;

    // Actualizar tarjetas de métricas si existen en el DOM
    const formatCurrency = (v) => v != null ? `$${v.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—';
    const formatPct = (v) => v != null ? `${v}%` : '—';

    // Buscar elementos .metric-value y actualizarlos
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
      const label = card.querySelector('.metric-label')?.textContent?.toLowerCase() || '';
      const valueEl = card.querySelector('.metric-value');
      if (!valueEl) return;

      if (label.includes('ventas del mes') || label.includes('ventas'))      valueEl.textContent = formatCurrency(m.ventas_mes);
      else if (label.includes('costo'))     valueEl.textContent = formatPct(m.costo_producto);
      else if (label.includes('ticket'))    valueEl.textContent = formatCurrency(m.ticket_promedio);
      else if (label.includes('pickup'))    valueEl.textContent = formatCurrency(m.venta_pickup);
      else if (label.includes('delivery'))  valueEl.textContent = formatCurrency(m.venta_delivery);
      else if (label.includes('mesa'))      valueEl.textContent = formatCurrency(m.venta_mesa);
      else if (label.includes('pizza'))     valueEl.textContent = m.pizza_mas_vendida || '—';
    });
  } catch (err) {
    console.error('[auth-ui] Error cargando métricas:', err);
  }
}

// ── Selector de Sedes ──────────────────────────────────────────────────────
export function initSedeSelector(user) {
  const containers = document.querySelectorAll('.sede-selector-container');
  if (containers.length === 0) return;

  if (user && user.sedes && user.sedes.length > 0) {
    const selectedSedeRaw = localStorage.getItem('pdv_selected_sede');
    let selectedSede = selectedSedeRaw ? JSON.parse(selectedSedeRaw) : user.sedes[0];

    containers.forEach(container => {
      container.style.display = 'flex';
      
      const display = container.querySelector('.selected-sede-name');
      const list = container.querySelector('.sede-options-list');
      const trigger = container.querySelector('.selector-trigger');

      if (display) display.textContent = selectedSede.nombre;

      if (list) {
        list.innerHTML = '';
        user.sedes.forEach(sede => {
          const isSelected = sede.id === selectedSede.id;
          const opt = document.createElement('div');
          opt.className = 'sede-option' + (isSelected ? ' selected' : '');
          opt.innerHTML = `
            <span>${sede.nombre}</span>
            <span class="sede-code">${sede.codigo}</span>
          `;
          opt.onclick = (e) => {
            e.stopPropagation();
            localStorage.setItem('pdv_selected_sede', JSON.stringify(sede));
            window.location.reload();
          };
          list.appendChild(opt);
        });
      }

      if (trigger) {
        trigger.onclick = (e) => {
          e.stopPropagation();
          container.classList.toggle('open');
        };
      }
    });

    document.addEventListener('click', () => {
       containers.forEach(c => c.classList.remove('open'));
    });
  } else {
    containers.forEach(c => c.style.display = 'none');
  }
}

// ── Actualizar nombre, saludo y fecha en toda la UI ────────────────────────
export function updateGlobalUI(user) {
  const nombre = user.nombre || 'Franquiciado';
  
  document.querySelectorAll('.username, .mobile-username').forEach(el => {
    el.textContent = nombre;
  });

  const hora = new Date().getHours();
  let saludo = "Buenas noches";
  if (hora >= 5 && hora < 12) saludo = "Buenos días";
  else if (hora >= 12 && hora < 19) saludo = "Buenas tardes";

  ['greeting-text', 'mkt-greeting', 'bib-greeting', 'com-greeting'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = `${saludo}, Franquiciado.`;
  });

  const fechaStr = `Hoy es ${new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  })}.`;
  ['date-text', 'mkt-date', 'bib-date', 'com-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = fechaStr;
  });
}

// ── Logout ─────────────────────────────────────────────────────────────────
export async function handleLogout() {
  await authService.logout();
  window.location.href = '/login';
}

export function attachLogoutListeners() {
  const logoutSelectors = [
    '#main-logout-btn', '#mobile-logout-btn', 
    '#mkt-logout-btn', '#bib-logout-btn', '#com-logout-btn',
    '.logout-btn'
  ];
  
  logoutSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
    });
  });
}
