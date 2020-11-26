export interface Movie {
  id: number;
  title: string;
  rating: number;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  price: number;
}

export interface MovieList {
  page: number;
  results: Movie[];
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string;
}

export interface MovieDetail extends Movie {
  duration: number;
  casts: Cast[];
}
