import json
import re

with open('scripts/scraped_squads_bdfutbol.json', 'r', encoding='utf-8') as f:
    new_data = json.load(f)

# Mapa de mis IDs a los IDs de players.js
team_id_map = {
    "madrid": "1",
    "barca": "2",
    "atletico": "3",
    "sevilla": "4",
    "betis": "5",
    "athletic": "6",
    "villarreal": "7",
    "valencia": "8",
    "realsociedad": "9",
    "osasuna": "10",
    "girona": "11",
    "celta": "12",
    "mallorca": "13",
    "rayo": "14",
    "espanyol": "15",
    "getafe": "16",
    "alaves": "17",
    "levante": "18",
    "elche": "19",
    "oviedo": "20",
    "laspalmas": "22",
    "leganes": "45",  # Revisaremos en players.js
    "valladolid": "46", # Revisaremos en players.js
    "racing": "51",
    "deportivo": "52",
    "malaga": "53"
}

with open('js/players.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

for team_key, players in new_data.items():
    if not players: continue
    
    js_team_id = team_id_map.get(team_key)
    if not js_team_id: continue
    
    players_json = json.dumps(players, ensure_ascii=False, indent=4)
    players_json = players_json.replace('\n', '\n    ')
    
    # Buscar: `  1: [` o `"1": [` (el original usa números sin comillas)
    pattern = r'(^\s*' + js_team_id + r'\s*:\s*\[).*?(\],?)'
    
    def replacer(m):
        return f'{m.group(1)}\n    {players_json[1:-1]}    {m.group(2)}'
    
    js_content = re.sub(pattern, replacer, js_content, flags=re.DOTALL | re.MULTILINE)

with open('js/players.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print("js/players.js actualizado correctamente con los datos de DBFutbol.")
