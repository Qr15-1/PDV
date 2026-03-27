// src/services/authService.js

/**
 * MOCK AUTH SERVICE
 * This will be replaced by Supabase integration once credentials are provided.
 */

const MOCK_USER = {
  id: 'user-123',
  email: 'franquiciado@pizzadeverdad.com',
  nombre: 'Roger Gómez',
  rol: 'franquiciado',
  sedes: [
    { id: 'sede-1', nombre: 'PDV Las Mercedes', codigo: '0001-Anz' },
    { id: 'sede-2', nombre: 'PDV Chacao', codigo: '0002-Ccs' }
  ]
};

export const authService = {
  async login(email, password) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === 'test@pizza.com' && password === 'pizza123') {
      const session = {
        user: MOCK_USER,
        expires_at: Date.now() + 3600000 // 1 hora
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('pdv_session', JSON.stringify(session));
      }
      return { data: { user: MOCK_USER }, error: null };
    }

    return { data: null, error: { message: 'Credenciales inválidas' } };
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pdv_session');
      localStorage.removeItem('pdv_selected_sede');
    }
    return { error: null };
  },

  async getSession() {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('pdv_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.expires_at > Date.now()) {
          return { data: { session: parsed }, error: null };
        }
        localStorage.removeItem('pdv_session');
      }
    }
    return { data: { session: null }, error: null };
  },

  async getSelectedSede() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pdv_selected_sede');
      if (saved) return JSON.parse(saved);
      
      const { data } = await this.getSession();
      if (data.session && data.session.user.sedes.length > 0) {
        return data.session.user.sedes[0];
      }
    }
    return null;
  },

  setSelectedSede(sede) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pdv_selected_sede', JSON.stringify(sede));
    }
  }
};
