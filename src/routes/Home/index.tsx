import React from 'react';
import { Link } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import calculatePriceByRating from 'utils/calculatePriceByRating';
import convertToSlug from 'utils/convertToSlug';
import Header from 'components/Header/Header';
import homeMachine from './homeMachine';
import styles from './index.module.scss';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  return (
    <div className={styles.Home}>
      <Header />
      <h2>Currently Playing in Indoesia </h2>
      {/* {state.value === 'loading' && <div>Loading...</div>}
      {state.value === 'failure' && (
        <button type="button" onClick={() => send('FETCH')}>
          Retry
        </button>
      )} */}
      {/* {state.value === 'fetched' && (
        <ul>{state.context.movies?.map((movie) => console.log(movie))}</ul>
      )}
      <button type="button" onClick={() => send('FETCH')}>
        Fetch More
      </button> */}
    </div>
  );
}
