'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { FormEvent } from 'react';
import Article from '../../components/article';
import { IArticle } from '../../model/article.model';
import { useParams, useRouter } from 'next/navigation'
import SpinnerOverlay from '@/app/components/spinner';


export default function ArticlePage() {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const { topic } = useParams<{ topic: string }>();

  const router = useRouter()

  if (!router){
    return;
  }

  useEffect(() => {
    if (topic){
      if (article && article.topic === decodeURIComponent(topic)){
        return;
      }
      fetchArticle(topic)
    }
  }, [topic]);


  const fetchArticle = async (article: string) => {
    if (loading) return;
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/news/${article}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }
  
      const result: IArticle = await response.json();
      setArticle(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-1 grid-cols-1 gap-y-4  container">
      <main className="space-y-4 mt-3">
        <div className='row-span-full justify-items-center '>
          
        </div>


        {/* <div className="row-start-2 flex-grow p-4 h-full">
          <div className="flex flex-col h-full">
            {article && (
              <div className='grid grid-cols-2 gap-4'>
                <Headline article={article} />
                <Headline article={article} />
              </div>
              
            )}
          </div>
        </div> */}

        <SpinnerOverlay show={loading}/>

        <div className="row-start-2  p-4 ">
          <div >
            {article && (
                <Article article={article} />
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
