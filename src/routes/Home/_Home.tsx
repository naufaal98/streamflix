import React from 'react';
import { useMachine } from '@xstate/react';
import { useHistory } from 'react-router-dom';

import { Movie } from 'data/movie/movie.type';
import { UserContext } from 'context/UserContext';

import MovieCard from 'components/MovieCard/MovieCard';
import Spinner from 'components/Spinner/Spinner';
import Button from 'components/Button/Button';
import MoviesGrid from 'components/MoviesGrid/MoviesGrid';

import isMoviePurchased from 'utils/isMoviePurchased';
import homeMachine from './homeMachine';

import styles from './_Home.module.scss';

export default function Home() {
  const { userData } = React.useContext(UserContext);
  const history = useHistory();
  const homeStateSession = 'home-state';

  const persistedState =
    JSON.parse(sessionStorage.getItem(homeStateSession)!) || homeMachine.initialState;
  const [state, send, service] = useMachine(homeMachine, {
    state: persistedState,
  });

  const infiniteScroll = () => {
    const innerHeightPlusScrollTop = window.innerHeight + document.documentElement.scrollTop;
    const { offsetHeight } = document.documentElement;
    if (innerHeightPlusScrollTop === offsetHeight) {
      send({ type: 'FETCH', page: state.context.page + 1 });
    }
  };

  service.onTransition((serviceState) => {
    try {
      sessionStorage.setItem(homeStateSession, JSON.stringify(serviceState));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to save to sessionStorage');
    }
  });

  React.useEffect(() => {
    window.onscroll = () => infiniteScroll();
    return () => {
      window.onscroll = null;
    };
  });

  React.useEffect(() => {
    history.replace({ pathname: `/?page=${state.context.page}` });
  }, [state.context.page]);

  return (
    <div className={styles.Home}>
      <h2 className={styles.SectionTitle}>Currently Playing in Indoesia </h2>
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
