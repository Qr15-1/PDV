// src/scripts/auth-ui.js
import { authService } from '../services/authService.js';

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
  }
}

export function initSedeSelector(user) {
  const containers = document.querySelectorAll('.sede-selector-container');
  if (containers.length === 0) return;

  if (user && user.sedes && user.sedes.length > 1) {
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

export function updateGlobalUI(user) {
  const nombre = user.nombre || 'Franquiciado';
  
  // Reemplazar todos los placeholders %username% y elementos con clase username
  document.querySelectorAll('.username, .mobile-username').forEach(el => {
    el.textContent = nombre;
    // Si el texto sigue siendo %username%, forzarlo
    if (el.innerText.includes('%username%')) {
      el.innerText = nombre;
    }
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
