import MovieCard from 'components/MovieCard/MovieCard';
import MoviesGrid from 'components/MoviesGrid/MoviesGrid';
import { UserContext } from 'context/UserContext';
import { Movie } from 'data/movie/movie.type';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Library() {
  const { userData } = React.useContext(UserContext);
  const movies = userData.purchased_movies;

  return (
    <>
      <h2>Library</h2>
      <MoviesGrid>
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
      </MoviesGrid>
      {movies.length === 0 && (
        <p>
          You haven&apos;t made any purchases yet. <Link to="/">Start Explore movies</Link>
        </p>
      )}
    </>
  );
}
