/* Extras: Decks (Enciclopedia), Títulos, Buffs/consumibles.
   Fuente: dmowiki Deck_System, Titles (snapshots wayback). Sólo 1 deck y 1 título activos a la vez.
   Deck: los % de stat (HP%, etc.) se suman AL BASE antes de clon/otros (dmowiki).
   Efectos con "cond" son probabilísticos: se pueden activar con "asumir proc activo". */
window.DMO = window.DMO || {};
DMO.extras = {
  decks: [
    { name: 'Four Holy Beasts', members: 'Azulongmon, Baihumon, Ebonwumon, Zhuqiaomon',
      fx: [{ stat: 'CD', v: 30, note: '25% en KDMO' }] },
    { name: 'Fusion to evolve into the higher', members: 'Alphamon Ouryuken, Omnimon, Shakkoumon',
      fx: [{ cond: '9% por golpe normal', text: 'Resetea cooldowns de skills (<30s)' }] },
    { name: 'Three Archangels', fx: [{ cond: '3% por golpe normal, 5s', stat: 'NDMG', v: 15 }] },
    { name: 'Main characters of the adventure', fx: [{ stat: 'AS', v: 8 }] },
    { name: 'Burst Ultimate Wings', fx: [{ stat: 'AS', v: 15 }] },
    { name: 'Burst Ultimate Wings II', fx: [{ stat: 'AS', v: 15 }, { cond: '15% al usar skill, 10s', stat: 'NDMG', v: 15 }] },
    { name: 'Seafood Stew', fx: [{ stat: 'HPP', v: 10 }] },
    { name: 'Sharp Blue Sword Wave', fx: [{ cond: '6% por golpe normal, 10s', stat: 'NDMG', v: 10 }] },
    { name: 'Instant Red Gun Fire', fx: [{ cond: '7% al usar skill, 12s', stat: 'SKP', v: 8 }] },
    { name: 'So cute', fx: [{ stat: 'CD', v: 15 }] },
    { name: 'Four Dark Masters', fx: [{ cond: '5% al usar skill, 10s', stat: 'SKP', v: 12 }] },
    { name: 'Ego of the Darkness', fx: [{ stat: 'HPP', v: 15 }, { cond: '70% por golpe normal, 5s', stat: 'NDMG', v: 12 }] },
    { name: 'Trick Or Treat!!', fx: [{ stat: 'HPP', v: 15 }] },
    { name: 'Hyper Spirit Evolution', fx: [{ stat: 'HPP', v: 10 }, { stat: 'CD', v: 2 }, { cond: '50% por golpe normal, 5s', stat: 'NDMG', v: 15 }] },
    { name: 'Ancient Spirit Evolution', fx: [{ stat: 'HPP', v: 15 }, { stat: 'CD', v: 5 }, { cond: '40% por golpe normal, 5s', stat: 'NDMG', v: 25 }] },
    { name: 'Legendary Knights of Vaccine', fx: [{ stat: 'AS', v: 15 }, { stat: 'HPP', v: 15 }, { cond: '30% por golpe normal, 7s', stat: 'NDMG', v: 20 }] },
    { name: 'OMEGA', fx: [{ stat: 'SKP', v: 12 }] },
    { name: 'MEGA-OMEGA', fx: [{ stat: 'SKP', v: 15 }, { stat: 'AS', v: 15 }, { cond: '3% por golpe normal, 10s', stat: 'CD', v: 100 }] },
    { name: 'Royal Knights X', fx: [{ stat: 'HPP', v: 20 }, { stat: 'AS', v: 17 }, { cond: '5% por golpe normal, 10s', stat: 'CD', v: 100 }] },
    // ── Decks 2025-2026 (notas oficiales GameKing). ──
    { name: 'Our hope, our light', members: 'Goddramon, Holydramon, Millenniumon, [Awaken] WarGreymon, [Awaken] MetalGarurumon, [Awaken] ZeedMillenniummon', src: 'Patch 23.09.2025',
      fx: [{ stat: 'AS', v: 19 }, { stat: 'HPP', v: 45 }, { stat: 'SKP', v: 200 }] },
    { name: 'Fear of the Abyss', members: 'Abbadomon, [Awaken] WarGreymon, [Awaken] MetalGarurumon, Seraphimon, Ophanimon, Rosemon, HerculesKabuterimon, Vikemon, Phoenixmon', src: 'Patch 14.01.2026',
      fx: [{ stat: 'AS', v: 18 }, { stat: 'SKP', v: 85 }, { cond: '20% al atacar', stat: 'SKP', v: 75 }] },
    { name: 'Abyssal Fear', members: 'Abbadomon, Abbadomon Core', src: 'Patch 25.02.2026',
      fx: [{ stat: 'AS', v: 18 }, { stat: 'SKP', v: 180 }, { stat: 'CD', v: 180 }] },
    { name: 'Perfect data, and data of unknown origin', members: 'Abbadomon, Abbadomon Core, Eosmon, Last Evolution Kizuna, Kuzuhamon Miko Mode, Shoutmon X7 Superior Mode', src: 'Patch 25.02.2026',
      fx: [{ stat: 'AS', v: 25 }, { stat: 'ATT', v: 12 }, { stat: 'FD', v: 25 }, { stat: 'HPP', v: 45 }] },
    { name: 'Wings of Justice', members: '(Extreme) Omegamon(Resistance), (Awaken) Alphamon Ouryuken', src: 'Patch 17.3.2026',
      fx: [{ stat: 'AS', v: 18 }, { stat: 'ATT', v: 4 }, { stat: 'ATP', v: 15 }] },
    { name: 'Tempting Wings of Justice', members: '(Extreme) Omegamon(Resistance), (Awaken) Lilithmon(Resistance)', src: 'Patch 17.3.2026',
      fx: [{ stat: 'AS', v: 20 }, { stat: 'SKP', v: 150 }, { stat: 'ATT', v: 3 }] },
    { name: 'The Nullifiers', members: '(Extreme) Omegamon(Resistance), (Extreme) Lucemon Satan Mode, (Extreme) Alphamon Ouryuken, (Extreme) ZeedMillenniummon, Holydramon', src: 'Patch 17.3.2026',
      fx: [{ stat: 'AS', v: 25 }, { stat: 'HTP', v: 20 }, { stat: 'ATT', v: 10 }, { stat: 'SKP', v: 140 }] },
    { name: 'One who resides in Lark', members: 'Quantumon', src: 'Patch 20.5.2026',
      fx: [{ stat: 'AS', v: 18 }, { stat: 'SKP', v: 180 }, { stat: 'CD', v: 200 }] },
    { name: 'A being that sends Digimon to the human world', members: 'Quantumon, BloomLordmon', src: 'Patch 20.5.2026',
      fx: [{ stat: 'AS', v: 19 }, { stat: 'HPP', v: 45 }, { stat: 'SKP', v: 200 }] },
    { name: 'Neutral type Digimon', members: 'Quantumon, Kuzuhamon Miko Mode, Shoutmon X7 Superior Mode', src: 'Patch 20.5.2026',
      fx: [{ stat: 'AS', v: 22 }, { stat: 'ATT', v: 5 }, { stat: 'CD', v: 100 }, { stat: 'ATP', v: 15 }] },
    { name: 'The One Who Descended in Radiance', members: 'Apollomon', src: 'Patch 15.7.2026',
      fx: [{ stat: 'AS', v: 16 }, { stat: 'SKP', v: 165 }, { stat: 'CD', v: 200 }, { stat: 'HPP', v: 20 }] },
    { name: 'Radiance Against Despair', members: 'Apollomon, Omegamon Merciful Mode, (Extreme) Susanoomon, Abbadomon, Abbadomon CORE, (Extreme) Lucemon Satan Mode, DarknessBagramon', src: 'Patch 15.7.2026',
      fx: [{ stat: 'AS', v: 25 }, { stat: 'ATT', v: 12 }, { stat: 'FD', v: 25 }, { stat: 'SKP', v: 100 }] },
  ],

  // Títulos con stats (lista parcial de dmowiki). Se suman planos después del clon.
  // elem: el daño de skill (elemSkp) sólo aplica si el digimon es de ese elemento.
  // "CT + 2000" en las notas oficiales = rating → 20%.
  titles: [
    // ── Logros 2025-2026 (notas oficiales GameKing) ──
    { name: 'Adversary of Greed and Schemes (Barbamon)', fx: { SKP: 35, CT: 20, AT: 800 }, note: 'Santuario de Barbamon (26.08.2026). Oficial: "CA 2,000" (tomado como CT 20%).' },
    { name: 'One Who Stopped the Rampage (Belphemon)', fx: { SKP: 35, HT: 1500, AT: 1000 }, note: 'Santuario de Belphemon (22.09.2026)' },
    { name: 'Precognition of the Future (Quantumon)', fx: { SKP: 35, HT: 1500, AT: 1000 }, note: 'Logro limitado de Quantumon (20.05.2026)' },
    { name: 'Blazing Pride (Apollomon)', fx: { SKP: 35, CT: 20, AT: 800 }, note: 'Logro limitado de Apollomon (CT +2000 = 20%)' },
    { name: 'Whisper of Sorrow (Apollomon Whispered)', fx: { SKP: 35, HP: 1500, HT: 1000 }, note: 'Logro limitado (16.09.2026)' },
    { name: "Journey's Finality (Abbadomon Core)", fx: { SKP: 30, HT: 1500, AT: 1000 }, note: 'Logro limitado (25.02.2026)' },
    { name: 'Silver White Holy Knight (Omegamon X Extreme)', fx: { HT: 1500, AT: 1000 }, elem: 'Light', elemSkp: 17, note: '+17% daño de skill si el digimon es de Luz (17.03.2026)' },
    { name: 'Fear of the Abyss (Abbadomon)', fx: { AT: 1000, HT: 500 }, elem: 'Pitch Black', elemSkp: 15, note: '+15% daño de skill si el digimon es de Oscuridad (14.01.2026)' },
    { name: 'Golden Dragon God (Goddramon)', fx: { HT: 500, AT: 500 }, elem: 'Fire', elemSkp: 16, note: '+16% daño de skill si el digimon es de Fuego (23.09.2025)' },
    // ── Títulos anteriores (dmowiki) ──
    { name: 'Kaiser hyper spirit', fx: { HP: 1000 }, note: '+15% daño skill Fuego' },
    { name: 'Magna hyper spirit!', fx: { HP: 1000 }, note: '+15% daño skill Luz' },
    { name: 'God of Destruction (Susanoomon)', fx: { HP: 1500 }, note: '+15% daño skill Trueno' },
    { name: 'Spirit of X! (Guerreros Legendarios)', fx: {}, note: '+5% daño skill del elemento' },
    { name: 'Apocalymon of the Darkness', fx: { SKP: 10 } },
    { name: 'Master of Twelve Heavenly Generals', fx: { HP: 2000, DS: 2000 } },
    { name: 'Expert of Battle / Expert Craftsman', fx: { HP: 1500, DS: 1000, AT: 100 } },
    { name: 'Living legend', fx: { HP: 1000, DS: 1000, SKP: 10 } },
    { name: '7 Years in DMO', fx: { HP: 1000, AT: 200, DE: 200 } },
    { name: 'Fall of the Royal Family', fx: { AT: 500, HT: 500, HP: 1500 } },
    { name: 'Savage Frontier / Brutal Predator / Generation of Evil', fx: { AT: 350, HT: 300, HP: 1200 } },
    { name: 'Rose Thorns (set Winter Vacation)', fx: { AT: 250, HT: 200, HP: 1000 } },
    { name: 'Legendary Holy Knight', fx: { HP: 2000, SKP: 15, DE: 100 } },
    { name: 'The Will of Executioner!', fx: { SKP: 15 }, note: '+10% velocidad de movimiento' },
    { name: 'Burning Heart', fx: { AT: 500, DE: 50 } },
    { name: 'Specialist of Love', fx: { AT: 500, EV: 5 } },
    { name: 'Saviour of Real World', fx: { HP: 1000, SKP: 10 } },
    { name: 'Savior of NDW', fx: { HP: 1000, AT: 70, DE: 70 } },
    { name: 'Olympos XII (títulos mensuales)', fx: {}, note: '+7% daño skill del elemento' },
    { name: 'Miraculous Light', fx: { DE: 300 } },
  ],

  // Buffs / consumibles comunes (% sobre base)
  buffs: [
    { id: 'at2h', name: 'AT +50% (2h, consumible)', fx: { ATP: 50 } },
  ],
};
