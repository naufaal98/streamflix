import React from 'react';
import { useMachine } from '@xstate/react';
import { Link, useParams } from 'react-router-dom';

import UserService from 'data/user/user.service';
import { UserContext } from 'context/UserContext';
import PurchasedIcon from 'components/Icon/PurchasedIcon';
import Rating from 'components/Rating/Rating';
import formatToCurrency from 'utils/formatToCurrency';
import Button from 'components/Button/Button';
import Spinner from 'components/Spinner/Spinner';
import detailMachine, { DetailContext } from './detailMachine';
import MovieList from './components/MovieList/MovieList';
import styles from './Detail.module.scss';

function convertTime(num: number) {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours}h ${minutes}min`;
}

export default function Detail() {
  const { syncUserContext } = React.useContext(UserContext);
  const { id } = useParams<{ id: string }>();
  const movieId: number = parseInt(id, 10);
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
        ...detailMachine.context!,
        user: UserService.getLocalData(),
      },
    ),
  );
  const { movie } = state.context;

  React.useEffect(() => {
    send({ type: 'FETCH', id: movieId });
  }, [id]);

  const showPurchaseButton =
    !state.matches('loaded.purchased') && !state.matches('loaded.purchaseSuccess');

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
                src={`https://image.tmdb.org/t/p/w400/${movie!.poster_path}`}
                alt={movie?.title}
              />
            </div>
            <div className={styles.Description}>
              <h2 className={styles.MovieTitle}>
                <span>{movie!.title}</span>
              </h2>

              <div className={styles.Info}>
                <div className={styles.InfoFirstRow}>
                  <Rating score={movie!.rating} />
                  <div className={styles.Duration}>{convertTime(movie!.duration)}</div>
                </div>
                <div className={styles.InfoSecondRow}>
                  {movie!.genres.map((genre) => (
                    <span className={styles.Genre} key={genre.id}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {showPurchaseButton && (
                <div className={styles.BuyOption}>
                  <Button onClick={() => send('PURCHASE')}>
                    {state.matches('loaded.purchasing') && 'Purchasing...'}

                    {!state.matches('loaded.purchasing') && (
                      <>{formatToCurrency(movie!.price)}&nbsp;Purchase</>
                    )}
                  </Button>
                </div>
              )}

              <div className={styles.PurchaseStatus}>
                {state.matches('loaded.purchased') && (
                  <p className={styles.MovieIsPurchased}>
                    <span className={styles.MovieIsPurchasedFeedback}>
                      You have this movie in your&nbsp;
                      <Link to="/library">library</Link>
                    </span>
                    <PurchasedIcon />
                  </p>
                )}

                {state.matches('loaded.purchaseSuccess') && (
                  <p className={styles.MovieIsPurchased}>
                    <span className={styles.MovieIsPurchasedFeedback}>
                      Your purchase was successful!
                    </span>
                    <PurchasedIcon />
                  </p>
                )}

                {state.matches('loaded.insufficientBalance') && (
                  <p className={styles.InsufficientBalance}>
                    Sorry, your balance is not enough to purchase this movie. Top up&nbsp;
                    <Link to="top-up">here</Link>.
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

          <MovieList
            listTitle="Similar Movies"
            movies={state.context.similarMovies}
            userData={state.context.user}
          />
          <MovieList
            listTitle="Recommended Movies"
            movies={state.context.recommendedMovies}
            userData={state.context.user}
          />
        </>
      )}
    </div>
  );
}
