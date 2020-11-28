import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';

import UserService from 'data/user/user.service';
import { UserContext } from 'context/UserContext';
import PurchasedIcon from 'components/Icon/PurchasedIcon';
import Rating from 'components/Rating/Rating';
import detailMachine, { DetailContext } from './detailMachine';
import styles from './index.module.scss';

interface ParamsType {
  id: string;
}

export default function Detail() {
  const { syncUserContext } = React.useContext(UserContext);
  const { id } = useParams<ParamsType>();
  const [state, send] = useMachine(
    detailMachine.withConfig(
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
        <div className={styles.MovieSection}>
          <div className={styles.PosterSection}>
            <img
              className={styles.Poster}
              src={`https://image.tmdb.org/t/p/w300/${movie?.poster_path}`}
              alt={movie?.title}
            />
          </div>
          <div className={styles.Description}>
            <h1 className={styles.MovieTitle}>
              <span>{movie?.title}</span>
              <PurchasedIcon />
            </h1>
            <div className={styles.Info}>
              <Rating score={movie!.rating} />
            </div>
            <button type="button" onClick={() => send('PURCHASE')}>
              Beli
            </button>
            <p>{movie?.overview}</p>
            <p>Harga {movie?.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}
