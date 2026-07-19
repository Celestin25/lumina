export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";
import { Suspense } from "react";

// ─── Country master list ──────────────────────────────────────────────────────
// Each entry: iso (for flagcdn), code (display), name (label), slug (DB query)
const REGIONS: {
  name: string;
  countries: { iso: string; code: string; name: string; slug: string | string[] }[];
}[] = [
  {
    name: "NORTH AMERICA",
    countries: [
      { iso: "us", code: "US", name: "American",   slug: "United States" },
      { iso: "ca", code: "CA", name: "Canadian",   slug: "Canada" },
      { iso: "mx", code: "MX", name: "Mexican",    slug: "Mexico" },
    ],
  },
  {
    name: "SOUTH AMERICA",
    countries: [
      { iso: "ar", code: "AR", name: "Argentinian", slug: "Argentina" },
      { iso: "br", code: "BR", name: "Brazilian",   slug: "Brazil" },
      { iso: "cl", code: "CL", name: "Chilean",     slug: "Chile" },
      { iso: "co", code: "CO", name: "Colombian",   slug: "Colombia" },
      { iso: "ec", code: "EC", name: "Ecuadorian",  slug: "Ecuador" },
      { iso: "pe", code: "PE", name: "Peruvian",    slug: "Peru" },
      { iso: "uy", code: "UY", name: "Uruguayan",   slug: "Uruguay" },
      { iso: "ve", code: "VE", name: "Venezuelan",  slug: "Venezuela" },
    ],
  },
  {
    name: "EUROPE",
    countries: [
      { iso: "at", code: "AT", name: "Austrian",   slug: "Austria" },
      { iso: "be", code: "BE", name: "Belgian",    slug: "Belgium" },
      { iso: "gb", code: "GB", name: "British",    slug: "United Kingdom" },
      { iso: "bg", code: "BG", name: "Bulgarian",  slug: "Bulgaria" },
      { iso: "hr", code: "HR", name: "Croatian",   slug: "Croatia" },
      { iso: "cz", code: "CZ", name: "Czech",      slug: "Czech Republic" },
      { iso: "dk", code: "DK", name: "Danish",     slug: "Denmark" },
      { iso: "nl", code: "NL", name: "Dutch",      slug: "Netherlands" },
      { iso: "ee", code: "EE", name: "Estonian",   slug: "Estonia" },
      { iso: "fi", code: "FI", name: "Finnish",    slug: "Finland" },
      { iso: "fr", code: "FR", name: "French",     slug: "France" },
      { iso: "ge", code: "GE", name: "Georgian",   slug: "Georgia" },
      { iso: "de", code: "DE", name: "German",     slug: "Germany" },
      { iso: "gr", code: "GR", name: "Greek",      slug: "Greece" },
      { iso: "hu", code: "HU", name: "Hungarian",  slug: "Hungary" },
      { iso: "ie", code: "IE", name: "Irish",      slug: "Ireland" },
      { iso: "it", code: "IT", name: "Italian",    slug: "Italy" },
      { iso: "lv", code: "LV", name: "Latvian",    slug: "Latvia" },
      { iso: "lt", code: "LT", name: "Lithuanian", slug: "Lithuania" },
      { iso: "no", code: "NO", name: "Norwegian",  slug: "Norway" },
      { iso: "pl", code: "PL", name: "Polish",     slug: "Poland" },
      { iso: "pt", code: "PT", name: "Portuguese", slug: "Portugal" },
      { iso: "ro", code: "RO", name: "Romanian",   slug: "Romania" },
      { iso: "rs", code: "RS", name: "Serbian",    slug: "Serbia" },
      { iso: "sk", code: "SK", name: "Slovakian",  slug: "Slovakia" },
      { iso: "si", code: "SI", name: "Slovenian",  slug: "Slovenia" },
      { iso: "es", code: "ES", name: "Spanish",    slug: "Spain" },
      { iso: "se", code: "SE", name: "Swedish",    slug: "Sweden" },
      { iso: "ch", code: "CH", name: "Swiss",      slug: "Switzerland" },
      { iso: "ua", code: "UA", name: "Ukrainian",  slug: "Ukraine" },
    ],
  },
  {
    name: "ASIA & PACIFIC",
    countries: [
      { iso: "au", code: "AU", name: "Australian",  slug: "Australia" },
      { iso: "bd", code: "BD", name: "Bangladeshi", slug: "Bangladesh" },
      { iso: "cn", code: "CN", name: "Chinese",     slug: "China" },
      { iso: "ph", code: "PH", name: "Filipino",    slug: "Philippines" },
      { iso: "in", code: "IN", name: "Indian",      slug: "India" },
      { iso: "id", code: "ID", name: "Indonesian",  slug: "Indonesia" },
      { iso: "jp", code: "JP", name: "Japanese",    slug: "Japan" },
      { iso: "kr", code: "KR", name: "Korean",      slug: "South Korea" },
      { iso: "my", code: "MY", name: "Malaysian",   slug: "Malaysia" },
      { iso: "lk", code: "LK", name: "Sri Lankan",  slug: "Sri Lanka" },
      { iso: "th", code: "TH", name: "Thai",        slug: "Thailand" },
      { iso: "vn", code: "VN", name: "Vietnamese",  slug: "Vietnam" },
    ],
  },
  {
    name: "AFRICA",
    countries: [
      // African (all) uses an array of countries as slug
      { iso: "dz", code: "DZ", name: "Algerian",     slug: "Algeria" },
      { iso: "bi", code: "BI", name: "Burundian",    slug: "Burundi" },
      { iso: "cd", code: "CD", name: "Congolese (DRC)", slug: "DR Congo" },
      { iso: "eg", code: "EG", name: "Egyptian",     slug: "Egypt" },
      { iso: "ke", code: "KE", name: "Kenyan",       slug: "Kenya" },
      { iso: "mg", code: "MG", name: "Malagasy",     slug: "Madagascar" },
      { iso: "ma", code: "MA", name: "Moroccan",     slug: "Morocco" },
      { iso: "ng", code: "NG", name: "Nigerian",     slug: "Nigeria" },
      { iso: "rw", code: "RW", name: "Rwandan",      slug: "Rwanda" },
      { iso: "za", code: "ZA", name: "South African", slug: "South Africa" },
      { iso: "tz", code: "TZ", name: "Tanzanian",    slug: "Tanzania" },
      { iso: "ug", code: "UG", name: "Ugandan",      slug: "Uganda" },
      { iso: "zw", code: "ZW", name: "Zimbabwean",   slug: "Zimbabwe" },
    ],
  },
  {
    name: "MIDDLE EAST",
    countries: [
      { iso: "sa", code: "SA", name: "Arab",     slug: "Saudi Arabia" },
      { iso: "il", code: "IL", name: "Israeli",  slug: "Israel" },
      { iso: "tr", code: "TR", name: "Turkish",  slug: "Turkey" },
    ],
  },
];

