import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';
import UserService from 'data/user/user.service';
import movieMachine, { MovieContext } from './movieMachine';
import styles from './index.module.scss';

interface ParamsType {
  id: string;
}

export default function Detail() {
  const { id } = useParams<ParamsType>();
  const [state, send] = useMachine(
    movieMachine.withConfig(
      {
        actions: { persist: (ctx: MovieContext) => UserService.setLocalData(ctx.user) },
      },
      // initial state from localStorage
      {
        id: parseInt(id, 10),
        movie: null,
        user: UserService.getLocalData(),
      },
    ),
  );
  const { movie } = state.context;

  return (
    <div className={styles.Detail}>
      {state.value === 'loading' && <p>Loading...</p>}
      {state.value === 'failure' && <p>Failure</p>}
      {state.matches('loaded') && (
        <div>
          <h1>{movie?.title}</h1>
          <p>{movie?.overview}</p>
          <p>Harga {movie?.price}</p>
          <button type="button" onClick={() => send('PURCHASE')}>
            Beli
          </button>
        </div>
      )}
    </div>
  );
}
