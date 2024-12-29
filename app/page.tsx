'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Article from './page/article';
import { IArticle } from './model/article.model';

export default function Home() {

  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchArticle = async (article: string) => {
    if (loading) {
      throw 'Already Loading !'
    }
    try {
      const response = await fetch(`http://localhost:5000/api/news/${article}`);
      const result: IArticle = await response.json();
      setArticle(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };


  const search = (e: any) => {
    e.preventDefault();
    fetchArticle(e.target.article.value)
  };

  return (
    <div className="grid m-auto grid-rows-3 grid-cols-1 gap-y-4 min-h-screen container">
      <main className="space-y-4 mt-3">
        <div className='row-span-full justify-items-center '>
        <form onSubmit={search}>
          <div className="relative w-full max-w-xs items-center self-center grid ">
            <div className="absolute left-2 w-5">
              <button               disabled={loading}
              >
                <FontAwesomeIcon icon={faSearch} className='text-black' />
              </button>
            </div>
            <input
              type="text"
              name='article'
              className=" pl-10 pr-4 py-2 border rounded-lg text-black"
              placeholder="Search article"
              onChange={(e) => console.log(e)}
              disabled={loading}
            />
          </div>
        </form>
        </div>

        
        <div className="row-start-2 flex-grow p-4 h-full">
        <div className="flex flex-col h-full">
          {article && (
            <Article article={article}/>
          )}
        </div>
      </div>
  
      </main>
      <footer className=" flex-grow">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
