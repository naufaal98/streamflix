import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';
import UserService from 'data/user/user.service';
import { UserContext } from 'context/UserContext';
import movieMachine, { DetailContext } from './detailMachine';
import styles from './index.module.scss';

interface ParamsType {
  id: string;
}

export default function Detail() {
  const { syncUserContext } = React.useContext(UserContext);
  const { id } = useParams<ParamsType>();
  const [state, send] = useMachine(
    movieMachine.withConfig(
      {
        actions: {
          persist: (ctx: DetailContext) => {
            UserService.setLocalData(ctx.user);
            syncUserContext();
          },
        },
      },
      // initial context from localStorage
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
