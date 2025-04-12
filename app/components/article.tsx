import Image from "next/image";
import { IArticle } from "../model/article.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faComment, faX } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useState } from "react";

export default function Article({ article }: { article: IArticle }) {
  const [voteType, setVoteType] = useState<"up" | "down" | null>(null);
  const [upVotes, setUpVotes] = useState(article.up_votes ?? 0);
  const [downVotes, setDownVotes] = useState(article.down_votes ?? 0);

  const voteArticle = async (newVoteType: "up" | "down") => {
    const currentVote = voteType;

    let updatedVoteType: "up" | "down" | null = newVoteType;

    // Determine action: undo vote if clicking same again
    if (currentVote === newVoteType) {
      updatedVoteType = null; // removing vote
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vote/article`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          article_id: article._id,
          like: updatedVoteType === "up" ? true : updatedVoteType === "down" ? false : null, // send `null` for removal
        }),
      });

      if (!response.ok) throw new Error("Vote failed");

      // Update local vote counts
      if (currentVote === "up") setUpVotes((prev) => prev - 1);
      if (currentVote === "down") setDownVotes((prev) => prev - 1);

      if (updatedVoteType === "up") setUpVotes((prev) => prev + 1);
      if (updatedVoteType === "down") setDownVotes((prev) => prev + 1);

      setVoteType(updatedVoteType);
    } catch (error) {
      console.error("Voting error:", error);
    }
  };

  return (
    <div className="w-full px-4 md:px-8">
      <div className="max-w-screen-md mx-auto grid grid-cols-1 gap-6">
        <div className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
          {article.headline}
        </div>

        <Image
          className="rounded-lg object-contain overflow-hidden place-self-center mb-6"
          src={article.google_image_url}
          alt={article.google_image_query}
          width={500}
          height={500}
        />

        <div className="whitespace-pre-line border-t pt-4 text-left text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
          {article.article_body}
        </div>

        <div className="italic mt-6 p-4 border-t pt-4 text-gray-700 dark:text-gray-300">
          Author: <span className="font-extrabold">{article.author}</span>
        </div>

        <div className="flex justify-around text-gray-600 dark:text-gray-300 mt-4">
          <div className="flex gap-40 mx-auto">
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                voteType === "up" ? "text-green-600" : "hover:text-gray-800 dark:hover:text-gray-400"
              }`}
              onClick={() => voteArticle("up")}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{upVotes}</span>
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                voteType === "down" ? "text-red-600" : "hover:text-gray-800 dark:hover:text-gray-400"
              }`}
              onClick={() => voteArticle("down")}
            >
              <FontAwesomeIcon icon={faThumbsDown} />
              <span>{downVotes}</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Leave a Comment</h4>
          <textarea
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={4}
            placeholder="Write your comment here..."
          />
          <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Post Comment
          </button>
        </div>

        <div className="mt-6 border-t pt-4 flex gap-6 items-center text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Share:</span>
          <button className="hover:text-blue-600">
            <FontAwesomeIcon icon={faFacebook} />
          </button>
          <button className="hover:text-blue-400">
            <FontAwesomeIcon icon={faX} />
          </button>
          <button className="hover:text-blue-700">
            <FontAwesomeIcon icon={faLinkedin} />
          </button>
        </div>
      </div>
    </div>
  );
}
