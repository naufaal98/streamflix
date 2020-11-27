import React from 'react';
import { Interpreter, AnyEventObject } from 'xstate';
import { useActor } from '@xstate/react';
import { User } from 'data/user/user.type';
import MovieCard from 'components/MovieCard/MovieCard';
import Spinner from 'components/Spinner/Spinner';
import { NowPlayingMoviesContext, NowPlayingMoviesStateSchema } from './nowPlayingMoviesMachine';
import styles from './NowPlayingMovies.module.scss';

interface Props {
  service: Interpreter<NowPlayingMoviesContext, NowPlayingMoviesStateSchema, any, any>;
  userData: User;
}

const NowPlayingMovies: React.FC<Props> = ({ service, userData }) => {
  const [state, send] = useActor(service);
  return (
    <>
      {state.value === 'loading' && (
        <div className={styles.Feedback}>
          <Spinner />
        </div>
      )}
      {state.value === 'loaded' &&
        state.context.movieList.map((movie) => (
          <MovieCard
            movie={movie}
            isPurchased={userData.purchased_movies.includes(movie.id)}
            key={movie.id}
          />
        ))}
      {state.value === 'failure' && (
        <div className={styles.Feedback}>
          <p>Something went wrong, please try again</p>
          <button type="button" onClick={() => send('RETRY')}>
            RETRY
          </button>
        </div>
      )}
    </>
  );
};

export default NowPlayingMovies;
