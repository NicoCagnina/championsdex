export interface MetaBuild {
  ability: string
  item: string
  notes: string
  evSpread?: string
}

// Typical competitive builds. Approximated from VGC/OU/Pokémon Champions usage.
// Name keys must match PokeAPI Pokémon name (lowercase, hyphens).
export const META_BUILDS: Record<string, MetaBuild[]> = {
  'garchomp': [
    { ability: 'Rough Skin', item: 'Rocky Helmet', evSpread: '252 HP / 164 Def / 92 Vel', notes: 'Wall físico. Daña doble por contacto (Rough Skin + Rocky Helmet). Pivot muy común en balance.' },
    { ability: 'Rough Skin', item: 'Choice Scarf', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Revenge killer. Con Scarf supera a casi todos los sweepers meta.' },
  ],
  'rotom-wash': [
    { ability: 'Levitate', item: 'Leftovers', evSpread: '252 HP / 252 DefEsp / 4 Vel', notes: 'Pivot eléctrico/agua. Inmune a tierra, resiste acero. Muy presente en HO y balance.' },
    { ability: 'Levitate', item: 'Choice Scarf', evSpread: '252 SpA / 4 Def / 252 Vel', notes: 'Revenge killer. Con Scarf sorprende a muchos sweepers.' },
  ],
  'rotom-heat': [
    { ability: 'Levitate', item: 'Choice Scarf', evSpread: '252 SpA / 4 Def / 252 Vel', notes: 'Fire/Electric es cobertura excelente. Scarf lo hace muy rápido.' },
    { ability: 'Levitate', item: 'Leftovers', evSpread: '252 HP / 168 Def / 88 Vel', notes: 'Set de control con Overheat/Volt Switch. Buen pivot de fuego.' },
  ],
  'rotom-fan': [
    { ability: 'Levitate', item: 'Leftovers', evSpread: '252 HP / 252 Def / 4 Vel', notes: 'Electric/Flying da inmunidad a tierra y fighting. Nicho en equipos que necesitan resistir lucha.' },
  ],
  'rotom-frost': [
    { ability: 'Levitate', item: 'Choice Scarf', evSpread: '252 SpA / 4 Def / 252 Vel', notes: 'Electric/Ice cubre Volador y Dragón. Muy nicho pero sorpresivo en granizo.' },
  ],
  'rotom-mow': [
    { ability: 'Levitate', item: 'Leftovers', evSpread: '252 HP / 252 DefEsp / 4 Vel', notes: 'Electric/Grass. Cobertura contra agua y tierra. Funciona en terreno hierba.' },
  ],
  'rotom': [
    { ability: 'Levitate', item: 'Choice Scarf', evSpread: '252 SpA / 4 Def / 252 Vel', notes: 'Forma base Ghost/Electric. Inmune a normal y lucha. Control general.' },
  ],
  'gholdengo': [
    { ability: 'Good as Gold', item: 'Choice Specs', evSpread: '252 SpA / 4 Def / 252 Vel', notes: 'Meta staple. Inmune a todos los status-moves. SpA brutal con Specs. Muy difícil de bloquear.' },
    { ability: 'Good as Gold', item: 'Air Balloon', evSpread: '252 HP / 4 SpA / 252 Vel', notes: 'Versión pivot. Inmune a Terremoto con Air Balloon. Excelente bloqueador de hazards.' },
  ],
  'iron-valiant': [
    { ability: 'Quark Drive', item: 'Booster Energy', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Sweeper físico o especial muy versátil. Quark Drive boost con Booster Energy es devastador.' },
    { ability: 'Quark Drive', item: 'Choice Scarf', evSpread: '252 SpA / 4 Def / 252 Vel', notes: 'Revenge killer especial. Aura Sphere + Moonblast + Shadow Ball es cobertura excelente.' },
  ],
  'kingambit': [
    { ability: 'Supreme Overlord', item: 'Black Glasses', evSpread: '252 HP / 252 Atk / 4 Def', notes: 'Late-game win condition. Sube +1 ATK por cada KO del equipo. Kowtow Cleave no puede fallar.' },
    { ability: 'Defiant', item: 'Clear Amulet', evSpread: '252 HP / 252 Atk / 4 Def', notes: 'Contador de Intimidate. Sube ATK con cada baja de stats del rival.' },
  ],
  'great-tusk': [
    { ability: 'Protosynthesis', item: 'Heavy-Duty Boots', evSpread: '252 HP / 252 Atk / 4 Def', notes: 'Mejor Rapid Spin del meta. Earthen Force + Headlong Rush como wallbreaker. Casi imprescindible.' },
    { ability: 'Protosynthesis', item: 'Choice Scarf', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Revenge killer que además hace Rapid Spin. Muy completo.' },
  ],
  'flutter-mane': [
    { ability: 'Protosynthesis', item: 'Choice Specs', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Una de las amenazas más rápidas y potentes. SpA + Vel altísimos. Frágil pero demoledor.' },
    { ability: 'Protosynthesis', item: 'Booster Energy', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Boost inmediato de Vel sin sol. Moonblast + Shadow Ball cubre casi todo.' },
  ],
  'roaring-moon': [
    { ability: 'Protosynthesis', item: 'Booster Energy', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Sweeper físico extremo en Sol. ATK y VEL altísimos. Tatsugiri + Dondozo no lo para.' },
    { ability: 'Protosynthesis', item: 'Choice Band', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Wallbreaker absoluto. Acrobatics sin objeto hace daño enorme.' },
  ],
  'dragapult': [
    { ability: 'Clear Body', item: 'Choice Specs', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Atacante especial rapidísimo. Dragón + Fantasma + Fuego es cobertura total.' },
    { ability: 'Infiltrator', item: 'Choice Band', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Penetra Reflect y Light Screen. Phantom Force garantiza el Draco Meteor siguiente.' },
  ],
  'meowscarada': [
    { ability: 'Protean', item: 'Choice Band', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'El STAB de Floral Wrath o Triple Axel con Band + Protean es devastador. El más rápido del early meta.' },
    { ability: 'Overgrow', item: 'Focus Sash', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Setter de Spikes + Knock Off. Garantiza al menos un turno de soporte.' },
  ],
  'heatran': [
    { ability: 'Flash Fire', item: 'Air Balloon', evSpread: '252 HP / 4 SpA / 252 Vel', notes: 'Absorbe fuego y tierra. Magma Storm + Taunt es trampa perfecta. Icono del juego competitivo.' },
    { ability: 'Flash Fire', item: 'Leftovers', evSpread: '252 HP / 168 Def / 88 Vel', notes: 'Set de control con Stealth Rock, Toxic, Lava Plume.' },
  ],
  'ferrothorn': [
    { ability: 'Iron Barbs', item: 'Leftovers', evSpread: '252 HP / 88 Def / 168 DefEsp', notes: 'Setter de Spikes y Stealth Rock. Iron Barbs + Rocky Helmet combina con cambios. Duración enorme.' },
    { ability: 'Iron Barbs', item: 'Rocky Helmet', evSpread: '252 HP / 252 Def / 4 Vel', notes: 'Maximiza chip por contacto. Wall físico insuperable.' },
  ],
  'corviknight': [
    { ability: 'Mirror Armor', item: 'Rocky Helmet', evSpread: '252 HP / 252 Def / 4 Vel', notes: 'Hazard remover con Defog. Mirror Armor refleja stats drops (Intimidate). Omnipresente en stall.' },
    { ability: 'Pressure', item: 'Leftovers', evSpread: '252 HP / 168 Def / 88 Vel', notes: 'Stall de PP con Roost. Muy difícil de desgastar.' },
  ],
  'toxapex': [
    { ability: 'Regenerator', item: 'Black Sludge', evSpread: '252 HP / 252 Def / 4 Vel', notes: 'Wall casi perfecto. Toxic + Recover + Hex. Regenerator hace pivot gratuito.' },
  ],
  'ting-lu': [
    { ability: 'Vessel of Ruin', item: 'Leftovers', evSpread: '252 HP / 4 Def / 252 DefEsp', notes: 'Tank físico de tierra. Vessel of Ruin baja SpA de todos en campo. Hazard setter excelente.' },
  ],
  'chi-yu': [
    { ability: 'Beads of Ruin', item: 'Choice Scarf', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'SpA más alta del meta fuera de Mega. Beads of Ruin baja DefEsp de todos. Overlord del fuego.' },
    { ability: 'Beads of Ruin', item: 'Choice Specs', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Daño devastador en fuego y dark. Very frágil pero muy poderoso.' },
  ],
  'chien-pao': [
    { ability: 'Sword of Ruin', item: 'Life Orb', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Sweeper físico rapidísimo. Sword of Ruin baja Def. Icicle Crash + Sacred Sword + Crunch + Ice Shard.' },
    { ability: 'Sword of Ruin', item: 'Focus Sash', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Garantiza al menos un ataque / KO. Ice Shard como priority para remattar.' },
  ],
  'annihilape': [
    { ability: 'Vital Spirit', item: 'Leftovers', evSpread: '252 HP / 4 Atk / 252 Vel', notes: 'Setup con Rage Fist. Inmune a sueño con Vital Spirit. Puede ser imparable si sube Rage Fist.' },
    { ability: 'Defiant', item: 'Choice Band', evSpread: '252 HP / 252 Atk / 4 Vel', notes: 'Set agresivo. Rage Fist escala enorme si recibe daño. Defiant ante Intimidate.' },
  ],
  'ceruledge': [
    { ability: 'Flash Fire', item: 'Heavy-Duty Boots', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Sweeper físico fuego/fantasma. Bitter Blade recupera HP. Flash Fire lo hace inmune a fuego.' },
    { ability: 'Flash Fire', item: 'Clear Amulet', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Previene drops de stats del rival. Agility + Swords Dance setup set.' },
  ],
  'skeledirge': [
    { ability: 'Unaware', item: 'Leftovers', evSpread: '252 HP / 168 Def / 88 Vel', notes: 'Wall de setup absoluto. Unaware ignora todos los boosts del rival. Singer quema sin fallo.' },
  ],
  'blissey': [
    { ability: 'Natural Cure', item: 'Leftovers', evSpread: '4 Def / 252 SpA / 252 DefEsp', notes: 'HP y DefEsp supremos. Natural Cure al cambio. Soft-Boiled la hace prácticamente inmortal vs especiales.' },
  ],
  'primarina': [
    { ability: 'Liquid Voice', item: 'Choice Specs', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Hypervoice se vuelve Water con Liquid Voice. SpA alta + Hada/Agua = cobertura excelente.' },
    { ability: 'Torrent', item: 'Throat Spray', evSpread: '252 HP / 252 SpA / 4 Vel', notes: 'Boost de SpA con Hyper Voice/Sparkling Aria. Set de un solo turno pero potente.' },
  ],
  'iron-treads': [
    { ability: 'Quark Drive', item: 'Heavy-Duty Boots', evSpread: '252 HP / 4 Atk / 252 Vel', notes: 'Rapid Spin + pivot eléctrico. Resistencias excelentes. Hazard remover muy completo.' },
    { ability: 'Quark Drive', item: 'Choice Scarf', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Revenge killer con Rapid Spin bonus. Muy confiable.' },
  ],
  'sandy-shocks': [
    { ability: 'Protosynthesis', item: 'Choice Scarf', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Paradoja de Magneton. SpA + Vel altos. Thunderbolt + Earth Power cubre mucho.' },
  ],
  'clefable': [
    { ability: 'Magic Guard', item: 'Life Orb', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Magic Guard + Life Orb = no pierde HP por daño indirecto. Moonblast + Psyshock + Flamethrower.' },
    { ability: 'Unaware', item: 'Leftovers', evSpread: '252 HP / 252 Def / 4 Vel', notes: 'Wall que ignora todos los boosts del rival. Moonblast + Softboiled es muy difícil de matar.' },
  ],
  'dragonite': [
    { ability: 'Multiscale', item: 'Lum Berry', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Dragon Dance a plena vida gracias a Multiscale. Lum Berry limpia Paralysis/Burn que interrumpirían el setup.' },
    { ability: 'Multiscale', item: 'Heavy-Duty Boots', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Dragon Dance + Extreme Speed como priority. Evita Stealth Rock que rompe Multiscale.' },
  ],
  'slowking-galar': [
    { ability: 'Regenerator', item: 'Heavy-Duty Boots', evSpread: '252 HP / 4 Def / 252 DefEsp', notes: 'Pivot especial. Future Sight genera presión enorme. Regenerator hace pivot gratuito muy recuperador.' },
  ],
  'volcarona': [
    { ability: 'Flame Body', item: 'Heavy-Duty Boots', evSpread: '252 SpA / 4 DefEsp / 252 Vel', notes: 'Quiver Dance sweeper. Flame Body puede quemar a contacto. Muy poderoso tras un boost.' },
  ],
  'espeon': [
    { ability: 'Magic Bounce', item: 'Life Orb', evSpread: '4 HP / 252 SpA / 252 Vel', notes: 'Magic Bounce refleja Spikes, Stealth Rock, Taunt y status. Excelente para equipos HO.' },
  ],
  'landorus-therian': [
    { ability: 'Intimidate', item: 'Rocky Helmet', evSpread: '252 HP / 200 Def / 56 Vel', notes: 'El pivot físico más completo del juego. Intimidate al entrar + U-turn para momentum constante.' },
    { ability: 'Intimidate', item: 'Choice Scarf', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Revenge killer con Intimidate al entrar. Earthquake + U-turn + Stone Edge + Knock Off.' },
  ],
  'urshifu-single-strike': [
    { ability: 'Unseen Fist', item: 'Choice Band', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Wicked Blow siempre critica y penetra Protect/substitutos. Band lo hace devastador.' },
    { ability: 'Unseen Fist', item: 'Focus Sash', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Sash garantiza la llegada al oponente. Sucker Punch como priority.' },
  ],
  'urshifu-rapid-strike': [
    { ability: 'Unseen Fist', item: 'Choice Band', evSpread: '252 Atk / 4 Def / 252 Vel', notes: 'Surging Strikes siempre critica (3 hits). Penetra Focus Sash. Water/Fighting cobertura excelente.' },
  ],
}

export function getMetaBuilds(pokemonName: string): MetaBuild[] {
  return META_BUILDS[pokemonName.toLowerCase()] ?? []
}
