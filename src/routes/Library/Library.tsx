import MovieCard from 'components/MovieCard/MovieCard';
import { UserContext } from 'context/UserContext';
import { Movie } from 'data/movie/movie.type';
import React from 'react';
import styles from './Library.module.scss';

export default function Library() {
  const { userData } = React.useContext(UserContext);
  const movies = userData.purchased_movies;

  return (
    <>
      <h2>Library</h2>
      <div className={styles.MoviesGrid}>
        {userData.purchased_movies.map((movie: Movie) => (
          <div key={movie.id}>
            <MovieCard
              movie={movie}
              isPurchased={
                !!userData.purchased_movies.find((purchasedMovie) => movie.id === purchasedMovie.id)
              }
              key={movie.id}
            />
          </div>
        ))}
      </div>
      {movies.length === 0 && <p>Sorry, we couldn&apos;t find anything :(</p>}
    </>
  );
}
