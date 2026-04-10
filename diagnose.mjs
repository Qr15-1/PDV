// Diagnóstico rápido: consultar tablas de Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://khdlyzvekozjzxwdywjr.supabase.co',
  'sb_publishable_tf3yXhFM_eugz_cwgNNWbw_AJ-HoroR'
);

async function diagnose() {
  console.log('=== DIAGNÓSTICO SUPABASE ===\n');

  // 1. Login
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'roger@prueba.com',
    password: '12345678'
  });
  if (authErr) { console.error('LOGIN FALLÓ:', authErr.message); return; }
  console.log('✅ Login OK. User ID:', auth.user.id);
  console.log('   Email:', auth.user.email, '\n');

  // 2. Tabla usuarios
  const { data: usuarios, error: uErr } = await supabase.from('usuarios').select('*');
  console.log('📋 Tabla "usuarios":', uErr ? `ERROR: ${uErr.message}` : JSON.stringify(usuarios, null, 2), '\n');

  // 3. Tabla sedes
  const { data: sedes, error: sErr } = await supabase.from('sedes').select('*');
  console.log('📋 Tabla "sedes":', sErr ? `ERROR: ${sErr.message}` : JSON.stringify(sedes, null, 2), '\n');

  // 4. Tabla usuarios_sedes
  const { data: pivot, error: pErr } = await supabase.from('usuarios_sedes').select('*');
  console.log('📋 Tabla "usuarios_sedes":', pErr ? `ERROR: ${pErr.message}` : JSON.stringify(pivot, null, 2), '\n');

  // 5. Tabla metricas
  const { data: metricas, error: mErr } = await supabase.from('metricas').select('*');
  console.log('📋 Tabla "metricas":', mErr ? `ERROR: ${mErr.message}` : JSON.stringify(metricas, null, 2), '\n');

  await supabase.auth.signOut();
  console.log('=== FIN DIAGNÓSTICO ===');
}

diagnose().catch(console.error);
