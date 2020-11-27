import React from 'react';
import { useMachine } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import Header from 'components/Header/Header';
import MovieCard from 'components/MovieCard/MovieCard';
import UserService from 'data/user/user.service';
import Spinner from 'components/Spinner/Spinner';
import { Movie } from 'data/movie/movie.type';
import homeMachine from './homeMachine';
import styles from './index.module.scss';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  const [userData] = React.useState(UserService.getLocalData());
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
      <Header />
      <h2>Currently Playing in Indoesia </h2>
      <div className={styles.MoviesGrid}>
        {state.context.movieList.map((movie: Movie) => (
          <div key={movie.id}>
            <MovieCard
              movie={movie}
              isPurchased={userData.purchased_movies.includes(movie.id)}
              key={movie.id}
            />
          </div>
        ))}
      </div>
      {state.value === 'failure' && (
        <div className={styles.Feedback}>
          <p>Something went wrong, please try again</p>
          <button type="button" onClick={() => send('RETRY')}>
            RETRY
          </button>
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
