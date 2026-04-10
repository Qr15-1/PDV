import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('https://khdlyzvekozjzxwdywjr.supabase.co', 'sb_publishable_tf3yXhFM_eugz_cwgNNWbw_AJ-HoroR');

async function test() {
  await supabase.auth.signInWithPassword({email: 'roger@prueba.com', password: '12345678'});
  const { data: m } = await supabase.from('metricas').select('*');
  const { data: s } = await supabase.from('sedes').select('*');
  fs.writeFileSync('db_dump2.json', JSON.stringify({ metricas: m, sedes: s }, null, 2));
}
test();
