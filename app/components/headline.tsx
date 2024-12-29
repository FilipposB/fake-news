import Link from "next/link";
import { IArticle } from "../model/article.model";
import Image from "next/image";

export default function Headline({ article }: { article: IArticle }) {
    return (
      <>
        <Link href={`/article/${article.topic}`}>
          <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 p-3">
            <div className="w-full h-48 md:w-48 md:h-48 flex-shrink-0">
              <Image
                className="rounded-lg object-cover w-full h-full"
                src={article.google_image_url}
                alt={article.google_image_query}
                width={500}
                height={500}
              />
            </div>
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {article.headline}
              </h5>
            </div>
          </div>
        </Link>
      </>
    );
  }
  