import { Movie, MovieList, Cast, MovieDetail } from 'data/movie/movie.type';
import calculatePriceByRating from 'utils/calculatePriceByRating';

export function movieAdapter(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average,
    overview: movie.overview,
    release_date: movie.release_date,
    price: calculatePriceByRating(movie.vote_average),
  };
}

export function movieListAdapter(data: any): MovieList {
  return {
    page: data.page,
    results: data.results.map((movie: any) => movieAdapter(movie)),
  };
}

export function castAdapter(cast: any): Cast {
  return {
    id: cast.id,
    name: cast.name,
    profile_path: cast.profile_path,
  };
}

export function movieDetailAdapter(movie: any, casts: any): MovieDetail {
  return {
    ...movieAdapter(movie),
    duration: movie.runtime,
    casts: casts.map((cast: any) => castAdapter(cast)),
  };
}
