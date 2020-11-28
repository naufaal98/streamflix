import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';

import UserService from 'data/user/user.service';
import { UserContext } from 'context/UserContext';
import PurchasedIcon from 'components/Icon/PurchasedIcon';
import Rating from 'components/Rating/Rating';
import formatToCurrency from 'utils/formatToCurrency';
import Button from 'components/Button/Button';
import detailMachine, { DetailContext } from './detailMachine';
import styles from './index.module.scss';

function convertTime(num: number) {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours}h ${minutes}min`;
}

export default function Detail() {
  const { syncUserContext } = React.useContext(UserContext);
  const { id } = useParams<{ id: string }>();
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
              src={`https://image.tmdb.org/t/p/w300/${movie!.poster_path}`}
              alt={movie?.title}
            />
          </div>
          <div className={styles.Description}>
            <h1 className={styles.MovieTitle}>
              <span>{movie!.title}</span>
              {state.matches('loaded.purchased') && <PurchasedIcon />}
            </h1>
            <div className={styles.Info}>
              <div className={styles.InfoFirstRow}>
                <Rating score={movie!.rating} />
                <span className={styles.Duration}>{convertTime(movie!.duration)}</span>
              </div>
              <div className={styles.InfoSecondRow}>
                {movie!.genres.map((genre) => (
                  <span className={styles.Genre}>{genre.name} </span>
                ))}
              </div>
            </div>
            <div className={styles.BuyOption}>
              <Button onClick={() => send('PURCHASE')}>
                <span className={styles.Price}>{formatToCurrency(movie!.price)}</span>
                Buy
              </Button>
              <Button kind="secondary">Add to Whistlist</Button>
            </div>
            <p className={styles.Overview}>{movie!.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
}
