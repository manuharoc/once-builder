import { supabase } from './supabase-client.js';

// API-Football (RapidAPI o api-sports.io directo). Requiere API key propia.
const API_FOOTBALL_KEY = 'TU-API-KEY';
const API_FOOTBALL_HOST = 'v3.football.api-sports.io';

/**
 * Busca un equipo por nombre en API-Football.
 */
export async function searchTeamAPI(teamName) {
  try {
    const res = await fetch(`https://${API_FOOTBALL_HOST}/teams?name=${encodeURIComponent(teamName)}`, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });
    if (!res.ok) throw new Error('API-Football error ' + res.status);
    const data = await res.json();
    return data.response ?? [];
  } catch (err) {
    console.warn('Fallo API-Football, usando fallback manual:', err.message);
    return [];
  }
}

/**
 * Obtiene la plantilla de un equipo por su id en API-Football.
 */
export async function getSquadAPI(apiTeamId) {
  try {
    const res = await fetch(`https://${API_FOOTBALL_HOST}/players/squads?team=${apiTeamId}`, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });
    if (!res.ok) throw new Error('API-Football error ' + res.status);
    const data = await res.json();
    return data.response?.[0]?.players ?? [];
  } catch (err) {
    console.warn('Fallo API-Football squad, usando fallback manual:', err.message);
    return [];
  }
}

/**
 * Guarda un equipo + plantilla (venga de API o carga manual) en Supabase.
 */
export async function saveTeamWithPlayers(team, players, source = 'api') {
  const { data: teamRow, error: teamErr } = await supabase
    .from('teams')
    .insert({
      name: team.name,
      short_name: team.code ?? null,
      country: team.country ?? null,
      logo_url: team.logo ?? null,
      source,
      api_team_id: team.id ?? null
    })
    .select()
    .single();

  if (teamErr) throw teamErr;

  const rows = players.map(p => ({
    team_id: teamRow.id,
    name: p.name,
    position: p.position ?? null,
    number: p.number ?? null,
    nationality: p.nationality ?? null,
    photo_url: p.photo ?? null,
    source,
    api_player_id: p.id ?? null
  }));

  const { error: playersErr } = await supabase.from('players').insert(rows);
  if (playersErr) throw playersErr;

  return teamRow;
}

/**
 * Carga manual de un jugador (fallback cuando no hay datos de API).
 */
export async function addManualPlayer(teamId, player) {
  const { data, error } = await supabase
    .from('players')
    .insert({ team_id: teamId, ...player, source: 'manual' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Lee la plantilla guardada de un equipo desde Supabase.
 */
export async function getTeamPlayers(teamId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
    .order('number', { ascending: true });
  if (error) throw error;
  return data;
}

export async function listTeams() {
  const { data, error } = await supabase.from('teams').select('*').order('name');
  if (error) throw error;
  return data;
}
