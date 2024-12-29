'use client'

import { useEffect, useState } from "react";
import { IArticle } from "./model/article.model";
import Article from "./components/article";
import Headline from "./components/headline";


export default function Home() {

  const [articles, setArticles] = useState<IArticle[]>([]);  // State to store the articles

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/recent-news`); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data: IArticle[] = await response.json();
        setArticles(data);
      } catch (err) {
      } finally {
      }
    };

    fetchTopics(); // Call the fetch function on init
  }, []);

  return (
    <div className="text-center px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
        This is Fake News.
      </h1>
      <p className="mt-4 text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
        An application that generates "Fake News" using AI. Write any topic you wish in the search bar, press Enter, and enjoy!
      </p>
      <div className="grid grid-cols-2 mt-8 gap-16">
        {articles.map(function (object, i) {
          return <Headline article={object} key={i} />;
        })}
      </div>
    </div>
  );
}
