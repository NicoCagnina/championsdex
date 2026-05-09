import type { PokemonStats } from './types'

export interface Item {
  name: string
  desc: string
  category: string
  speedMult?: number
  atkMult?: number
  spAtkMult?: number
  // Mega stone fields
  megaTypes?: string[]           // Types after mega evolution
  megaAbility?: string           // Ability after mega evolution
  megaStats?: Partial<PokemonStats> // Full base stats after mega
  forPokemon?: string            // PokeAPI name of the pokemon (e.g. 'charizard')
}

export const ITEM_CATEGORIES: { label: string; items: Item[] }[] = [
  {
    label: 'Elección',
    items: [
      { name: 'Choice Band',  desc: '+50% Ataque físico. Solo 1 movimiento.', category: 'Elección', atkMult: 1.5 },
      { name: 'Choice Specs', desc: '+50% Ataque especial. Solo 1 movimiento.', category: 'Elección', spAtkMult: 1.5 },
      { name: 'Choice Scarf', desc: '+50% Velocidad. Solo 1 movimiento.', category: 'Elección', speedMult: 1.5 },
    ],
  },
  {
    label: 'Boost de daño',
    items: [
      { name: 'Life Orb',     desc: '+30% daño. Pierde 10% HP al atacar.', category: 'Boost' },
      { name: 'Expert Belt',  desc: '+20% daño en golpes muy efectivos.', category: 'Boost' },
      { name: 'Muscle Band',  desc: '+10% ataques físicos.', category: 'Boost', atkMult: 1.1 },
      { name: 'Wise Glasses', desc: '+10% ataques especiales.', category: 'Boost', spAtkMult: 1.1 },
      { name: 'Throat Spray', desc: '+1 SpA tras usar movimiento de sonido.', category: 'Boost' },
    ],
  },
  {
    label: 'Recuperación',
    items: [
      { name: 'Leftovers',    desc: 'Recupera 1/16 HP al final de cada turno.', category: 'Recuperación' },
      { name: 'Black Sludge', desc: '+1/16 HP para tipo Veneno. Daña a otros.', category: 'Recuperación' },
      { name: 'Shell Bell',   desc: 'Recupera 1/8 del daño causado.', category: 'Recuperación' },
      { name: 'Sitrus Berry', desc: 'Recupera 25% HP cuando cae al 50%.', category: 'Recuperación' },
    ],
  },
  {
    label: 'Protección',
    items: [
      { name: 'Focus Sash',       desc: 'Sobrevive 1 KO desde HP completo con 1 HP.', category: 'Protección' },
      { name: 'Rocky Helmet',     desc: 'Daña 1/6 HP al rival que ataca con contacto.', category: 'Protección' },
      { name: 'Eviolite',         desc: '+50% Def y DefEsp a Pokémon sin evolucionar.', category: 'Protección' },
      { name: 'Heavy-Duty Boots', desc: 'Ignora todas las trampas del campo.', category: 'Protección' },
      { name: 'Assault Vest',     desc: '+50% DefEsp. Solo puede usar movimientos de ataque.', category: 'Protección' },
      { name: 'Air Balloon',      desc: 'Inmune a movimientos Tierra hasta recibir daño.', category: 'Protección' },
      { name: 'Safety Goggles',   desc: 'Inmune a polvo/espora y al daño de clima.', category: 'Protección' },
      { name: 'Clear Amulet',     desc: 'Previene reducciones de stats por movimientos rivales.', category: 'Protección' },
      { name: 'Covert Cloak',     desc: 'Previene efectos secundarios de movimientos rivales.', category: 'Protección' },
      { name: 'Lum Berry',        desc: 'Cura cualquier condición de estado una vez.', category: 'Protección' },
    ],
  },
  {
    label: 'Terreno / Clima',
    items: [
      { name: 'Terrain Extender', desc: 'Extiende terrenos a 8 turnos.', category: 'Terreno' },
      { name: 'Light Clay',       desc: 'Extiende pantallas (Reflect/Light Screen) a 8 turnos.', category: 'Terreno' },
      { name: 'Heat Rock',        desc: 'Extiende Sol severo a 8 turnos.', category: 'Clima' },
      { name: 'Damp Rock',        desc: 'Extiende Lluvia intensa a 8 turnos.', category: 'Clima' },
      { name: 'Icy Rock',         desc: 'Extiende Granizo a 8 turnos.', category: 'Clima' },
      { name: 'Smooth Rock',      desc: 'Extiende Tormenta de arena a 8 turnos.', category: 'Clima' },
    ],
  },
  {
    label: 'Especiales',
    items: [
      { name: 'Booster Energy',  desc: 'Activa habilidad Paradoja sin clima/terreno favorable.', category: 'Especial' },
      { name: 'Mirror Herb',     desc: 'Copia el primer boost de stats del rival.', category: 'Especial' },
      { name: 'Loaded Dice',     desc: 'Movimientos multi-golpe siempre dan 4-5 impactos.', category: 'Especial' },
      { name: 'Punching Glove',  desc: '+10% golpes de puño. No hacen contacto.', category: 'Especial' },
      { name: 'Black Glasses',   desc: '+20% movimientos Siniestro.', category: 'Especial' },
      { name: 'Dragon Fang',     desc: '+20% movimientos Dragón.', category: 'Especial' },
      { name: 'Charcoal',        desc: '+20% movimientos Fuego.', category: 'Especial' },
      { name: 'Mystic Water',    desc: '+20% movimientos Agua.', category: 'Especial' },
      { name: 'Magnet',          desc: '+20% movimientos Eléctrico.', category: 'Especial' },
      { name: 'Sharp Beak',      desc: '+20% movimientos Volador.', category: 'Especial' },
      { name: 'Twisted Spoon',   desc: '+20% movimientos Psíquico.', category: 'Especial' },
      { name: 'Never-Melt Ice',  desc: '+20% movimientos Hielo.', category: 'Especial' },
      { name: 'Poison Barb',     desc: '+20% movimientos Veneno.', category: 'Especial' },
      { name: 'Silk Scarf',      desc: '+20% movimientos Normal.', category: 'Especial' },
      { name: 'Miracle Seed',    desc: '+20% movimientos Planta.', category: 'Especial' },
      { name: 'Soft Sand',       desc: '+20% movimientos Tierra.', category: 'Especial' },
      { name: 'Metal Coat',      desc: '+20% movimientos Acero.', category: 'Especial' },
      { name: 'Spell Tag',       desc: '+20% movimientos Fantasma.', category: 'Especial' },
      { name: 'Fairy Feather',   desc: '+20% movimientos Hada.', category: 'Especial' },
      { name: 'Fist Plate',      desc: '+20% movimientos Lucha.', category: 'Especial' },
    ],
  },
  {
    label: 'Mega Stones ◈',
    items: [
      // ── Kanto starters ──
      {
        name: 'Venusaurite', desc: 'Mega Venusaur — Planta/Veneno · Thick Fat', category: 'Mega',
        forPokemon: 'venusaur', megaTypes: ['grass','poison'], megaAbility: 'Thick Fat',
        megaStats: { hp: 80, attack: 100, defense: 123, spAttack: 122, spDefense: 120, speed: 80 },
      },
      {
        name: 'Charizardite X', desc: 'Mega Charizard X — Fuego/Dragón · Tough Claws', category: 'Mega',
        forPokemon: 'charizard', megaTypes: ['fire','dragon'], megaAbility: 'Tough Claws',
        megaStats: { hp: 78, attack: 130, defense: 111, spAttack: 130, spDefense: 85, speed: 100 },
      },
      {
        name: 'Charizardite Y', desc: 'Mega Charizard Y — Fuego/Volador · Drought', category: 'Mega',
        forPokemon: 'charizard', megaTypes: ['fire','flying'], megaAbility: 'Drought',
        megaStats: { hp: 78, attack: 104, defense: 78, spAttack: 159, spDefense: 115, speed: 100 },
      },
      {
        name: 'Blastoisinite', desc: 'Mega Blastoise — Agua · Mega Launcher', category: 'Mega',
        forPokemon: 'blastoise', megaTypes: ['water'], megaAbility: 'Mega Launcher',
        megaStats: { hp: 79, attack: 103, defense: 120, spAttack: 135, spDefense: 115, speed: 78 },
      },
      // ── Kanto ──
      {
        name: 'Beedrillite', desc: 'Mega Beedrill — Bicho/Veneno · Adaptability', category: 'Mega',
        forPokemon: 'beedrill', megaTypes: ['bug','poison'], megaAbility: 'Adaptability',
        megaStats: { hp: 65, attack: 150, defense: 40, spAttack: 15, spDefense: 80, speed: 145 },
      },
      {
        name: 'Pidgeotite', desc: 'Mega Pidgeot — Normal/Volador · No Guard', category: 'Mega',
        forPokemon: 'pidgeot', megaTypes: ['normal','flying'], megaAbility: 'No Guard',
        megaStats: { hp: 83, attack: 80, defense: 80, spAttack: 135, spDefense: 80, speed: 121 },
      },
      {
        name: 'Alakazite', desc: 'Mega Alakazam — Psíquico · Trace', category: 'Mega',
        forPokemon: 'alakazam', megaTypes: ['psychic'], megaAbility: 'Trace',
        megaStats: { hp: 55, attack: 50, defense: 65, spAttack: 175, spDefense: 95, speed: 150 },
      },
      {
        name: 'Slowbronite', desc: 'Mega Slowbro — Agua/Psíquico · Shell Armor', category: 'Mega',
        forPokemon: 'slowbro', megaTypes: ['water','psychic'], megaAbility: 'Shell Armor',
        megaStats: { hp: 95, attack: 75, defense: 180, spAttack: 130, spDefense: 80, speed: 30 },
      },
      {
        name: 'Gengarite', desc: 'Mega Gengar — Fantasma/Veneno · Shadow Tag', category: 'Mega',
        forPokemon: 'gengar', megaTypes: ['ghost','poison'], megaAbility: 'Shadow Tag',
        megaStats: { hp: 60, attack: 65, defense: 80, spAttack: 170, spDefense: 95, speed: 130 },
      },
      {
        name: 'Kangaskhanite', desc: 'Mega Kangaskhan — Normal · Parental Bond', category: 'Mega',
        forPokemon: 'kangaskhan', megaTypes: ['normal'], megaAbility: 'Parental Bond',
        megaStats: { hp: 105, attack: 125, defense: 100, spAttack: 60, spDefense: 100, speed: 100 },
      },
      {
        name: 'Pinsirite', desc: 'Mega Pinsir — Bicho/Volador · Aerilate', category: 'Mega',
        forPokemon: 'pinsir', megaTypes: ['bug','flying'], megaAbility: 'Aerilate',
        megaStats: { hp: 65, attack: 155, defense: 120, spAttack: 65, spDefense: 90, speed: 105 },
      },
      {
        name: 'Gyaradosite', desc: 'Mega Gyarados — Agua/Siniestro · Mold Breaker', category: 'Mega',
        forPokemon: 'gyarados', megaTypes: ['water','dark'], megaAbility: 'Mold Breaker',
        megaStats: { hp: 95, attack: 155, defense: 109, spAttack: 70, spDefense: 130, speed: 81 },
      },
      {
        name: 'Aerodactylite', desc: 'Mega Aerodactyl — Roca/Volador · Tough Claws', category: 'Mega',
        forPokemon: 'aerodactyl', megaTypes: ['rock','flying'], megaAbility: 'Tough Claws',
        megaStats: { hp: 80, attack: 135, defense: 85, spAttack: 70, spDefense: 95, speed: 150 },
      },
      {
        name: 'Mewtwonite X', desc: 'Mega Mewtwo X — Psíquico/Lucha · Steadfast', category: 'Mega',
        forPokemon: 'mewtwo', megaTypes: ['psychic','fighting'], megaAbility: 'Steadfast',
        megaStats: { hp: 106, attack: 190, defense: 100, spAttack: 154, spDefense: 100, speed: 130 },
      },
      {
        name: 'Mewtwonite Y', desc: 'Mega Mewtwo Y — Psíquico · Insomnia', category: 'Mega',
        forPokemon: 'mewtwo', megaTypes: ['psychic'], megaAbility: 'Insomnia',
        megaStats: { hp: 106, attack: 150, defense: 70, spAttack: 194, spDefense: 120, speed: 140 },
      },
      // ── Johto ──
      {
        name: 'Ampharosite', desc: 'Mega Ampharos — Eléctrico/Dragón · Mold Breaker', category: 'Mega',
        forPokemon: 'ampharos', megaTypes: ['electric','dragon'], megaAbility: 'Mold Breaker',
        megaStats: { hp: 90, attack: 95, defense: 105, spAttack: 165, spDefense: 110, speed: 45 },
      },
      {
        name: 'Steelixite', desc: 'Mega Steelix — Acero/Tierra · Sand Force', category: 'Mega',
        forPokemon: 'steelix', megaTypes: ['steel','ground'], megaAbility: 'Sand Force',
        megaStats: { hp: 75, attack: 125, defense: 230, spAttack: 55, spDefense: 95, speed: 30 },
      },
      {
        name: 'Scizorite', desc: 'Mega Scizor — Bicho/Acero · Technician', category: 'Mega',
        forPokemon: 'scizor', megaTypes: ['bug','steel'], megaAbility: 'Technician',
        megaStats: { hp: 70, attack: 150, defense: 140, spAttack: 65, spDefense: 100, speed: 75 },
      },
      {
        name: 'Heracronite', desc: 'Mega Heracross — Bicho/Lucha · Skill Link', category: 'Mega',
        forPokemon: 'heracross', megaTypes: ['bug','fighting'], megaAbility: 'Skill Link',
        megaStats: { hp: 80, attack: 185, defense: 115, spAttack: 40, spDefense: 105, speed: 75 },
      },
      {
        name: 'Houndoominite', desc: 'Mega Houndoom — Siniestro/Fuego · Solar Power', category: 'Mega',
        forPokemon: 'houndoom', megaTypes: ['dark','fire'], megaAbility: 'Solar Power',
        megaStats: { hp: 75, attack: 90, defense: 90, spAttack: 140, spDefense: 90, speed: 115 },
      },
      {
        name: 'Tyranitarite', desc: 'Mega Tyranitar — Roca/Siniestro · Sand Stream', category: 'Mega',
        forPokemon: 'tyranitar', megaTypes: ['rock','dark'], megaAbility: 'Sand Stream',
        megaStats: { hp: 100, attack: 164, defense: 150, spAttack: 95, spDefense: 120, speed: 71 },
      },
      // ── Hoenn starters ──
      {
        name: 'Sceptilite', desc: 'Mega Sceptile — Planta/Dragón · Lightning Rod', category: 'Mega',
        forPokemon: 'sceptile', megaTypes: ['grass','dragon'], megaAbility: 'Lightning Rod',
        megaStats: { hp: 70, attack: 110, defense: 75, spAttack: 145, spDefense: 85, speed: 145 },
      },
      {
        name: 'Blazikenite', desc: 'Mega Blaziken — Fuego/Lucha · Speed Boost', category: 'Mega',
        forPokemon: 'blaziken', megaTypes: ['fire','fighting'], megaAbility: 'Speed Boost',
        megaStats: { hp: 80, attack: 160, defense: 80, spAttack: 130, spDefense: 80, speed: 100 },
      },
      {
        name: 'Swampertite', desc: 'Mega Swampert — Agua/Tierra · Swift Swim', category: 'Mega',
        forPokemon: 'swampert', megaTypes: ['water','ground'], megaAbility: 'Swift Swim',
        megaStats: { hp: 100, attack: 150, defense: 110, spAttack: 95, spDefense: 110, speed: 70 },
      },
      // ── Hoenn ──
      {
        name: 'Gardevoirite', desc: 'Mega Gardevoir — Psíquico/Hada · Pixilate', category: 'Mega',
        forPokemon: 'gardevoir', megaTypes: ['psychic','fairy'], megaAbility: 'Pixilate',
        megaStats: { hp: 68, attack: 85, defense: 65, spAttack: 165, spDefense: 135, speed: 100 },
      },
      {
        name: 'Sablenite', desc: 'Mega Sableye — Siniestro/Fantasma · Magic Bounce', category: 'Mega',
        forPokemon: 'sableye', megaTypes: ['dark','ghost'], megaAbility: 'Magic Bounce',
        megaStats: { hp: 50, attack: 85, defense: 125, spAttack: 85, spDefense: 115, speed: 20 },
      },
      {
        name: 'Mawilite', desc: 'Mega Mawile — Acero/Hada · Huge Power', category: 'Mega',
        forPokemon: 'mawile', megaTypes: ['steel','fairy'], megaAbility: 'Huge Power',
        megaStats: { hp: 50, attack: 105, defense: 125, spAttack: 55, spDefense: 95, speed: 50 },
      },
      {
        name: 'Aggronite', desc: 'Mega Aggron — Acero · Filter (pierde tipo Roca)', category: 'Mega',
        forPokemon: 'aggron', megaTypes: ['steel'], megaAbility: 'Filter',
        megaStats: { hp: 70, attack: 140, defense: 230, spAttack: 60, spDefense: 80, speed: 50 },
      },
      {
        name: 'Medichamite', desc: 'Mega Medicham — Lucha/Psíquico · Pure Power', category: 'Mega',
        forPokemon: 'medicham', megaTypes: ['fighting','psychic'], megaAbility: 'Pure Power',
        megaStats: { hp: 60, attack: 100, defense: 85, spAttack: 80, spDefense: 85, speed: 100 },
      },
      {
        name: 'Manectite', desc: 'Mega Manectric — Eléctrico · Intimidate', category: 'Mega',
        forPokemon: 'manectric', megaTypes: ['electric'], megaAbility: 'Intimidate',
        megaStats: { hp: 70, attack: 75, defense: 80, spAttack: 135, spDefense: 80, speed: 135 },
      },
      {
        name: 'Sharpedonite', desc: 'Mega Sharpedo — Agua/Siniestro · Strong Jaw', category: 'Mega',
        forPokemon: 'sharpedo', megaTypes: ['water','dark'], megaAbility: 'Strong Jaw',
        megaStats: { hp: 70, attack: 140, defense: 70, spAttack: 110, spDefense: 65, speed: 105 },
      },
      {
        name: 'Cameruptite', desc: 'Mega Camerupt — Fuego/Tierra · Sheer Force', category: 'Mega',
        forPokemon: 'camerupt', megaTypes: ['fire','ground'], megaAbility: 'Sheer Force',
        megaStats: { hp: 70, attack: 120, defense: 100, spAttack: 145, spDefense: 105, speed: 20 },
      },
      {
        name: 'Altarianite', desc: 'Mega Altaria — Dragón/Hada · Pixilate (pierde Volador)', category: 'Mega',
        forPokemon: 'altaria', megaTypes: ['dragon','fairy'], megaAbility: 'Pixilate',
        megaStats: { hp: 75, attack: 110, defense: 110, spAttack: 110, spDefense: 105, speed: 80 },
      },
      {
        name: 'Banettite', desc: 'Mega Banette — Fantasma · Prankster', category: 'Mega',
        forPokemon: 'banette', megaTypes: ['ghost'], megaAbility: 'Prankster',
        megaStats: { hp: 64, attack: 165, defense: 75, spAttack: 93, spDefense: 83, speed: 75 },
      },
      {
        name: 'Absolite', desc: 'Mega Absol — Siniestro · Magic Bounce', category: 'Mega',
        forPokemon: 'absol', megaTypes: ['dark'], megaAbility: 'Magic Bounce',
        megaStats: { hp: 65, attack: 150, defense: 60, spAttack: 115, spDefense: 60, speed: 115 },
      },
      {
        name: 'Glalitite', desc: 'Mega Glalie — Hielo · Refrigerate', category: 'Mega',
        forPokemon: 'glalie', megaTypes: ['ice'], megaAbility: 'Refrigerate',
        megaStats: { hp: 80, attack: 120, defense: 80, spAttack: 120, spDefense: 80, speed: 100 },
      },
      {
        name: 'Salamencite', desc: 'Mega Salamence — Dragón/Volador · Aerilate', category: 'Mega',
        forPokemon: 'salamence', megaTypes: ['dragon','flying'], megaAbility: 'Aerilate',
        megaStats: { hp: 95, attack: 145, defense: 130, spAttack: 120, spDefense: 90, speed: 120 },
      },
      {
        name: 'Metagrossite', desc: 'Mega Metagross — Acero/Psíquico · Tough Claws', category: 'Mega',
        forPokemon: 'metagross', megaTypes: ['steel','psychic'], megaAbility: 'Tough Claws',
        megaStats: { hp: 80, attack: 145, defense: 150, spAttack: 105, spDefense: 110, speed: 110 },
      },
      {
        name: 'Latiasite', desc: 'Mega Latias — Dragón/Psíquico · Levitate', category: 'Mega',
        forPokemon: 'latias', megaTypes: ['dragon','psychic'], megaAbility: 'Levitate',
        megaStats: { hp: 80, attack: 100, defense: 120, spAttack: 140, spDefense: 150, speed: 110 },
      },
      {
        name: 'Latiosite', desc: 'Mega Latios — Dragón/Psíquico · Levitate', category: 'Mega',
        forPokemon: 'latios', megaTypes: ['dragon','psychic'], megaAbility: 'Levitate',
        megaStats: { hp: 80, attack: 130, defense: 100, spAttack: 160, spDefense: 120, speed: 110 },
      },
      // ── Sinnoh ──
      {
        name: 'Lopunnite', desc: 'Mega Lopunny — Normal/Lucha · Scrappy', category: 'Mega',
        forPokemon: 'lopunny', megaTypes: ['normal','fighting'], megaAbility: 'Scrappy',
        megaStats: { hp: 65, attack: 136, defense: 94, spAttack: 54, spDefense: 96, speed: 135 },
      },
      {
        name: 'Garchompite', desc: 'Mega Garchomp — Dragón/Tierra · Sand Force', category: 'Mega',
        forPokemon: 'garchomp', megaTypes: ['dragon','ground'], megaAbility: 'Sand Force',
        megaStats: { hp: 108, attack: 170, defense: 115, spAttack: 120, spDefense: 95, speed: 92 },
      },
      {
        name: 'Lucarionite', desc: 'Mega Lucario — Lucha/Acero · Adaptability', category: 'Mega',
        forPokemon: 'lucario', megaTypes: ['fighting','steel'], megaAbility: 'Adaptability',
        megaStats: { hp: 70, attack: 145, defense: 88, spAttack: 140, spDefense: 70, speed: 112 },
      },
      {
        name: 'Abomasite', desc: 'Mega Abomasnow — Planta/Hielo · Snow Warning', category: 'Mega',
        forPokemon: 'abomasnow', megaTypes: ['grass','ice'], megaAbility: 'Snow Warning',
        megaStats: { hp: 90, attack: 132, defense: 105, spAttack: 132, spDefense: 105, speed: 30 },
      },
      // ── Unova ──
      {
        name: 'Galladite', desc: 'Mega Gallade — Psíquico/Lucha · Inner Focus', category: 'Mega',
        forPokemon: 'gallade', megaTypes: ['psychic','fighting'], megaAbility: 'Inner Focus',
        megaStats: { hp: 68, attack: 165, defense: 95, spAttack: 65, spDefense: 115, speed: 110 },
      },
      {
        name: 'Audinite', desc: 'Mega Audino — Normal/Hada · Healer', category: 'Mega',
        forPokemon: 'audino', megaTypes: ['normal','fairy'], megaAbility: 'Healer',
        megaStats: { hp: 103, attack: 60, defense: 126, spAttack: 80, spDefense: 126, speed: 50 },
      },
      // ── Kalos ──
      {
        name: 'Diancite', desc: 'Mega Diancie — Roca/Hada · Magic Bounce', category: 'Mega',
        forPokemon: 'diancie', megaTypes: ['rock','fairy'], megaAbility: 'Magic Bounce',
        megaStats: { hp: 50, attack: 160, defense: 110, spAttack: 160, spDefense: 110, speed: 110 },
      },
      // ── Champions exclusive ──
      {
        name: 'Greninjaite', desc: 'Mega Greninja — Agua/Siniestro · Protean', category: 'Mega',
        forPokemon: 'greninja', megaTypes: ['water','dark'], megaAbility: 'Protean',
        megaStats: { hp: 72, attack: 145, defense: 80, spAttack: 153, spDefense: 80, speed: 132 },
      },
    ],
  },
]

export const ALL_ITEMS: Item[] = ITEM_CATEGORIES.flatMap(c => c.items)

export const MEGA_STONES: Item[] = ALL_ITEMS.filter(i => i.category === 'Mega')

export function findItem(name: string): Item | undefined {
  return ALL_ITEMS.find(i => i.name === name)
}

export function getMegaTypes(itemName: string): string[] | null {
  return findItem(itemName)?.megaTypes ?? null
}

export function getMegaStats(itemName: string): Partial<PokemonStats> | null {
  return findItem(itemName)?.megaStats ?? null
}

export function isMegaStone(itemName?: string): boolean {
  if (!itemName) return false
  return !!findItem(itemName)?.megaTypes
}

export function getEffectiveSpeed(
  baseSpeed: number,
  sp: number,
  item?: string,
  natureMult: number = 1
): number {
  const withNature = Math.floor((baseSpeed + sp) * natureMult)
  const found = item ? findItem(item) : undefined
  return found?.speedMult ? Math.floor(withNature * found.speedMult) : withNature
}
