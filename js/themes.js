/* ==========================================================================
   CELEBRATI — THEME DEFINITIONS & APPLICATOR MODULE (12+ Premium Themes)
   ========================================================================== */

export const THEMES = {
  'theme-royal': {
    id: 'theme-royal',
    name: '👑 Royal Solitaire',
    category: 'general-premium',
    categoryLabel: 'General Premium',
    description: 'Burgundy & Rose Gold — Luxury Weddings, Nikkah & Royal Celebrations',
    primaryColor: '#E5A965',
    bgPreview: '#2B0910',
    swatches: ['#3D0F1A', '#E5A965', '#FFF5EA', '#1F060B'],
    particleType: 'petals',
    layoutType: 'classic',
    openingType: 'envelope'
  },
  'theme-midnight': {
    id: 'theme-midnight',
    name: '🌌 Midnight Luxe',
    category: 'general-premium',
    categoryLabel: 'General Premium',
    description: 'Deep Emerald & Gold Foil — Galas, VIP Evenings & Milestone Birthdays',
    primaryColor: '#D4AF37',
    bgPreview: '#061811',
    swatches: ['#061811', '#D4AF37', '#F0FDF4', '#0F172A'],
    particleType: 'gold-dust',
    layoutType: 'editorial',
    openingType: 'chapel-veil'
  },
  'theme-velvet': {
    id: 'theme-velvet',
    name: '🍸 Velvet Noir',
    category: 'general-premium',
    categoryLabel: 'General Premium',
    description: 'Dark Obsidian & Champagne Glow — VIP Cocktails & Corporate Launches',
    primaryColor: '#FFD700',
    bgPreview: '#0A0A0F',
    swatches: ['#0A0A0F', '#FFD700', '#FFFFFF', '#161622'],
    particleType: 'gold-dust',
    layoutType: 'modern',
    openingType: 'editorial-reveal'
  },
  'theme-celestial': {
    id: 'theme-celestial',
    name: '🌸 Celestial Romance',
    category: 'wedding-christian',
    categoryLabel: 'Christian Wedding',
    description: 'Blush, Lavender & Pearl — Dreamy Engagements & Sweet Celebrations',
    primaryColor: '#E2C0EE',
    bgPreview: '#1A1325',
    swatches: ['#1A1325', '#E2C0EE', '#FAF5FF', '#291B3A'],
    particleType: 'stars',
    layoutType: 'editorial',
    openingType: 'chapel-veil'
  },
  'theme-chapel-white': {
    id: 'theme-chapel-white',
    name: '🕊️ Chapel White & Silver',
    category: 'wedding-christian',
    categoryLabel: 'Christian Wedding',
    description: 'Pure White, Ivory & Silver Metallic — Timeless Cathedral Weddings',
    primaryColor: '#CBD5E1',
    bgPreview: '#0F172A',
    swatches: ['#0F172A', '#E2E8F0', '#FFFFFF', '#334155'],
    particleType: 'stars',
    layoutType: 'editorial',
    openingType: 'chapel-veil'
  },
  'theme-hindu-mandala': {
    id: 'theme-hindu-mandala',
    name: '🪔 Saffron & Crimson Gold',
    category: 'wedding-hindu',
    categoryLabel: 'Hindu Wedding',
    description: 'Vibrant Saffron, Deep Crimson & Gold — Sacred Vivah Ceremonies',
    primaryColor: '#FF9933',
    bgPreview: '#5A180E',
    swatches: ['#5A180E', '#FF9933', '#FFD700', '#FFFFFF'],
    particleType: 'petals',
    layoutType: 'classic',
    openingType: 'petal-scroll'
  },
  'theme-marigold-baraat': {
    id: 'theme-marigold-baraat',
    name: '🌺 Marigold Baraat',
    category: 'wedding-hindu',
    categoryLabel: 'Hindu Wedding',
    description: 'Turmeric Yellow, Saffron & Gold — Sangeet, Mehendi & Vibrant Haldi',
    primaryColor: '#FFC107',
    bgPreview: '#4A1208',
    swatches: ['#4A1208', '#FFC107', '#E65100', '#FFF8E1'],
    particleType: 'petals',
    layoutType: 'modern',
    openingType: 'petal-scroll'
  },
  'theme-muslim-emerald': {
    id: 'theme-muslim-emerald',
    name: '🕌 Emerald Elegance',
    category: 'wedding-muslim',
    categoryLabel: 'Muslim Nikkah',
    description: 'Rich Emerald & Geometric Gold — Traditional Nikkah & Royal Walima',
    primaryColor: '#50C878',
    bgPreview: '#004B23',
    swatches: ['#004B23', '#50C878', '#D4AF37', '#F0FFF0'],
    particleType: 'stars',
    layoutType: 'classic',
    openingType: 'crescent-reveal'
  },
  'theme-desert-rose': {
    id: 'theme-desert-rose',
    name: '🌙 Desert Rose Nikkah',
    category: 'wedding-muslim',
    categoryLabel: 'Muslim Nikkah',
    description: 'Dusty Rose, Metallic Bronze & Gold Crescent — Elegant Royal Banquets',
    primaryColor: '#F4A261',
    bgPreview: '#2B1E2A',
    swatches: ['#2B1E2A', '#F4A261', '#E76F51', '#FFF1E6'],
    particleType: 'gold-dust',
    layoutType: 'editorial',
    openingType: 'crescent-reveal'
  },
  'theme-sikh-ivory': {
    id: 'theme-sikh-ivory',
    name: '🗡️ Ivory & Royal Anand Karaj',
    category: 'wedding-sikh',
    categoryLabel: 'Sikh Wedding',
    description: 'Ivory White, Royal Blue & Gold Accents — Sacred Anand Karaj Union',
    primaryColor: '#3B82F6',
    bgPreview: '#0B192C',
    swatches: ['#0B192C', '#3B82F6', '#F59E0B', '#F8FAFC'],
    particleType: 'gold-dust',
    layoutType: 'classic',
    openingType: 'crescent-reveal'
  },
  'theme-neon-party': {
    id: 'theme-neon-party',
    name: '🎊 Neon Luxe Birthday Gala',
    category: 'birthday-party',
    categoryLabel: 'Birthday & Party',
    description: 'Electric Cyan, Violet & Neon Magenta — Milestone 30th/50th Gala',
    primaryColor: '#EC4899',
    bgPreview: '#111827',
    swatches: ['#111827', '#EC4899', '#06B6D4', '#F472B6'],
    particleType: 'stars',
    layoutType: 'modern',
    openingType: 'confetti-burst'
  },
  'theme-gala-corporate': {
    id: 'theme-gala-corporate',
    name: '🏢 Platinum Corporate Gala',
    category: 'corporate',
    categoryLabel: 'Corporate & Tech',
    description: 'Slate Black, Metallic Silver & Deep Teal — Award Nights & Product Launches',
    primaryColor: '#38BDF8',
    bgPreview: '#0F172A',
    swatches: ['#0F172A', '#38BDF8', '#94A3B8', '#F8FAFC'],
    particleType: 'gold-dust',
    layoutType: 'modern',
    openingType: 'editorial-reveal'
  },
  'theme-italiana-vogue': {
    id: 'theme-italiana-vogue',
    name: '🇮🇹 Italiana High-Fashion Vogue',
    category: 'general-premium',
    categoryLabel: 'General Premium',
    description: 'Italiana Serif & Montserrat Pair — Ultra-Chic High-Fashion & Milan Luxury Celebrations',
    primaryColor: '#E2B871',
    bgPreview: '#141118',
    swatches: ['#141118', '#E2B871', '#F7F3E9', '#2E2338'],
    particleType: 'gold-dust',
    layoutType: 'editorial',
    openingType: 'editorial-reveal'
  },
  'theme-pearl-ivory': {
    id: 'theme-pearl-ivory',
    name: '🪷 Pearl Ivory',
    category: 'general-premium',
    categoryLabel: 'General Premium',
    description: 'Ivory, Champagne Gold & Warm Charcoal — Light Luxury Stationery for Refined Celebrations',
    primaryColor: '#B8860B',
    bgPreview: '#F5E6C0',
    swatches: ['#FBF5E9', '#B8860B', '#1F0E04', '#F0D88A'],
    particleType: 'gold-dust',
    layoutType: 'classic',
    openingType: 'envelope',
    lightEnvelope: true
  }
};

export function applyTheme(elementOrSelector, themeId) {
  const target = typeof elementOrSelector === 'string' 
    ? document.querySelector(elementOrSelector) 
    : elementOrSelector;

  if (!target) return;

  // Remove existing theme classes
  Object.keys(THEMES).forEach(cls => target.classList.remove(cls));

  const validTheme = THEMES[themeId] ? themeId : 'theme-royal';
  target.classList.add(validTheme);

  // Toggle light envelope mode on the overlay if this theme requires it
  const overlay = document.getElementById('envelope-opener-overlay');
  if (overlay) {
    const isLight = THEMES[validTheme]?.lightEnvelope === true;
    overlay.classList.toggle('env-light-mode', isLight);
  }
  
  return THEMES[validTheme];
}
