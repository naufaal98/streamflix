import { useMachine } from '@xstate/react';
import React from 'react';
import MovieCard from 'components/MovieCard/MovieCard';
import Button from 'components/Button/Button';
import Spinner from 'components/Spinner/Spinner';
import { Movie } from 'data/movie/movie.type';
import { UserContext } from 'context/UserContext';
import createSimilarMoviesMachine from './similarMoviesMachine';
import styles from './SimilarMovies.module.scss';

export default function SimilarMovies({ id }: { id: number }) {
  const { userData } = React.useContext(UserContext);
  const similarMoviesMachine = React.useMemo(() => {
    return createSimilarMoviesMachine(id);
  }, [id]);

  const [state, send] = useMachine(similarMoviesMachine);

  return (
    <div className={styles.SimilarMovies}>
      <h3>Similar Movies</h3>
      {state.value === 'loaded' && (
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
