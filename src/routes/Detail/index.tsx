import React from 'react';
import { useMachine } from '@xstate/react';
import { useParams } from 'react-router-dom';

import UserService from 'data/user/user.service';
import { UserContext } from 'context/UserContext';
import PurchasedIcon from 'components/Icon/PurchasedIcon';
import Rating from 'components/Rating/Rating';
import formatToCurrency from 'utils/formatToCurrency';
import Button from 'components/Button/Button';
import Spinner from 'components/Spinner/Spinner';
import detailMachine, { DetailContext } from './detailMachine';
import styles from './index.module.scss';
import SimilarMovies from './components/SimilarMovies/SimilarMovies';
import RecommendedMovies from './components/RecommendedMovies/RecommendedMovies';

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
      {
        id: null,
        movie: null,
        // initial context from localStorage
        user: UserService.getLocalData(),
      },
    ),
  );
  const { movie } = state.context;

  React.useEffect(() => {
    send({ type: 'FETCH', id: (id as unknown) as number });
  }, [id]);

  const nestState = state; // To fix nested state.matches issue

  return (
    <div className={styles.Detail}>
      {state.value === 'loading' && (
        <div className={styles.Feedback}>
          <Spinner />
        </div>
      )}

      {state.value === 'failure' && (
        <div className={styles.Feedback}>
          <p>Something went wrong, please try again</p>
          <Button onClick={() => send('RETRY')}>RETRY</Button>
        </div>
      )}

      {state.matches('loaded') && (
        <>
          <div className={styles.MovieSection}>
            <div className={styles.PosterSection}>
              <img
                className={styles.Poster}
                src={`https://image.tmdb.org/t/p/w300/${movie!.poster_path}`}
                alt={movie?.title}
              />
            </div>
            <div className={styles.Description}>
              <h2 className={styles.MovieTitle}>
                <span>{movie!.title}</span>
                {state.matches('loaded.purchased')}
              </h2>
              <div className={styles.Info}>
                <div className={styles.InfoFirstRow}>
                  <Rating score={movie!.rating} />
                  <span className={styles.Duration}>{convertTime(movie!.duration)}</span>
                </div>
                <div className={styles.InfoSecondRow}>
                  {movie!.genres.map((genre) => (
                    <span className={styles.Genre} key={genre.id}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {!state.matches('loaded.purchased') && (
                <div className={styles.BuyOption}>
                  <Button onClick={() => send('PURCHASE')}>
                    {nestState.matches('loaded.purchasing') && 'Purchasing...'}

                    {!nestState.matches('loaded.purchasing') && (
                      <>{formatToCurrency(movie!.price)}&nbsp;Buy</>
                    )}
                  </Button>
                  <Button kind="secondary">Add to Whistlist</Button>
                </div>
              )}

              <div className={styles.PurchaseStatus}>
                {state.matches('loaded.purchased') && (
                  <p className={styles.MovieIsPurchased}>
                    <span>This movie is in your library</span> <PurchasedIcon />
                  </p>
                )}
                {state.matches('loaded.insufficientBalance') && (
                  <p className={styles.InsufficientBalance}>
                    Sorry, your balance is not enough to purchase this movie.
                  </p>
                )}
              </div>

              <h3 className={styles.SubTitle}>Overview</h3>
              <p className={styles.Overview}>{movie!.overview}</p>

              <div className={styles.CastSection}>
                <h3 className={styles.SubTitle}>Cast</h3>
                <ul className={styles.CastList}>
                  {movie!.casts.map((cast) => (
                    <li key={cast.id} className={styles.Cast}>
                      {cast.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <SimilarMovies id={movie!.id} />
          <RecommendedMovies id={movie!.id} />
        </>
      )}
    </div>
  );
}
