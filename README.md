# Once Builder ⚽

Web para crear onces de fútbol personalizados: formaciones tácticas, diseño de camisetas y carga de jugadores/plantillas desde API-Football o manualmente.

## Stack
- Vanilla HTML/CSS/JS (ES modules, sin build step)
- Supabase (Postgres + auth + storage)
- API-Football (api-sports.io) para datos reales de equipos/jugadores
- Deploy: Vercel

## Setup

1. **Supabase**
   - Crea un proyecto en supabase.com
   - Ejecuta `sql/schema.sql` en el SQL Editor
   - Copia URL y anon key a `js/supabase-client.js`

2. **API-Football**
   - Crea cuenta en https://www.api-sports.io/ (o RapidAPI)
   - Copia tu API key a `js/players.js` (`API_FOOTBALL_KEY`)
   - Plan free tiene límite de requests/día — por eso el fallback manual

3. **Local**
   ```
   npx serve .
   ```
   (o cualquier servidor estático; necesario por los ES modules)

4. **Deploy**
   ```
   vercel
   ```

## Estructura

```
once-builder/
├── index.html
├── css/style.css
├── js/
│   ├── formations.js   # datos de formaciones (4-3-3, 4-4-2, etc.)
│   ├── pitch.js         # render del campo + drag&drop
│   ├── jersey.js        # diseñador SVG de camisetas
│   ├── players.js       # API-Football + fallback Supabase
│   ├── supabase-client.js
│   └── main.js          # orquestación
└── sql/schema.sql
```

## Roadmap sugerido

- [ ] Guardar `lineups` en Supabase (ya exportado en JS, falta el insert)
- [ ] Exportar el once como imagen (PNG) usando el SVG del campo + camisetas
- [ ] Selector de equipos guardados (`listTeams()` ya implementado, falta UI)
- [ ] Aplicar la camiseta diseñada visualmente en cada slot del campo (hoy es un placeholder de color)
- [ ] Autenticación simple para que cada usuario guarde sus onces
- [ ] Más formaciones: 4-1-4-1, 4-3-2-1, 3-4-1-2
- [ ] Caché local de resultados de API-Football (localStorage) para no gastar cuota

## Notas de diseño

- Las posiciones de la formación están en % (x/y) sobre el campo, así que son responsive por defecto.
- El diseñador de camiseta genera SVG puro — fácil de exportar o incrustar en cada jugador.
- `source: 'api' | 'manual'` en `teams`/`players` permite distinguir origen de los datos y mezclarlos sin conflicto.
