# DMO Build Planner

Calculadora de builds para **Digimon Masters Online** (GDMO / KDMO / LADMO). Elegís digimon, clon, sellos, equipo/sets, joyería, digivice/chipsets, tamer, deck y título, y calcula los stats finales con el desglose de dónde sale cada punto, y te muestra si llegás al CT / HT que pide cada dungeon.

## Uso

- **Sin instalar nada:** abrí `index.html` con doble clic.
- **Con servidor local** (opcional):

```bash
python -m http.server 8765
```

Después entrá a http://localhost:8765.

## Pestañas

| Pestaña | Contenido |
|---|---|
| Digimon | Digimons rango U / SSS+ / SSS con sus stats a Lv170 y 140%. En "Más opciones": nivel, tamaño, línea evolutiva y edición manual de los stats base |
| Clon | AT / CT / BL / EV / HP de Lv0 a Lv15 (clon perfecto) o tu % real |
| Sellos | 582 sellos con sus 6 tiers (Normal → Master), búsqueda, filtros y carga masiva |
| Equipo | Sets Kaiser (Yolei / T.K. / Davis), Frontier (5 elementos) y Four Holy Beasts; ropa de eventos; costumes (Advanced y con opción HP / AT / SCD); Magnetic ID Cards (Time Ruler, Heaven Wings, Digimon King, Time Destroyer, Green / Yellow Wings), goggles, XAI, auras; digivices y chipsets R1–R20 |
| Joyería | Sólo endgame: Zero Unit, Digital Hazard, Miracle [Special], Shining Arena Ring y joyería de dungeons — Kindness Earring (Kaiser's Base), Radiant Miracle Necklace (Dark Web), Ring of Hope (Nightmare), Vital Breath y Ghost Keyring (Marketplace), Keyring of Greed (Barbamon), Sloth Bracelet (Belphemon). Cada línea con sus opciones oficiales y Digitary Power |
| Extras | Tamer (pasivas + FS%), 31 decks, 29 títulos (incluye los logros 2025-2026), buffs, procs y modificadores custom |
| Comparar | Dos builds lado a lado con diferencias |
| Info | Fórmulas, ventajas configurables y fuentes |

Los builds se guardan en el navegador de cada persona (localStorage). "Compartir" genera un link con el build completo. Desde el menú ⋯ podés exportar o importar los builds en JSON.

## Datos (`data/`)

| Archivo | Contenido |
|---|---|
| `core.js` | Crecimiento por nivel, multiplicadores de etapa, atributos / elementos, servidores y fuentes |
| `digimon.js` | 500 formas (dmowiki) |
| `digimon_u.js` | 14 digimons U agregados desde las notas oficiales 2025-2026 (copiá una entrada para sumar uno nuevo) |
| `seals.js` | Sellos |
| `equipment.js` | Equipo, sets, costumes, digivices, chipsets y tamers |
| `jewelry.js` | Accesorios |
| `clones.js` | Clones |
| `extras.js` | Decks, títulos y buffs |

Si un valor no coincide con el juego, corregilo en estos archivos o usá en la app "Editar stats base a mano", los ítems "Custom" y los "Modificadores custom".

## Fiabilidad

- **Stats base:** la fórmula (tamaño × base + crecimiento × multiplicador de etapa) reproduce 1.954 valores de la wiki con error mediano 0%. El crecimiento a Lv180 es extrapolado.
- **Estimados:** algunos digimons nuevos tienen CT / EV / HT / AS sin publicar (Quantumon, Apollomon, Apollomon Whispered, Abbadomon, Abbadomon Core); la ficha los marca como "algunos valores estimados".
- **Requisitos por DG:** CT / HT que pide cada dungeon a Lv160 y Lv170 según la tabla de la comunidad (los marcados "est." son estimados). Están en `data/core.js` (`DMO.dungeonReqs`) para actualizarlos fácil.
- **LADMO:** no se encontraron datos propios; usa los de GDMO.
