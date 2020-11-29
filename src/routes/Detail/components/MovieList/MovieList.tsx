import React from 'react';
import MovieCard from 'components/MovieCard/MovieCard';
import { Movie } from 'data/movie/movie.type';
import { User } from 'data/user/user.type';

import isMoviePurchased from 'utils/isMoviePurchased';
import styles from './MovieList.module.scss';

export default function MovieList({
  userData,
  movies,
  listTitle,
}: {
  userData: User;
  movies: Movie[];
  listTitle: string;
}) {
  return (
    <>
      <h2>{listTitle}</h2>
      <div className={styles.MovieList}>
        {movies.slice(0, 6).map((movie: Movie) => (
          <div key={movie.id}>
            <MovieCard
              movie={movie}
              isPurchased={isMoviePurchased({
                purchased_movies: userData.purchased_movies,
                id: movie.id,
              })}
              key={movie.id}
            />
          </div>
        ))}
      </div>

      {movies.length === 0 && <p>Sorry, we couldn&apos;t find anything :(</p>}
    </>
  );
}
