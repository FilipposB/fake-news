export interface IArticle {
  _id: string;
  topic: string;
  headline: string,
  author: string,
  article_body: string,
  google_image_url: string,
  google_image_query: string,
  up_votes: number,
  down_votes: number,
  comments: number;

}
