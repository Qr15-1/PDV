import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('https://khdlyzvekozjzxwdywjr.supabase.co', 'sb_publishable_tf3yXhFM_eugz_cwgNNWbw_AJ-HoroR');

async function test() {
  await supabase.auth.signInWithPassword({email: 'roger@prueba.com', password: '12345678'});
  const { data: u } = await supabase.from('usuarios').select('*');
  const { data: us } = await supabase.from('usuarios_sedes').select('*');
  fs.writeFileSync('db_dump.json', JSON.stringify({ usuarios: u, usuarios_sedes: us }, null, 2));
}
test();
