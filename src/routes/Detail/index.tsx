import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';
import { getLocalUserData, setLocalUserData } from 'data/user/user.service';
import createMovieMachine, { MovieContext } from './movieMachine';

interface ParamsType {
  id: string;
}

export default function Detail() {
  const { id } = useParams<ParamsType>();
  const movieMachine = React.useMemo(() => createMovieMachine((id as unknown) as number), [id]);

  const persistedMachine = movieMachine.withConfig(
    {
      actions: {
        persist: (ctx: MovieContext) => setLocalUserData(ctx.user),
      },
    },
    // initial state from localStorage
    {
      id: (id as unknown) as number,
      movie: null,
      user: getLocalUserData(),
    },
  );

  const [state, send] = useMachine(persistedMachine);
  const { movie } = state.context;

  return (
    <div>
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
      {console.log(state.value)}
    </div>
  );
}
