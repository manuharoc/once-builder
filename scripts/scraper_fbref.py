import json
import time
import requests
from bs4 import BeautifulSoup
import os

# ==============================================================================
# SCRIPT DE SCRAPING AUTOMATIZADO - FBRef
# 
# Uso: python scraper_fbref.py
# 
# NOTA IMPORTANTE PARA VERCEL Y SCRAPING LOCAL:
# FBRef es extremadamente restrictivo con los bots. 
# 1. Este script DEBE ejecutarse en tu ordenador local antes de subir el código a Vercel.
# 2. Vercel no debe ejecutar este script, simplemente servirá el archivo players.js resultante.
# 3. Respeta el "time.sleep(4)". FBRef permite un máximo de 20 peticiones por minuto.
#    Si te pasas, te banearán la IP durante 1 hora y recibirás un error 429.
# ==============================================================================

# Headers simulando ser un navegador Chrome real en Windows para evitar bloqueos básicos
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Añade aquí las URLs de los equipos que quieras actualizar.
# Busca el equipo en FBRef y usa la URL de la página de estadísticas del equipo.
TEAM_URLS = [
    {"id": 1,  "name": "Real Madrid",         "url": "https://fbref.com/en/squads/53a2f082/Real-Madrid-Stats"},
    {"id": 2,  "name": "FC Barcelona",        "url": "https://fbref.com/en/squads/206d90db/Barcelona-Stats"},
    {"id": 3,  "name": "Atlético de Madrid",  "url": "https://fbref.com/en/squads/db3b9613/Atletico-Madrid-Stats"},
    {"id": 4,  "name": "Villarreal",          "url": "https://fbref.com/en/squads/2a8183b3/Villarreal-Stats"},
    {"id": 5,  "name": "Real Betis",          "url": "https://fbref.com/en/squads/fc536746/Real-Betis-Stats"},
    {"id": 6,  "name": "Celta de Vigo",       "url": "https://fbref.com/en/squads/f25da7fb/Celta-Vigo-Stats"},
    {"id": 7,  "name": "Real Sociedad",       "url": "https://fbref.com/en/squads/e31d1cd9/Real-Sociedad-Stats"},
    {"id": 8,  "name": "Getafe",              "url": "https://fbref.com/en/squads/7848bd64/Getafe-Stats"},
    {"id": 9,  "name": "Athletic Club",       "url": "https://fbref.com/en/squads/2b390eca/Athletic-Club-Stats"},
    {"id": 10, "name": "Valencia",            "url": "https://fbref.com/en/squads/dcc91a7b/Valencia-Stats"},
    {"id": 11, "name": "Sevilla",             "url": "https://fbref.com/en/squads/ad2be733/Sevilla-Stats"},
    {"id": 12, "name": "Rayo Vallecano",      "url": "https://fbref.com/en/squads/98e8af82/Rayo-Vallecano-Stats"},
    {"id": 13, "name": "Osasuna",             "url": "https://fbref.com/en/squads/03c57e2b/Osasuna-Stats"},
    {"id": 14, "name": "Espanyol",            "url": "https://fbref.com/en/squads/a8661628/Espanyol-Stats"},
    {"id": 15, "name": "Alavés",              "url": "https://fbref.com/en/squads/8d6fd021/Alaves-Stats"},
    {"id": 16, "name": "Levante",             "url": "https://fbref.com/en/squads/9800b6a1/Levante-Stats"},
    {"id": 17, "name": "Elche",               "url": "https://fbref.com/en/squads/6c8b07df/Elche-Stats"},
    {"id": 18, "name": "Racing de Santander", "url": "https://fbref.com/en/squads/dee3bbc8/Racing-Santander-Stats"},
    {"id": 19, "name": "Deportivo de La Coruña", "url": "https://fbref.com/en/squads/2a60ed82/Deportivo-La-Coruna-Stats"},
    {"id": 20, "name": "Málaga",              "url": "https://fbref.com/en/squads/1c896955/Malaga-Stats"}
]

def parse_position(fbref_pos):
    """Convierte las posiciones de FBRef (GK, DF, MF, FW) al formato de la web"""
    if "GK" in fbref_pos: return "Goalkeeper"
    if "DF" in fbref_pos: return "Defender"
    if "FW" in fbref_pos: return "Attacker"
    return "Midfielder"

def scrape_team(team_info):
    print(f"[{team_info['name']}] Descargando datos...")
    
    response = requests.get(team_info["url"], headers=HEADERS)
    if response.status_code != 200:
        print(f"❌ Error {response.status_code} al acceder a {team_info['name']}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # La tabla principal de estadísticas tiene la clase 'stats_table'
    table = soup.find('table', class_='stats_table')
    if not table:
        print(f"❌ No se encontró la tabla de jugadores para {team_info['name']}")
        return []

    players = []
    tbody = table.find('tbody')
    
    # Cada jugador es una fila (tr)
    player_count = 0
    for row in tbody.find_all('tr'):
        if 'spacer' in row.get('class', []): continue
            
        # El nombre está en la etiqueta <th> con data-stat="player"
        th_player = row.find('th', {'data-stat': 'player'})
        if not th_player: continue
        
        player_name = th_player.text.strip()
        if player_name == 'Squad Total' or not player_name: continue
        
        # Posición
        td_pos = row.find('td', {'data-stat': 'position'})
        pos_raw = td_pos.text.strip() if td_pos else ""
        position = parse_position(pos_raw)
        
        # Dorsal
        td_num = row.find('td', {'data-stat': 'shirtnumber'})
        number = None
        if td_num and td_num.text.strip().isdigit():
            number = int(td_num.text.strip())
            
        # Generamos un ID combinando el ID del equipo y un contador
        player_count += 1
        player_id = (team_info["id"] * 1000) + player_count
            
        players.append({
            'id': player_id,
            'name': player_name,
            'position': position,
            'number': number
        })
        
    print(f"✅ Encontrados {len(players)} jugadores.")
    
    # CRÍTICO: Pausa obligatoria para no ser baneado por FBRef (límite de 20 por min)
    time.sleep(4) 
    
    return players

def main():
    print("Iniciando scraping automático...")
    all_squads = {}
    
    for team in TEAM_URLS:
        players = scrape_team(team)
        if players:
            all_squads[team["id"]] = players
            
    # Guardamos los resultados en un archivo JSON crudo
    output_path = os.path.join(os.path.dirname(__file__), 'scraped_squads.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_squads, f, indent=2, ensure_ascii=False)
        
    print(f"\n🎉 ¡Proceso terminado! Los datos se han guardado en {output_path}")
    print("Para aplicarlos a la web, copia y pega el contenido del JSON dentro")
    print("del objeto MOCK_SQUADS en el archivo js/players.js")

if __name__ == "__main__":
    main()
