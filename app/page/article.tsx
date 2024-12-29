import Image from "next/image";
import { IArticle } from "../model/article.model";

export default function Article({ article }: { article: IArticle }) {

    return (
        <>

            <div className="grid grid-cols-1 gap-2 ">
                <div className="mb-4 text-4xl font-extrabold  leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">{article.title}</div>
                <Image className="rounded-lg object-contain  overflow-hidden place-self-center mb-4" src={article.google_image_url} alt={article.google_image_query} width={500} height={500}/>
                <div className="whitespace-pre-line border-t pt-2">{article.article_body}</div>
                <div className="italic mt-2 p-2 border-t pt-2">Author:  <span className="font-extrabold ">{article.author}</span></div>
            </div>


        </>
    );

}