import React from 'react';
import { Interpreter, AnyEventObject } from 'xstate';
import { useActor } from '@xstate/react';
import { Link } from 'react-router-dom';
import { Movie as MovieType } from 'data/movie/movie.type';
import { getLocalUserData } from 'data/user/user.service';
import { User } from 'data/user/user.type';
import { NowPlayingMoviesContext, NowPlayingMoviesStateSchema } from './nowPlayingMoviesMachine';
import styles from './NowPlayingMovies.module.scss';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 2,
});

export const Movie = ({ movie, isPurchased }: { movie: MovieType; isPurchased: boolean }) => {
  const detailUrl = `/${movie.id}-${movie.slug}`;
  return (
    <div key={movie.id} className={styles.Movie}>
      <Link to={detailUrl}>
        <img
          className={styles.Poster}
          src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
          alt={movie.title}
        />
      </Link>
      <div className={styles.Description}>
        <Link to={detailUrl}>
          <h2 className={styles.Title}>{movie.title}</h2>
        </Link>
        <p className={styles.Price}>{formatter.format(movie.price)}</p>
        <div className={styles.BottomInfo}>
          <div className={styles.Rating}>
            <img src="/star.png" alt="rating" className={styles.StarRating} />
            <div className={styles.RatingScore}>{movie.rating}</div>
          </div>
          {isPurchased && (
            <span className={styles.PurchaseStatus} aria-label="purchased">
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  service: Interpreter<NowPlayingMoviesContext, NowPlayingMoviesStateSchema, AnyEventObject, any>;
  userData: User;
}

const NowPlayingMovies: React.FC<Props> = ({ service, userData }) => {
  const [state, send] = useActor(service);
  return (
    <>
      {state.context.movieList.map((movie) => (
        <Movie
          movie={movie}
          isPurchased={userData.purchased_movies.includes(movie.id)}
          key={movie.id}
        />
      ))}
    </>
  );
};

export default NowPlayingMovies;
