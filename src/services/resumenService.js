// src/services/resumenService.js
import { supabase } from '../lib/supabase.js';

/**
 * Objeto vacío: garantiza que el frontend nunca rompa si no hay datos.
 */
function emptyData() {
  return {
    metricas: {
      ventas_mes:       null,
      costos_mes:       null,
      utilidad_mes:     null,
      costo_producto:   null,
      ticket_promedio:  null,
      pizza_mas_vendida:null,
      venta_pickup:     null,
      venta_delivery:   null,
      venta_mesa:       null,
    },
    noticias:       [],
    usuario:        { nombre: null, avatar_url: null, rol: null },
    grafica_ventas: [],
  };
}

/**
 * Obtiene las métricas desde Supabase (server-side o client-side).
 * En el servidor (SSR) no hay localStorage, así que devuelve datos vacíos.
 * Las métricas reales se cargan luego en el cliente via fetchMetricasCliente().
 */
export async function getResumenData() {
  // Server-side: devolver datos vacíos (se rellenan luego en el cliente)
  if (typeof window === 'undefined') {
    return emptyData();
  }

  return await fetchMetricasDesdeSupabase();
}

/**
 * Función cliente: carga métricas reales desde Supabase según la sede activa.
 * Se llama después del page-load cuando ya sabemos la sede seleccionada.
 */
export async function fetchMetricasDesdeSupabase(sedeIdOverride) {
  let sedeId = sedeIdOverride || null;

  // Leer sede del localStorage si no se pasó por parámetro
  if (!sedeId) {
    try {
      const raw = localStorage.getItem('pdv_selected_sede');
      if (raw) sedeId = JSON.parse(raw)?.id ?? null;
    } catch (_) {}
  }

  if (!sedeId) {
    console.warn('[resumenService] No hay sede seleccionada.');
    return emptyData();
  }

  // Consultar tabla metricas filtrando por sede
  const { data: rows, error } = await supabase
    .from('metricas')
    .select('semana, ventas, costos')
    .eq('sede_id', sedeId)
    .order('semana', { ascending: true });

  if (error) {
    console.error('[resumenService] Error Supabase:', error.message);
    return emptyData();
  }

  if (!rows || rows.length === 0) {
    console.warn('[resumenService] Sin datos para sede_id:', sedeId);
    return emptyData();
  }

  // Calcular totales acumulados
  const totalVentas = rows.reduce((s, r) => s + (r.ventas ?? 0), 0);
  const totalCostos = rows.reduce((s, r) => s + (r.costos ?? 0), 0);
  const utilidad    = totalVentas - totalCostos;
  const costoPct    = totalVentas > 0 ? Math.round((totalCostos / totalVentas) * 100) : null;
  const ticketProm  = rows.length  > 0 ? Math.round(totalVentas / rows.length) : null;

  // Gráfica de ventas: una barra por semana
  const graficaVentas = rows.map(r => ({
    mes:   `Sem ${r.semana}`,
    monto: r.ventas ?? null,
  }));

  return {
    metricas: {
      ventas_mes:        totalVentas  || null,
      costos_mes:        totalCostos  || null,
      utilidad_mes:      utilidad     || null,
      costo_producto:    costoPct,
      ticket_promedio:   ticketProm,
      pizza_mas_vendida: null,
      venta_pickup:      null,
      venta_delivery:    null,
      venta_mesa:        null,
    },
    noticias:       [],
    usuario:        { nombre: null, avatar_url: null, rol: null },
    grafica_ventas: graficaVentas,
  };
}
