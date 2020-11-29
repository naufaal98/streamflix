import { Movie } from 'data/movie/movie.type';

export default function isMoviePurchased({
  purchased_movies,
  id,
}: {
  purchased_movies: Movie[];
  id: number;
}) {
  return !!purchased_movies.find((movie: Movie) => movie.id === id);
}