const LANGUAGES = [
  { name: "Portuguese Speaking", iso: "pt" },
  { name: "Russian Speaking",    iso: "ru" },
  { name: "Spanish Speaking",    iso: "es" },
  { name: "Hindi Speaking",      iso: "in" },
  { name: "French Speaking",     iso: "fr" },
  { name: "German Speaking",     iso: "de" },
  { name: "Arabic Speaking",     iso: "sa" },
  { name: "Mandarin Speaking",   iso: "cn" },
  { name: "Japanese Speaking",   iso: "jp" },
  { name: "Korean Speaking",     iso: "kr" },
  { name: "Italian Speaking",    iso: "it" },
  { name: "Dutch Speaking",      iso: "nl" },
  { name: "Swedish Speaking",    iso: "se" },
  { name: "Polish Speaking",     iso: "pl" },
  { name: "Romanian Speaking",   iso: "ro" },
];

const AGE_GROUPS = [
  { label: "Teen 18+", param: "ageRange", value: "teen" },
  { label: "Young 22+", param: "ageRange", value: "young" },
  { label: "MILF",      param: "ageRange", value: "milf" },
  { label: "Mature",    param: "ageRange", value: "mature" },
  { label: "Granny",   param: "ageRange", value: "granny" },
];
const ETHNICITY  = ["Arab","Asian","Ebony","Indian","Latina","Mixed","White"];
const BODY_TYPE  = ["Slim","Athletic","Curvy","Big Breast","Plump"];
const HAIR_COLOR = ["Blonde","Brunette","Black","Redhead","Bald"];
const SERVICES   = [
  "Dinner Date","Overnight Stay","Travel Companion","Social Events",
  "City Tour Guide","Business Events","GFE (Girlfriend Experience)",
  "Model Companion","Airport Pickup","Vacation Partner","VIP Escort",
  "Photoshoot Partner","Yacht Party","Nightlife Guide","Cultural Tours",
  "Weekend Getaway","Luxury Dining","Private Events","Prom Date",
  "Wedding Guest","Sports Events","Gallery Openings","Fitness Partner",
  "Shopping Companion","Spa Day","Concert Events","Theater and Shows","Casino Night",
];

