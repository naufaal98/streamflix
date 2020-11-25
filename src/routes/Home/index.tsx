import React from 'react';
import { Link } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import calculatePriceByRating from 'utils/calculatePriceByRating';
import convertToSlug from 'utils/convertToSlug';
import { purchaseMovie, getCurrentBalance } from 'data/user/localData';
import { Movie } from 'types/Movie';
import homeMachine from './moviesMachine';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  const [currentBalance, setCurrentBalance] = React.useState(getCurrentBalance());

  function onPurchase(movie: Movie) {
    purchaseMovie({
      id: movie.id,
      price: calculatePriceByRating(movie.rating),
    });
    setCurrentBalance(getCurrentBalance());
  }

  return (
    <div>
      <h2>Current Balance: {currentBalance}</h2>
      {state.value === 'loading' && <div>Loading...</div>}
      {state.value === 'failure' && (
        <button type="button" onClick={() => send('RETRY')}>
          Retry
        </button>
      )}
      {state.value === 'loaded' && (
        <ul>
          {state.context.movieList?.map((movie) => (
            <li>
              <Link to={`${movie.id}-${convertToSlug(movie.title)}`}>
                {movie.title} | {calculatePriceByRating(movie.rating)} |{' '}
                <button type="button" onClick={() => onPurchase(movie)}>
                  Beli
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => send('FETCH_MORE')}>
        Fetch More
      </button>
    </div>
  );
}
