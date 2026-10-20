export type Movie={
  tmdbId: number;
  title: string;
  overview?: string;
  release_date: string;
  vote_average: number | null;
  poster_path?: string | null;
  review: string;
}