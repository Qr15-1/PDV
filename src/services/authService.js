// src/services/authService.js
import { supabase } from '../lib/supabase.js';

export const authService = {

  // ── Login con Supabase Auth ──────────────────────────────────────────────
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { data: null, error };

    const userId = data.user.id;

    // Obtener perfil del usuario (nombre, rol)
    const { data: perfil } = await supabase
      .from('usuarios')
      .select('usuario, rol')
      .eq('id', userId)
      .single();

    // Obtener IDs de sedes asignadas al usuario
    const { data: pivotRows } = await supabase
      .from('usuarios_sedes')
      .select('sede_id')
      .eq('usuario_id', userId);

    // Cargar detalles de cada sede
    let sedes = [];
    if (pivotRows && pivotRows.length > 0) {
      const sedeIds = pivotRows.map(r => r.sede_id);
      const { data: sedesData } = await supabase
        .from('sedes')
        .select('id, nombre, codigo')
        .in('id', sedeIds);
      sedes = sedesData || [];
    }

    const userProfile = {
      id:     data.user.id,
      email:  data.user.email,
      nombre: perfil?.usuario || data.user.email,
      rol:    perfil?.rol    || 'franquiciado',
      sedes,
    };

    // Guardar perfil en localStorage para acceso rápido del cliente
    localStorage.setItem('pdv_user_profile', JSON.stringify(userProfile));

    // Seleccionar la primera sede automáticamente si no hay una elegida
    if (sedes.length > 0 && !localStorage.getItem('pdv_selected_sede')) {
      localStorage.setItem('pdv_selected_sede', JSON.stringify(sedes[0]));
    }

    return { data: { user: userProfile }, error: null };
  },

  // ── Cierre de sesión ─────────────────────────────────────────────────────
  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('pdv_user_profile');
    localStorage.removeItem('pdv_selected_sede');
    return { error: null };
  },

  // ── Verificar sesión activa ──────────────────────────────────────────────
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return { data: { session: null }, error };

    // Leer perfil enriquecido del localStorage
    const raw = localStorage.getItem('pdv_user_profile');
    if (raw) {
      const user = JSON.parse(raw);
      return { data: { session: { ...data.session, user } }, error: null };
    }

    // Si no hay perfil local, recargarlo desde Supabase
    const userId = data.session.user.id;

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('usuario, rol')
      .eq('id', userId)
      .single();

    const { data: pivotRows } = await supabase
      .from('usuarios_sedes')
      .select('sede_id')
      .eq('usuario_id', userId);

    let sedes = [];
    if (pivotRows && pivotRows.length > 0) {
      const sedeIds = pivotRows.map(r => r.sede_id);
      const { data: sedesData } = await supabase
        .from('sedes')
        .select('id, nombre, codigo')
        .in('id', sedeIds);
      sedes = sedesData || [];
    }

    const user = {
      id:     userId,
      email:  data.session.user.email,
      nombre: perfil?.usuario || data.session.user.email,
      rol:    perfil?.rol    || 'franquiciado',
      sedes,
    };

    localStorage.setItem('pdv_user_profile', JSON.stringify(user));
    if (sedes.length > 0 && !localStorage.getItem('pdv_selected_sede')) {
      localStorage.setItem('pdv_selected_sede', JSON.stringify(sedes[0]));
    }

    return { data: { session: { ...data.session, user } }, error: null };
  },

  // ── Sede seleccionada ────────────────────────────────────────────────────
  async getSelectedSede() {
    const saved = localStorage.getItem('pdv_selected_sede');
    if (saved) return JSON.parse(saved);

    const { data } = await this.getSession();
    if (data.session?.user?.sedes?.length > 0) {
      const primera = data.session.user.sedes[0];
      this.setSelectedSede(primera);
      return primera;
    }
    return null;
  },

  setSelectedSede(sede) {
    localStorage.setItem('pdv_selected_sede', JSON.stringify(sede));
  },
};
