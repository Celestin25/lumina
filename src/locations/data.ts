export interface CountryLocation {
  country: string;
  code: string; // ISO 3166-1 alpha-2, used to render the flag emoji
  cities: string[];
}

export interface Region {
  name: string;
  icon: string;
  locations: CountryLocation[];
}

export const regions: Region[] = [
  {
    name: "Africa",
    icon: "🌍",
    locations: [
      { country: "Nigeria", code: "NG", cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"] },
      { country: "South Africa", code: "ZA", cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria"] },
      { country: "Kenya", code: "KE", cities: ["Nairobi", "Mombasa", "Kisumu"] },
      { country: "Egypt", code: "EG", cities: ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh"] },
      { country: "Morocco", code: "MA", cities: ["Casablanca", "Rabat", "Marrakesh", "Tangier"] },
      { country: "Ghana", code: "GH", cities: ["Accra", "Kumasi", "Takoradi"] },
      { country: "Ethiopia", code: "ET", cities: ["Addis Ababa", "Dire Dawa"] },
      { country: "Tanzania", code: "TZ", cities: ["Dar es Salaam", "Dodoma", "Zanzibar City", "Arusha"] },
      { country: "Uganda", code: "UG", cities: ["Kampala", "Entebbe", "Jinja"] },
      { country: "Rwanda", code: "RW", cities: ["Kigali", "Musanze", "Rubavu"] },
      { country: "Burundi", code: "BI", cities: ["Bujumbura", "Gitega"] },
      { country: "Senegal", code: "SN", cities: ["Dakar", "Saint-Louis"] },
      { country: "Ivory Coast", code: "CI", cities: ["Abidjan", "Yamoussoukro"] },
      { country: "Algeria", code: "DZ", cities: ["Algiers", "Oran"] },
      { country: "Tunisia", code: "TN", cities: ["Tunis", "Sousse", "Sfax"] },
      { country: "Cameroon", code: "CM", cities: ["Douala", "Yaoundé"] },
      { country: "DR Congo", code: "CD", cities: ["Kinshasa", "Lubumbashi", "Goma"] },
      { country: "Zambia", code: "ZM", cities: ["Lusaka", "Kitwe", "Livingstone"] },
      { country: "Zimbabwe", code: "ZW", cities: ["Harare", "Bulawayo", "Victoria Falls"] },
      { country: "Botswana", code: "BW", cities: ["Gaborone", "Francistown"] },
      { country: "Namibia", code: "NA", cities: ["Windhoek", "Swakopmund"] },
      { country: "Mozambique", code: "MZ", cities: ["Maputo", "Beira"] },
      { country: "Angola", code: "AO", cities: ["Luanda", "Lubango"] },
      { country: "Mauritius", code: "MU", cities: ["Port Louis", "Grand Baie"] },
      { country: "Seychelles", code: "SC", cities: ["Victoria", "Beau Vallon"] },
    ],
  },
  {
    name: "Europe",
    icon: "🇪🇺",
    locations: [
      { country: "United Kingdom", code: "GB", cities: ["London", "Manchester", "Birmingham", "Edinburgh"] },
      { country: "France", code: "FR", cities: ["Paris", "Nice", "Lyon", "Marseille", "Cannes"] },
      { country: "Italy", code: "IT", cities: ["Milan", "Rome", "Venice", "Florence", "Naples"] },
      { country: "Spain", code: "ES", cities: ["Barcelona", "Madrid", "Ibiza", "Marbella", "Valencia"] },
      { country: "Germany", code: "DE", cities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne"] },
      { country: "Netherlands", code: "NL", cities: ["Amsterdam", "Rotterdam", "The Hague"] },
      { country: "Belgium", code: "BE", cities: ["Brussels", "Antwerp", "Ghent"] },
      { country: "Switzerland", code: "CH", cities: ["Zurich", "Geneva", "Basel"] },
      { country: "Austria", code: "AT", cities: ["Vienna", "Salzburg", "Innsbruck"] },
      { country: "Portugal", code: "PT", cities: ["Lisbon", "Porto", "Faro"] },
      { country: "Greece", code: "GR", cities: ["Athens", "Thessaloniki", "Mykonos", "Santorini"] },
      { country: "Sweden", code: "SE", cities: ["Stockholm", "Gothenburg", "Malmö"] },
      { country: "Norway", code: "NO", cities: ["Oslo", "Bergen"] },
      { country: "Denmark", code: "DK", cities: ["Copenhagen", "Aarhus"] },
      { country: "Finland", code: "FI", cities: ["Helsinki", "Tampere"] },
      { country: "Ireland", code: "IE", cities: ["Dublin", "Cork", "Galway"] },
      { country: "Poland", code: "PL", cities: ["Warsaw", "Kraków", "Wrocław", "Gdańsk"] },
      { country: "Czech Republic", code: "CZ", cities: ["Prague", "Brno"] },
      { country: "Hungary", code: "HU", cities: ["Budapest", "Debrecen"] },
      { country: "Romania", code: "RO", cities: ["Bucharest", "Cluj-Napoca", "Timișoara"] },
      { country: "Bulgaria", code: "BG", cities: ["Sofia", "Plovdiv", "Varna"] },
      { country: "Ukraine", code: "UA", cities: ["Kyiv", "Lviv", "Odesa"] },
      { country: "Serbia", code: "RS", cities: ["Belgrade", "Novi Sad"] },
      { country: "Croatia", code: "HR", cities: ["Zagreb", "Split", "Dubrovnik"] },
      { country: "Slovakia", code: "SK", cities: ["Bratislava", "Košice"] },
      { country: "Slovenia", code: "SI", cities: ["Ljubljana", "Maribor"] },
      { country: "Lithuania", code: "LT", cities: ["Vilnius", "Kaunas"] },
      { country: "Latvia", code: "LV", cities: ["Riga", "Jūrmala"] },
      { country: "Estonia", code: "EE", cities: ["Tallinn", "Tartu"] },
      { country: "Moldova", code: "MD", cities: ["Chișinău"] },
      { country: "Albania", code: "AL", cities: ["Tirana", "Durrës"] },
      { country: "North Macedonia", code: "MK", cities: ["Skopje"] },
      { country: "Bosnia and Herzegovina", code: "BA", cities: ["Sarajevo", "Banja Luka"] },
      { country: "Montenegro", code: "ME", cities: ["Podgorica", "Budva"] },
      { country: "Iceland", code: "IS", cities: ["Reykjavík"] },
      { country: "Luxembourg", code: "LU", cities: ["Luxembourg City"] },
      { country: "Malta", code: "MT", cities: ["Valletta", "St. Julian's"] },
      { country: "Cyprus", code: "CY", cities: ["Nicosia", "Limassol", "Ayia Napa"] },
    ],
  },
  {
    name: "North America",
    icon: "🌎",
    locations: [
      { country: "United States", code: "US", cities: ["New York", "Los Angeles", "Miami", "Chicago", "Las Vegas", "Houston", "Atlanta", "San Francisco"] },
      { country: "Canada", code: "CA", cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"] },
      { country: "Mexico", code: "MX", cities: ["Mexico City", "Cancún", "Guadalajara", "Tijuana"] },
    ],
  },
  {
    name: "Latin America & Caribbean",
    icon: "🌴",
    locations: [
      { country: "Brazil", code: "BR", cities: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"] },
      { country: "Argentina", code: "AR", cities: ["Buenos Aires", "Córdoba", "Mendoza"] },
      { country: "Colombia", code: "CO", cities: ["Bogotá", "Medellín", "Cartagena", "Cali"] },
      { country: "Chile", code: "CL", cities: ["Santiago", "Valparaíso"] },
      { country: "Peru", code: "PE", cities: ["Lima", "Cusco"] },
      { country: "Venezuela", code: "VE", cities: ["Caracas", "Maracaibo"] },
      { country: "Ecuador", code: "EC", cities: ["Quito", "Guayaquil"] },
      { country: "Uruguay", code: "UY", cities: ["Montevideo", "Punta del Este"] },
      { country: "Paraguay", code: "PY", cities: ["Asunción"] },
      { country: "Bolivia", code: "BO", cities: ["La Paz", "Santa Cruz"] },
      { country: "Panama", code: "PA", cities: ["Panama City"] },
      { country: "Costa Rica", code: "CR", cities: ["San José", "Jacó"] },
      { country: "Dominican Republic", code: "DO", cities: ["Santo Domingo", "Punta Cana", "Santiago"] },
      { country: "Cuba", code: "CU", cities: ["Havana", "Varadero"] },
      { country: "Jamaica", code: "JM", cities: ["Kingston", "Montego Bay"] },
      { country: "Puerto Rico", code: "PR", cities: ["San Juan"] },
      { country: "Trinidad and Tobago", code: "TT", cities: ["Port of Spain"] },
      { country: "Guatemala", code: "GT", cities: ["Guatemala City"] },
    ],
  },
  {
    name: "Asia",
    icon: "🌏",
    locations: [
      { country: "Japan", code: "JP", cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama"] },
      { country: "China", code: "CN", cities: ["Shanghai", "Beijing", "Shenzhen", "Guangzhou"] },
      { country: "South Korea", code: "KR", cities: ["Seoul", "Busan", "Incheon"] },
      { country: "India", code: "IN", cities: ["Mumbai", "Delhi", "Bangalore", "Goa", "Hyderabad"] },
      { country: "Thailand", code: "TH", cities: ["Bangkok", "Pattaya", "Phuket", "Chiang Mai"] },
      { country: "Philippines", code: "PH", cities: ["Manila", "Cebu City", "Angeles City", "Davao"] },
      { country: "Indonesia", code: "ID", cities: ["Jakarta", "Bali", "Surabaya"] },
      { country: "Malaysia", code: "MY", cities: ["Kuala Lumpur", "Penang", "Johor Bahru"] },
      { country: "Singapore", code: "SG", cities: ["Singapore"] },
      { country: "Vietnam", code: "VN", cities: ["Ho Chi Minh City", "Hanoi", "Da Nang"] },
      { country: "Cambodia", code: "KH", cities: ["Phnom Penh", "Siem Reap"] },
      { country: "Hong Kong", code: "HK", cities: ["Hong Kong"] },
      { country: "Taiwan", code: "TW", cities: ["Taipei", "Kaohsiung"] },
      { country: "Sri Lanka", code: "LK", cities: ["Colombo", "Kandy"] },
      { country: "Bangladesh", code: "BD", cities: ["Dhaka", "Chittagong"] },
      { country: "Pakistan", code: "PK", cities: ["Karachi", "Lahore", "Islamabad"] },
      { country: "Nepal", code: "NP", cities: ["Kathmandu", "Pokhara"] },
      { country: "Kazakhstan", code: "KZ", cities: ["Almaty", "Astana"] },
      { country: "Uzbekistan", code: "UZ", cities: ["Tashkent", "Samarkand"] },
      { country: "Mongolia", code: "MN", cities: ["Ulaanbaatar"] },
    ],
  },
  {
    name: "Middle East",
    icon: "🕌",
    locations: [
      { country: "UAE", code: "AE", cities: ["Dubai", "Abu Dhabi", "Sharjah"] },
      { country: "Saudi Arabia", code: "SA", cities: ["Riyadh", "Jeddah", "Dammam"] },
      { country: "Qatar", code: "QA", cities: ["Doha"] },
      { country: "Kuwait", code: "KW", cities: ["Kuwait City"] },
      { country: "Bahrain", code: "BH", cities: ["Manama"] },
      { country: "Oman", code: "OM", cities: ["Muscat", "Salalah"] },
      { country: "Israel", code: "IL", cities: ["Tel Aviv", "Jerusalem", "Haifa"] },
      { country: "Jordan", code: "JO", cities: ["Amman", "Aqaba"] },
      { country: "Lebanon", code: "LB", cities: ["Beirut", "Jounieh"] },
      { country: "Turkey", code: "TR", cities: ["Istanbul", "Ankara", "Antalya", "Izmir"] },
      { country: "Iraq", code: "IQ", cities: ["Baghdad", "Erbil", "Basra"] },
      { country: "Azerbaijan", code: "AZ", cities: ["Baku"] },
      { country: "Armenia", code: "AM", cities: ["Yerevan"] },
      { country: "Georgia", code: "GE", cities: ["Tbilisi", "Batumi"] },
    ],
  },
  {
    name: "Oceania",
    icon: "🏝️",
    locations: [
      { country: "Australia", code: "AU", cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Gold Coast"] },
      { country: "New Zealand", code: "NZ", cities: ["Auckland", "Wellington", "Christchurch"] },
      { country: "Fiji", code: "FJ", cities: ["Suva", "Nadi"] },
    ],
  },
];

// Every country across all regions, flattened
export const allLocations: CountryLocation[] = regions.flatMap((r) => r.locations);

// Convert an ISO alpha-2 code to its flag emoji (e.g. "RW" -> 🇷🇼)
export function flagFromCode(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const countryCodeMap: Record<string, string> = Object.fromEntries(
  allLocations.map((l) => [l.country, l.code])
);

export function countryFlag(country: string): string {
  const code = countryCodeMap[country];
  return code ? flagFromCode(code) : "📍";
}

export function citiesForCountry(country: string): string[] {
  return allLocations.find((l) => l.country === country)?.cities || [];
}

// Backwards-compatible exports (used by the admin seed route)
export const africanLocations: CountryLocation[] =
  regions.find((r) => r.name === "Africa")?.locations || [];

export const worldLocations: CountryLocation[] = allLocations.filter(
  (l) => !africanLocations.includes(l)
);

export const servicesList = [
  "Dinner Date", "Travel Companion", "Event Host", "VIP Party",
  "City Guide", "Translation", "Art Curator", "Personal shopper",
  "Cocktail Party", "Business Dinner", "Red Carpet"
];

export const modelNames = [
  "Layla", "Amara", "Zahara", "Nia", "Imani", "Amina", "Eshe", "Zola", "Keyara", "Sienna", // African/Black
  "Elena", "Sophia", "Isabella", "Sophie", "Chloe", "Emma", "Olivia", "Ava", "Mia", "Lily", // Western
  "Yuki", "Hana", "Mei", "Zara", "Yasmin", "Fatima", "Noor", "Aisha", "Mariam", "Leila", // Asian/Arab
  "Valentina", "Camila", "Luna", "Sofia", "Isabella", "Gabriela", "Carmen", "Maria", "Rosa", "Lucia" // Latina
];

export const bios = [
  "Sophisticated companion for elite events using my extensive knowledge of art and culture.",
  "Charming and witty, perfect for business dinners or casual outings.",
  "Elegant and refined, I specialize in making your evenings unforgettable.",
  "Adventurous spirit with a love for travel and new experiences.",
  "Professional model and hostess, ensuring you always have the perfect plus-one.",
  "Cultured and multilingual, capable of engaging in any conversation.",
  "Fashion-forward and life of the party.",
  "Quiet confidence and stunning beauty for your most important occasions.",
];

export const photoUrls = [
  // Diverse & Realistic (No Duplicates)
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2787&auto=format&fit=crop", // Black
  "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=2787&auto=format&fit=crop", // Arab/Middle Eastern
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=2787&auto=format&fit=crop", // Mixed/Curly
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2787&auto=format&fit=crop", // Asian
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=2787&auto=format&fit=crop", // Latina
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop", // Latina/Mixed
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop", // White/Brunette
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop", // Black/Natural Hair
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop", // White/Blonde
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2787&auto=format&fit=crop", // White/Fashion
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop", // European
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2787&auto=format&fit=crop", // Eastern European
  "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?q=80&w=2560&auto=format&fit=crop", // Mixed
  "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=2787&auto=format&fit=crop", // Arab/North African
  "https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?q=80&w=2787&auto=format&fit=crop", // Latina
  "https://images.unsplash.com/photo-1526382551041-3c8172c91a0c?q=80&w=2787&auto=format&fit=crop", // Black/Elegant
  "https://images.unsplash.com/photo-1531746430391-7f99f1faaeac?q=80&w=2550&auto=format&fit=crop", // Asian/Fashion
  "https://images.unsplash.com/photo-1520110120835-c96534a4c984?q=80&w=2787&auto=format&fit=crop", // African
  "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2787&auto=format&fit=crop", // Mixed/Fashion
  "https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?q=80&w=2487&auto=format&fit=crop"  // White/Elegant
];
