import { Movie, MovieList, Cast, MovieDetail, Genre } from 'data/movie/movie.type';
import calculatePriceByRating from 'utils/calculatePriceByRating';
import convertToSlug from 'utils/convertToSlug';

export function movieAdapter(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average,
    overview: movie.overview,
    poster_path: movie.poster_path,
    slug: convertToSlug(movie.title),
    price: calculatePriceByRating(movie.vote_average),
  };
}

export function movieListAdapter(data: any): MovieList {
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
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

export function genreAdapter(genre: any): Genre {
  return {
    id: genre.id,
    name: genre.name,
  };
}

export function movieDetailAdapter(movie: any, casts: any): MovieDetail {
  return {
    ...movieAdapter(movie),
    duration: movie.runtime,
    genres: movie.genres.map((genre: any) => genreAdapter(genre)),
    casts: casts.map((cast: any) => castAdapter(cast)),
  };
}
