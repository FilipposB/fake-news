import Link from "next/link";
import { IArticle } from "../model/article.model";
import Image from "next/image";
import { friendlyUrl } from "../util/UrlUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function Headline({ article }: { article: IArticle }) {

  if (!article.topic && article.topic.length === 0 && !article.google_image_url && article.google_image_url.length === 0 && !article.google_image_query && article.google_image_query.length === 0 && !article.headline && article.headline.length === 0 && !article.author && article.author.length === 0 && !article.article_body && article.article_body.length === 0) {
    return null;
  }

  return (
    <>
      <Link href={`/article/${encodeURIComponent(friendlyUrl(article.topic))}`}>
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all p-4">

          {/* Image + Headline Row */}
          <div className="flex flex-col items-center md:flex-row">
            <div className="w-full h-48 md:w-48 md:h-48 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                src={article.google_image_url}
                alt={article.google_image_query}
                width={500}
                height={500}
              />
            </div>
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {article.headline}
              </h5>
            </div>
          </div>

          {/* Thumbs Row */}
          <div className="mt-4 flex items-center text-gray-600 dark:text-gray-300">
            {/* Centered Thumbs Container */}
            <div className="flex gap-12 mx-auto">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{article.up_votes ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faThumbsDown} />
                <span>{article.down_votes ?? 0}</span>
              </div>
            </div>

            {/* Comment icon pushed to the far right */}
            <div className="flex items-center gap-2 ml-auto">
              <FontAwesomeIcon icon={faComment} />
              <span>{article.comments ?? 0}</span>
            </div>
          </div>




        </div>
      </Link>


    </>
  );
}
