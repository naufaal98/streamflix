import { useMachine } from '@xstate/react';
import React from 'react';
import MovieCard from 'components/MovieCard/MovieCard';
import Button from 'components/Button/Button';
import Spinner from 'components/Spinner/Spinner';
import { Movie } from 'data/movie/movie.type';
import { UserContext } from 'context/UserContext';
import createRecommendedMoviesMachine from './RecommendedMoviesMachine';
import styles from './RecommendedMovies.module.scss';

export default function RecommendedMovies({ id }: { id: number }) {
  const { userData } = React.useContext(UserContext);
  const RecommendedMoviesMachine = React.useMemo(() => {
    return createRecommendedMoviesMachine(id);
  }, [id]);

  const [state, send] = useMachine(RecommendedMoviesMachine);

  return (
    <div className={styles.RecommendedMovies}>
      <h3>Recommended Movies</h3>
      {state.value === 'loaded' && (
        <>
          <div className={styles.MoviesGrid}>
            {state.context.movieList.slice(0, 6).map((movie: Movie) => (
              <div key={movie.id}>
                <MovieCard
                  movie={movie}
                  isPurchased={userData.purchased_movies.includes(movie.id)}
                  key={movie.id}
                />
              </div>
            ))}
          </div>
          {state.context.movieList.length === 0 && <p>Sorry, we couldn&apos;t find anything :(</p>}
        </>
      )}
      {state.value === 'failure' && (
        <div className={styles.Feedback}>
          <p>Something went wrong, please try again</p>
          <Button onClick={() => send('RETRY')}>RETRY</Button>
        </div>
      )}
      {state.value === 'loading' && (
        <div className={styles.Feedback}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
