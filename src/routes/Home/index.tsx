import React from 'react';
import { useMachine } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import MovieCard from 'components/MovieCard/MovieCard';
import Spinner from 'components/Spinner/Spinner';
import { Movie } from 'data/movie/movie.type';
import Button from 'components/Button/Button';
import { UserContext } from 'context/UserContext';
import MoviesGrid from 'components/MoviesGrid/MoviesGrid';
import isMoviePurchased from 'utils/isMoviePurchased';
import homeMachine from './homeMachine';
import styles from './index.module.scss';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  const { userData } = React.useContext(UserContext);
  const history = useHistory();

  const infiniteScroll = () => {
    const innerHeightPlusScrollTop = window.innerHeight + document.documentElement.scrollTop;
    const { offsetHeight } = document.documentElement;
    if (innerHeightPlusScrollTop === offsetHeight) {
      send({ type: 'FETCH', page: state.context.page + 1 });
    }
  };

  React.useEffect(() => {
    window.onscroll = () => infiniteScroll();
    return () => {
      window.onscroll = null;
    };
  });

  React.useEffect(() => {
    history.replace({ pathname: `/?page=${state.context.page}` });
  }, [state.context.page]);

  return (
    <div className={styles.Home}>
      <h2 className={styles.SectionTitle}>Currently Playing in Indoesia </h2>
      <MoviesGrid>
        {state.context.movieList.map((movie: Movie) => (
          <div key={movie.id}>
            <MovieCard
              movie={movie}
              isPurchased={isMoviePurchased({
                purchased_movies: userData.purchased_movies,
                id: movie.id,
              })}
              key={movie.id}
            />
          </div>
        ))}
      </MoviesGrid>
      {state.value === 'failure' && (
        <div className={styles.Feedback}>
          <p>Something went wrong, please try again</p>
          <Button onClick={() => send('RETRY')}>RETRY</Button>
        </div>
      )}
      {state.value === 'loading' && (
        <div className={styles.Feedback}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
