import React from 'react';
import { Link } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import Header from 'components/Header/Header';
import NowPlayingMovies from './NowPlayingMovies';
import homeMachine from './homeMachine';
import styles from './index.module.scss';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  const { nowPlayingList } = state.context;

  React.useEffect(() => {
    send('REQUEST');
  }, []);

  return (
    <div className={styles.Home}>
      <Header />
      <h2>Currently Playing in Indoesia </h2>
      <div className={styles.MoviesGrid}>
        {state.value === 'requested' &&
          nowPlayingList.map((movieListPerPage: any) => (
            <NowPlayingMovies service={movieListPerPage} key={movieListPerPage.id} />
          ))}
        <div>Loading...</div>
      </div>
      {state.matches('requested') && <p>Requested</p>}
      {state.matches('idle') && <p>Idle</p>}
      <button type="button" onClick={() => send('REQUEST')}>
        Fetch More
      </button>
    </div>
  );
}
