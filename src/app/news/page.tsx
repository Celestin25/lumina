import Link from "next/link";
import { getAllNews, NewsItem } from "@/lib/news";
import styles from "./page.module.css";
import { ExternalLink, MessageSquare, Star } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function NewsPage() {
  const news = await getAllNews();

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lumina News</h1>
        <p className={styles.subtitle}>Curated tech, research, and development updates</p>
      </div>

      <div className={styles.grid}>
        {news.map((item) => (
          <Link 
            href={item.url} 
            key={item.id} 
            target="_blank" 
            className={styles.card}
          >
            <div>
              <span className={`${styles.sourceTag} ${
                item.source === "Hacker News" ? styles.sourceHN :
                item.source === "ArXiv" ? styles.sourceArXiv :
                styles.sourceDev
              }`}>
                {item.source}
              </span>
              
              <h2 className={styles.cardTitle}>{item.title}</h2>
              
              {item.tags && item.tags.length > 0 && (
                <div className={styles.tags}>
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.meta}>
              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              {item.score !== undefined && item.score > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} />
                  <span>{item.score}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
