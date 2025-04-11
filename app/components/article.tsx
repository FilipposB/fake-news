import Image from "next/image";
import { IArticle } from "../model/article.model";

export default function Article({ article }: { article: IArticle }) {

    return (
<>
  <div className="w-full px-4 md:px-8">
    <div className="max-w-screen-md mx-auto grid grid-cols-1 gap-6">
      {/* Headline */}
      <div className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
        {article.headline}
      </div>

      {/* Image */}
      <Image
        className="rounded-lg object-contain overflow-hidden place-self-center mb-6"
        src={article.google_image_url}
        alt={article.google_image_query}
        width={500}
        height={500}
      />

      {/* Article Body */}
      <div className="whitespace-pre-line border-t pt-4 text-left text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
        {article.article_body}
      </div>

      {/* Author Section */}
      <div className="italic mt-6 p-4 border-t pt-4 text-gray-700 dark:text-gray-300">
        Author: <span className="font-extrabold">{article.author}</span>
      </div>
    </div>
    
  </div>
</>

    );

}