import React from 'react';
import { Interpreter, AnyEventObject } from 'xstate';
import { useActor } from '@xstate/react';
import convertToSlug from 'utils/convertToSlug';
import { Movie as MovieType } from 'data/movie/movie.type';
import { NowPlayingMoviesContext, NowPlayingMoviesStateSchema } from './nowPlayingMoviesMachine';
import styles from './NowPlayingMovies.module.scss';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 2,
});

const Movie = ({ movie }: { movie: MovieType }) => {
  return (
    <div key={movie.id} className={styles.Movie}>
      <img
        className={styles.Poster}
        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
        alt={movie.title}
      />
      <div className={styles.Description}>
        <h2 className={styles.Title}>{movie.title}</h2>
        <p className={styles.Price}>{formatter.format(movie.price)}</p>
        <div className={styles.BottomInfo}>
          <p className={styles.Rating}>
            <img src="/star.png" alt="rating" className={styles.StarRating} />
            <div className={styles.RatingScore}>{movie.rating}</div>
          </p>
          <span className={styles.PurchaseStatus} aria-label="purchased">
            ✓
          </span>
        </div>
      </div>
    </div>
  );
};

interface Props {
  service: Interpreter<NowPlayingMoviesContext, NowPlayingMoviesStateSchema, AnyEventObject, any>;
}

const NowPlayingMovies: React.FC<Props> = ({ service }) => {
  const [state, send] = useActor(service);
  return (
    <>
      {state.context.movieList.map((movie) => (
        <Movie movie={movie} key={movie.id} />
      ))}
    </>
  );
};

export default NowPlayingMovies;
