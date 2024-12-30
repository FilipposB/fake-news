'use client'

import { useEffect, useState, useCallback } from 'react';
import Article from '../../components/article';
import { IArticle } from '../../model/article.model';
import { useParams, useRouter } from 'next/navigation';
import SpinnerOverlay from '@/app/components/spinner';

export default function ArticlePage() {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const { headline } = useParams<{ headline: string }>();

  const router = useRouter()


  const fetchArticle = useCallback(async (articleTopic: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/news/${articleTopic}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }

      const result: IArticle = await response.json();
      setArticle(result);
      return result
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (headline) {
      if (article && article.headline === decodeURIComponent(headline)) {
        return;
      }

      if (article && article.topic === decodeURIComponent(headline)){
        router.push(`/article/${article.headline}`)
        return;
      }


      fetchArticle(headline);
    }
  }, [headline, article, fetchArticle]);




  return (
    <div className="grid grid-rows-1 grid-cols-1 gap-y-4 container">
      <main className="space-y-4 mt-3">
        <SpinnerOverlay show={loading}/>

        <div className="row-start-2 p-4">
          <div>
            {article && (
              <Article article={article} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
