import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';
import createMovieMachine from './movieMachine';

interface ParamsType {
  id: string;
}

export default function Detail() {
  const { id } = useParams<ParamsType>();
  const movieMachine = React.useMemo(() => createMovieMachine((id as unknown) as number), [id]);

  const persistedMachine = movieMachine.withConfig(
    {
      actions: {
        persist: (ctx: any) => {
          localStorage.setItem('user', JSON.stringify(ctx.user));
        },
      },
    },
    {
      id: (id as unknown) as number,
      movie: null,
      user: (() => {
        try {
          const user = JSON.parse(localStorage.getItem('user')!) || [];
          return {
            balance: user.balance,
            purchased_movies: user.purchased_movies || [],
          };
        } catch (e) {
          return {
            balance: null,
            purchased_movies: [],
          };
        }
      })(),
    },
  );

  const [state, send] = useMachine(persistedMachine);
  const { movie } = state.context;

  return (
    <div>
      {state.value === 'loading' && <p>Loading...</p>}
      {state.value === 'failure' && <p>Failure</p>}
      {state.value === 'loaded' && (
        <div>
          <h1>{movie?.title}</h1>
          <p>{movie?.overview}</p>
          <p>Harga {movie?.price}</p>
          <button type="button" onClick={() => send('BUY')}>
            Beli
          </button>
        </div>
      )}
    </div>
  );
}
