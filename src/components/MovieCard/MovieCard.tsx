import React from 'react';
import { Link } from 'react-router-dom';

import { Movie } from 'data/movie/movie.type';
import formatToCurrency from 'utils/formatToCurrency';
import Rating from 'components/Rating/Rating';
import PurchasedIcon from 'components/Icon/PurchasedIcon';
import styles from './MovieCard.module.scss';

const MovieCard = ({ movie, isPurchased }: { movie: Movie; isPurchased: boolean }) => {
  const detailUrl = `/${movie.id}-${movie.slug}`;
  return (
    <div key={movie.id} className={styles.MovieCard}>
      <Link to={detailUrl}>
        <img
          className={styles.Poster}
          src={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`}
          alt={movie.title}
        />
      </Link>
      <div className={styles.Description}>
        <Link to={detailUrl}>
          <h2 className={styles.Title}>{movie.title}</h2>
        </Link>
        <p className={styles.Price}>{formatToCurrency(movie.price)}</p>
        <div className={styles.BottomInfo}>
          <Rating score={movie.rating} />
          {isPurchased && (
            <div className={styles.PurchaseStatus}>
              <PurchasedIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
