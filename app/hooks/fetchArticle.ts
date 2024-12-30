import { useState, useCallback } from "react";
import { IArticle } from "../model/article.model";

const useFetchArticle = () => {
    const [article, setArticle] = useState<IArticle | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
    const fetchArticle = useCallback(
      async (articleTopic: string) => {
        if (loading) return;
        setLoading(true);
  
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/news/${articleTopic}`);
  
          if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
          }
  
          const result: IArticle = await response.json();
          setArticle(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      },
      [loading]
    );
  
    return { article, loading, fetchArticle };
  };
  
  export default useFetchArticle;