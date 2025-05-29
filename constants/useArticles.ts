import { useState, useEffect } from 'react';
import { getArticles } from '../lib/appwrite';
import { Article } from '../types/article';

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export const useArticles = (): UseArticlesResult => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedArticles = await getArticles();
        const publishedArticles = (fetchedArticles as Article[]).filter(
          article => article.isPublished
        );
        setArticles(publishedArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { articles, loading, error };
};
