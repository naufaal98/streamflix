import { Movie } from 'data/movie/movie.type';

export interface User {
  balance: number;
  purchased_movies: Movie[];
}
