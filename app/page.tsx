'use client'

import { useEffect, useState } from "react";
import { IArticle } from "./model/article.model";
import Headline from "./components/headline";
export default function Home() {
  const [articles, setArticles] = useState<IArticle[]>([]); // State to store articles
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [page, setPage] = useState<number>(1); // Current page
  const [totalPages, setTotalPages] = useState<number>(1); // Total number of pages

  const fetchArticles = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/recent-news?page=${page}&limit=10`
      ); // Pass page and limit as query params

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();
      // Ensure articles is an array and set state accordingly
      const fetchedArticles = Array.isArray(data.articles) ? data.articles : [];
      setArticles(fetchedArticles);
      setTotalPages(data.total_pages || 1); // Default to 1 page if total_pages is undefined
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles when page changes
  useEffect(() => {
    fetchArticles(page);
  }, [page]); // Re-fetch when the page changes

  // Handle next and previous page navigation
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Generate an array of page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Adjust how many page numbers you want to show at once

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const rangeStart = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      const rangeEnd = Math.min(totalPages, rangeStart + maxVisiblePages - 1);

      for (let i = rangeStart; i <= rangeEnd; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="text-center px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
        This is Fake News.
      </h1>
      <p className="mt-4 text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
        An application that generates &quot;Fake News&quot; using AI. Write any topic you wish in the search bar, press Enter, and enjoy!
      </p>
      {!loading &&
        <>
          <div className="grid justify-center justify-items-center grid-cols-1 xl:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 mt-8 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <Headline article={article} key={index} />
              ))
            ) : (
              <p>No articles available</p> // Show a message if no articles are found
            )}
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </button>

            {/* Display page numbers dynamically */}
            <div className="flex gap-2">
              {generatePageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`px-4 py-2 ${page === pageNum ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-500"} rounded-lg`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      }
    </div>
  );
}