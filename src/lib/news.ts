import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: "Hacker News" | "Dev.to" | "ArXiv" | "GitHub";
  score?: number;
  author?: string;
  publishedAt: string;
  tags?: string[];
}

// REST API for Hacker News
async function getHackerNews(): Promise<NewsItem[]> {
  try {
    const topStoriesRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty",
      { next: { revalidate: 3600 } }
    );
    const topIds = (await topStoriesRes.json()).slice(0, 15); // Top 15

    const stories = await Promise.all(
      topIds.map(async (id: number) => {
        const itemRes = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { next: { revalidate: 3600 } }
        );
        return itemRes.json();
      })
    );

    return stories.map((story: any) => ({
      id: story.id.toString(),
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      source: "Hacker News",
      score: story.score,
      author: story.by,
      publishedAt: new Date(story.time * 1000).toISOString(),
      tags: ["tech", "discussion"],
    }));
  } catch (error) {
    console.error("Failed to fetch HN:", error);
    return [];
  }
}

// Dev.to API
async function getDevTo(tag: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?tag=${tag}&top=2&per_page=5`,
      { next: { revalidate: 3600 } }
    );
    const articles = await res.json();

    return articles.map((article: any) => ({
      id: article.id.toString(),
      title: article.title,
      url: article.url,
      source: "Dev.to",
      score: article.public_reactions_count,
      author: article.user.name,
      publishedAt: article.published_at,
      tags: article.tag_list,
    }));
  } catch (error) {
    console.error(`Failed to fetch Dev.to (${tag}):`, error);
    return [];
  }
}

// ArXiv API (RSS/Atom Feed)
async function getArXiv(category = "cs.AI"): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      `http://export.arxiv.org/api/query?search_query=cat:${category}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`,
      { next: { revalidate: 3600 } }
    );
    const text = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonData = parser.parse(text);
    
    const entries = jsonData.feed.entry || [];
    // Ensure entries is an array (XMLParser might return object for single item)
    const list = Array.isArray(entries) ? entries : [entries];

    return list.map((entry: any) => ({
      id: entry.id,
      title: entry.title.replace(/\\n/g, " ").trim(),
      url: entry.id,
      source: "ArXiv",
      score: 0, 
      author: Array.isArray(entry.author) ? entry.author[0].name : entry.author.name,
      publishedAt: entry.published,
      tags: ["research", category],
    }));
  } catch (error) {
    console.error("Failed to fetch ArXiv:", error);
    return [];
  }
}

export async function getAllNews(): Promise<NewsItem[]> {
  const [hn, devAi, devWeb, arxiv] = await Promise.all([
    getHackerNews(),
    getDevTo("artificial-intelligence"),
    getDevTo("webdev"),
    getArXiv("cs.AI"),
  ]);

  // Combine and sort by date (newest first)
  const allNews = [...hn, ...devAi, ...devWeb, ...arxiv];
  // Simple sort - HN time is unix, others ISO strings. 
  // Our interface normalized them to ISO string or we can just shuffle/interleave 
  // to give a "feed" feel. Let's sort by date descending.
  
  return allNews.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
