import React from 'react';
import { useMachine } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import { Movie } from 'data/movie/movie.type';
import { UserContext } from 'context/UserContext';
import MovieCard from 'components/MovieCard/MovieCard';
import Spinner from 'components/Spinner/Spinner';
import Button from 'components/Button/Button';
import MoviesGrid from 'components/MoviesGrid/MoviesGrid';
import isMoviePurchased from 'utils/isMoviePurchased';
import homeMachine from './homeMachine';

import styles from './Home.module.scss';

export default function Home() {
  const { userData } = React.useContext(UserContext);
  const history = useHistory();
  const homeStateSession = 'home-state';

  const persistedState =
    JSON.parse(sessionStorage.getItem(homeStateSession)!) || homeMachine.initialState;
  const [state, send, service] = useMachine(homeMachine, {
    state: persistedState,
  });

  service.onTransition((serviceState) => {
    sessionStorage.setItem(homeStateSession, JSON.stringify(serviceState));
  });

  React.useEffect(() => {
    history.replace({ pathname: `/?page=${state.context.page}` });
  }, [state.context.page]);

  return (
    <div className={styles.Home}>
      <h2 className={styles.SectionTitle}>Now Playing </h2>
      <InfiniteScroll
        pageStart={state.context.page}
        hasMore={state.value !== 'lastPage'}
        loadMore={() => send({ type: 'FETCH', page: state.context.page + 1 })}
      >
        <MoviesGrid>
          {state.context.movies.map((movie: Movie) => (
            <MovieCard
              movie={movie}
              isPurchased={isMoviePurchased({
                purchased_movies: userData.purchased_movies,
                id: movie.id,
              })}
              key={movie.id}
            />
          ))}
        </MoviesGrid>
      </InfiniteScroll>

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
