'use client'

import { useEffect, useState, useCallback } from 'react';
import Article from '../../components/article';
import { IArticle } from '../../model/article.model';
import { useParams, useRouter } from 'next/navigation';
import SpinnerOverlay from '@/app/components/spinner';

export default function ArticlePage() {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { headline } = useParams<{ headline: string }>();
  const [lastTriedArticle, setLastTriedArticle] = useState('')
  const [initialFetch, setInitFetch] = useState(true)

  const router = useRouter()


  const fetchArticle = useCallback(async (articleTopic: string) => {
    if (loading || !initialFetch) return;
    setInitFetch(false);
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
      setArticle(null)
      // Optionally show an error message to the user
    } finally {
      setLastTriedArticle(articleTopic);
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (headline) {

      console.log(lastTriedArticle)

      if (lastTriedArticle === decodeURIComponent(headline)) {
        return;
      }

      if (article && article.headline === decodeURIComponent(headline)) {
        return;
      }

      if (article && article.topic === decodeURIComponent(headline)) {
        router.push(`/article/${article.headline}`)
        return;
      }


      fetchArticle(decodeURIComponent(headline));
    }
  }, [headline, article, fetchArticle]);




  return (
    <div className="grid grid-rows-1 grid-cols-1 gap-y-4 container">
      <main className="space-y-4 mt-3">
        <SpinnerOverlay show={loading} />

        <div className="row-start-2 p-4">
          <div>
            {article ? (
              <Article article={article} />
            ) :
              !loading &&
              <div className="text-center px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                  Error Fetching Article
                </h1>
                <h1 className="mt-10 text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
                  {lastTriedArticle}
                </h1>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}
