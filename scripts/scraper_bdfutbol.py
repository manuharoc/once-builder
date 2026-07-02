import json
import time
import requests
import urllib3
from bs4 import BeautifulSoup
import os

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ==============================================================================
# SCRIPT DE SCRAPING AUTOMATIZADO - BDFUTBOL
# ==============================================================================
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "es-ES,es;q=0.9",
}

# Diccionario de equipos (Los mismos 23 que tienes en players.js)
# Usamos las URLs de BDFutbol de la temporada actual 24-25
TEAM_URLS = [
    {"id": "madrid", "name": "Real Madrid", "url": "https://www.bdfutbol.com/es/t/t2024-252.html"},
    {"id": "barca", "name": "FC Barcelona", "url": "https://www.bdfutbol.com/es/t/t2024-251.html"},
    {"id": "atletico", "name": "Atlético de Madrid", "url": "https://www.bdfutbol.com/es/t/t2024-257.html"},
    {"id": "villarreal", "name": "Villarreal", "url": "https://www.bdfutbol.com/es/t/t2024-2538.html"},
    {"id": "betis", "name": "Real Betis", "url": "https://www.bdfutbol.com/es/t/t2024-2514.html"},
    {"id": "celta", "name": "Celta de Vigo", "url": "https://www.bdfutbol.com/es/t/t2024-2511.html"},
    {"id": "realsociedad", "name": "Real Sociedad", "url": "https://www.bdfutbol.com/es/t/t2024-2532.html"},
    {"id": "getafe", "name": "Getafe", "url": "https://www.bdfutbol.com/es/t/t2024-2561.html"},
    {"id": "athletic", "name": "Athletic Club", "url": "https://www.bdfutbol.com/es/t/t2024-258.html"},
    {"id": "valencia", "name": "Valencia", "url": "https://www.bdfutbol.com/es/t/t2024-2536.html"},
    {"id": "sevilla", "name": "Sevilla", "url": "https://www.bdfutbol.com/es/t/t2024-2533.html"},
    {"id": "rayo", "name": "Rayo Vallecano", "url": "https://www.bdfutbol.com/es/t/t2024-2528.html"},
    {"id": "osasuna", "name": "Osasuna", "url": "https://www.bdfutbol.com/es/t/t2024-2513.html"},
    {"id": "espanyol", "name": "Espanyol", "url": "https://www.bdfutbol.com/es/t/t2024-2515.html"},
    {"id": "alaves", "name": "Alavés", "url": "https://www.bdfutbol.com/es/t/t2024-253.html"},
    {"id": "mallorca", "name": "Mallorca", "url": "https://www.bdfutbol.com/es/t/t2024-2524.html"},
    {"id": "girona", "name": "Girona", "url": "https://www.bdfutbol.com/es/t/t2024-25153.html"},
    {"id": "laspalmas", "name": "Las Palmas", "url": "https://www.bdfutbol.com/es/t/t2024-2531.html"},
    {"id": "leganes", "name": "Leganés", "url": "https://www.bdfutbol.com/es/t/t2024-2557.html"},
    {"id": "valladolid", "name": "Real Valladolid", "url": "https://www.bdfutbol.com/es/t/t2024-2537.html"},
    # Equipos de segunda para rellenar (ajustado a sus IDs de BDFutbol)
    {"id": "racing", "name": "Racing de Santander", "url": "https://www.bdfutbol.com/es/t/t2024-2527.html"},
    {"id": "deportivo", "name": "Deportivo de La Coruña", "url": "https://www.bdfutbol.com/es/t/t2024-2512.html"},
    {"id": "malaga", "name": "Málaga", "url": "https://www.bdfutbol.com/es/t/t2024-2523.html"}
]

def parse_position(classes):
    """Convierte las clases CSS de BDFutbol a las 4 posiciones del juego"""
    class_str = " ".join(classes).lower()
    if 'por' in class_str: return "Goalkeeper"
    if any(c in class_str for c in ['def', 'lti', 'ltd', 'cen', 'lib']): return "Defender"
    if any(c in class_str for c in ['mig', 'piv', 'mco', 'mp', 'in']): return "Midfielder"
    if any(c in class_str for c in ['dav', 'ext', 'dc']): return "Attacker"
    return "Midfielder" # Por defecto

def scrape_team(team_info):
    print(f"[{team_info['name']}] Descargando datos desde DBFutbol...")
    
    response = requests.get(team_info["url"], headers=HEADERS, verify=False)
    if response.status_code != 200:
        print(f"Error {response.status_code} al acceder a {team_info['name']}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # BDFutbol lista la plantilla en tablas sin una clase única fácil, 
    # pero las filas de jugadores suelen tener una clase específica o estar en la tabla principal
    players = []
    
    # Buscamos todas las filas
    for row in soup.find_all('tr'):
        tds = row.find_all('td')
        if len(tds) < 5: continue
        
        # En BDFutbol el nombre del jugador está en un <a> dentro del 3r o 4to td
        a_tag = row.find('a', href=lambda href: href and '../j/j' in href)
        if not a_tag: continue
        
        # El nombre corto suele estar en un span con font-weight-bold
        name_span = a_tag.find('span', class_='font-weight-bold')
        if not name_span:
            player_name = a_tag.text.strip()
        else:
            player_name = name_span.text.strip()
            
        if not player_name or player_name == 'Entrenador': continue
        
        # El dorsal suele ser el primer td
        num_td = tds[0]
        number = None
        if num_td.text.strip().isdigit():
            number = int(num_td.text.strip())
            
        # La posición está en un div dentro de uno de los TDs intermedios (tiene clase 'fit por', 'fit lti', etc)
        pos_div = row.find('div', class_=lambda c: c and 'fit' in c and len(c.split()) > 1)
        position = "Midfielder"
        if pos_div:
            position = parse_position(pos_div.get('class', []))
            
        # ID único
        player_id = f"{team_info['id']}_{len(players) + 1}"
        
        # Evitar duplicados exactos que a veces pasan en las tablas dobles
        if not any(p['name'] == player_name for p in players):
            players.append({
                'id': player_id,
                'name': player_name,
                'position': position,
                'number': number
            })
            
    print(f"Encontrados {len(players)} jugadores.")
    time.sleep(1) # BDFutbol es más permisivo, 1 seg basta
    return players

def main():
    print("Iniciando scraping automático desde BDFutbol...")
    all_squads = {}
    
    for team in TEAM_URLS:
        players = scrape_team(team)
        if players:
            all_squads[team["id"]] = players
            
    output_path = os.path.join(os.path.dirname(__file__), 'scraped_squads_bdfutbol.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_squads, f, indent=2, ensure_ascii=False)
        
    print(f"\n¡Proceso terminado! Los datos se han guardado en {output_path}")
    print("Para aplicarlos a la web, copia y pega el contenido del JSON dentro")
    print("del objeto MOCK_SQUADS en el archivo js/players.js")

if __name__ == "__main__":
    main()