// ─── Fetch per-country counts from DB ────────────────────────────────────────
async function getCountryCounts(): Promise<Record<string, number>> {
  try {
    const rows = await prisma.modelProfile.groupBy({
      by: ["country"],
      where: { isVerified: true, isActive: true },
      _count: { _all: true },
    });
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      if (r.country) map[r.country] = r._count._all;
    });
    return map;
  } catch {
    return {};
  }
}

// ─── FlagImg component ────────────────────────────────────────────────────────
function FlagImg({ iso, alt }: { iso: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/20x15/${iso.toLowerCase()}.png`}
      width={20}
      height={15}
      alt={alt}
      className={styles.flagImg}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CategoriesPage() {
  const countryCounts = await getCountryCounts();

  // Helper: sum count for a slug (string or array of strings)
  const countFor = (slug: string | string[]): number => {
    if (Array.isArray(slug)) return slug.reduce((acc, s) => acc + (countryCounts[s] ?? 0), 0);
    return countryCounts[slug] ?? 0;
  };

  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        <Suspense fallback={<div style={{ padding: "24px", color: "#666" }}>Loading...</div>}>
          <Sidebar />
        </Suspense>

        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>All Categories — Models Directory</h1>
            <p className={styles.pageSubtitle}>Browse escort models by country, appearance, and services</p>
          </div>

          {/* Alphabet quick-nav */}
          <div className={styles.alphabetNav}>
            <Link href="/categories" className={styles.alphaActive}>Main</Link>
            {"#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c) => (
              <span key={c} className={styles.alphaChar}>{c}</span>
            ))}
          </div>

          {/* ── Countries & Languages ───────────────── */}
          <section className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIconWrap}>🌐</span>
              Countries &amp; Languages
            </h2>

            <div className={styles.regionsGrid}>
              {REGIONS.map((region) => (
                <div key={region.name} className={styles.regionBlock}>
                  <div className={styles.regionHeader}>{region.name}</div>
                  <ul className={styles.countryList}>
                    {region.countries.map((c) => {
                      const cnt = countFor(c.slug);
                      const href = Array.isArray(c.slug)
                        ? `/search?country=${encodeURIComponent(c.slug[0])}`
                        : `/search?country=${encodeURIComponent(c.slug)}`;
                      return (
                        <li key={c.code}>
                          <Link href={href} className={styles.countryLink}>
                            <FlagImg iso={c.iso} alt={c.name} />
                            <span className={styles.countryCode}>{c.code}</span>
                            <span className={styles.countryName}>{c.name}</span>
                            {cnt > 0 && <span className={styles.countryCount}>{cnt}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Languages column */}
              <div className={styles.regionBlock}>
                <div className={styles.regionHeader}>LANGUAGES</div>
                <ul className={styles.countryList}>
                  {LANGUAGES.map((lang) => (
                    <li key={lang.name}>
                      <Link href={`/search?q=${encodeURIComponent(lang.name)}`} className={styles.countryLink}>
                        <FlagImg iso={lang.iso} alt={lang.name} />
                        <span className={styles.countryName}>{lang.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Appearance ────────────────────────────── */}
          <section className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIconWrap}>👁️</span>
              Appearance
            </h2>
            <div className={styles.appearanceGrid}>
              <div className={styles.appearanceBlock}>
                <div className={styles.regionHeader}>AGE</div>
                <ul className={styles.tagList}>
                  {AGE_GROUPS.map((a) => (
                    <li key={a.value}>
                      <Link href={`/search?${a.param}=${a.value}`} className={styles.tagLink}>{a.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.appearanceBlock}>
                <div className={styles.regionHeader}>ETHNICITY</div>
                <ul className={styles.tagList}>
                  {ETHNICITY.map((e) => (
                    <li key={e}>
                      <Link href={`/search?ethnicity=${encodeURIComponent(e)}`} className={styles.tagLink}>{e}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.appearanceBlock}>
                <div className={styles.regionHeader}>BODY TYPE</div>
                <ul className={styles.tagList}>
                  {BODY_TYPE.map((b) => (
                    <li key={b}>
                      <Link href={`/search?bodyType=${encodeURIComponent(b)}`} className={styles.tagLink}>{b}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.appearanceBlock}>
                <div className={styles.regionHeader}>HAIR</div>
                <ul className={styles.tagList}>
                  {HAIR_COLOR.map((h) => (
                    <li key={h}>
                      <Link href={`/search?hairColor=${encodeURIComponent(h)}`} className={styles.tagLink}>{h}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Services on Request ───────────────────── */}
          <section className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIconWrap}>✨</span>
              Services on Request
            </h2>
            <div className={styles.servicesGrid}>
              {SERVICES.map((svc) => (
                <Link key={svc} href={`/search?q=${encodeURIComponent(svc)}`} className={styles.serviceTag}>
                  {svc}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
