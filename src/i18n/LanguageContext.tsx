"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ru';

interface Translations {
  [key: string]: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    login: "Log In",
    createAccount: "Create Free Account",
    searchPlaceholder: "Search models, countries, services...",
    allCategories: "All Categories",
    girls: "Girls",
    couples: "Couples",
    guys: "Guys",
    trans: "Trans",
    home: "Home",
    photos: "Photos",
    featured: "Featured Models",
    favorites: "My Favorites",
    messages: "Messages",
    recent: "Recently Viewed",
    live: "LIVE",
    topModels: "Top Models",
    about: "About Lumina",
    support: "Support & FAQ",
    footerDesc: "Lumina is the world's ultimate 18+ LIVE adult entertainment destination for real connection and adult play. Every day, thousands of real people go live and stream online their most intimate moments. You can enjoy high-quality webcam sex live shows with stunning performers from around the world. Many users love the thrill of live sex cam broadcasts featuring fully nude and naked performers. Live sex chat allows you to connect and interact with models in real time. In the live cam sex section, you'll find a huge variety of hot video performances. Livesex shows are completely unscripted and highly engaging."
  },
  es: {
    login: "Iniciar sesión",
    createAccount: "Crear cuenta gratis",
    searchPlaceholder: "Buscar modelos, países, servicios...",
    allCategories: "Todas las categorías",
    girls: "Chicas",
    couples: "Parejas",
    guys: "Chicos",
    trans: "Trans",
    home: "Inicio",
    photos: "Fotos",
    featured: "Modelos destacadas",
    favorites: "Mis favoritos",
    messages: "Mensajes",
    recent: "Vistos recientemente",
    live: "EN VIVO",
    topModels: "Mejores modelos",
    about: "Sobre Lumina",
    support: "Soporte y preguntas",
    footerDesc: "Lumina es el destino definitivo de entretenimiento para adultos en VIVO +18 para conexión real y juego para adultos. Todos los días, miles de personas reales transmiten en vivo sus momentos más íntimos. Puedes disfrutar de shows en vivo de sexo por cámara de alta calidad con artistas impresionantes de todo el mundo."
  },
  fr: {
    login: "Se connecter",
    createAccount: "Créer un compte",
    searchPlaceholder: "Rechercher des modèles, des pays...",
    allCategories: "Toutes les catégories",
    girls: "Filles",
    couples: "Couples",
    guys: "Garçons",
    trans: "Trans",
    home: "Accueil",
    photos: "Photos",
    featured: "Modèles en vedette",
    favorites: "Mes favoris",
    messages: "Messages",
    recent: "Vus récemment",
    live: "EN DIRECT",
    about: "À propos de Lumina",
    support: "Support et FAQ",
    footerDesc: "Lumina est la destination de divertissement pour adultes en direct ultime pour une connexion réelle et des jeux pour adultes. Chaque jour, des milliers de personnes réelles diffusent en direct leurs moments les plus intimes."
  },
  de: {
    login: "Anmelden",
    createAccount: "Konto erstellen",
    searchPlaceholder: "Suche Modelle, Länder...",
    allCategories: "Alle Kategorien",
    girls: "Mädchen",
    couples: "Paare",
    guys: "Jungs",
    trans: "Trans",
    home: "Startseite",
    photos: "Fotos",
    featured: "Vorgestellte Modelle",
    favorites: "Meine Favoriten",
    messages: "Nachrichten",
    recent: "Zuletzt angesehen",
    live: "LIVE",
    about: "Über Lumina",
    support: "Support & FAQ",
    footerDesc: "Lumina ist das ultimative 18+ LIVE Unterhaltungsziel für echte Verbindungen und Spiele für Erwachsene. Jeden Tag streamen Tausende von echten Menschen ihre intimsten Momente live."
  },
  ru: {
    login: "Войти",
    createAccount: "Создать аккаунт",
    searchPlaceholder: "Поиск моделей, стран...",
    allCategories: "Все категории",
    girls: "Девушки",
    couples: "Пары",
    guys: "Парни",
    trans: "Транс",
    home: "Главная",
    photos: "Фото",
    featured: "Рекомендуемые",
    favorites: "Мои избранные",
    messages: "Сообщения",
    recent: "Недавно просмотренные",
    live: "В ЭФИРЕ",
    about: "О Lumina",
    support: "Поддержка и FAQ",
    footerDesc: "Lumina — это идеальное место для развлечений для взрослых 18+ для реального общения и игр для взрослых. Каждый день тысячи реальных людей транслируют в прямом эфире свои самые интимные моменты."
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('lumina_language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lumina_language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  // Prevent hydration mismatch by rendering default english on server, then updating
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: 'en', setLanguage, t: (k) => translations['en'][k] || k }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
