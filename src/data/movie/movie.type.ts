export interface Movie {
  id: number;
  title: string;
  rating: number;
  overview: string;
  poster_path: string;
  slug: string;
  price: number;
}

export interface MovieList {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  duration: number;
  genres: Genre[];
  casts: Cast[];
}
