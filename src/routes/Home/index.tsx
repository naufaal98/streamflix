import React from 'react';
import { useMachine } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import Header from 'components/Header/Header';
import MovieCard from 'components/MovieCard/MovieCard';
import { getLocalUserData } from 'data/user/user.service';
import homeMachine from './homeMachine';
import styles from './index.module.scss';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  const [userData] = React.useState(getLocalUserData());
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
    history.replace({ pathname: `/?page=${state.context.page}` });
  });

  return (
    <div className={styles.Home}>
      <Header />
      {console.log(state.context)}
      <h2>Currently Playing in Indoesia </h2>
      <div className={styles.MoviesGrid}>
        {state.context.movieList.map((movie: any) => (
          <div key={movie.id}>
            <MovieCard
              movie={movie}
              isPurchased={userData.purchased_movies.includes(movie.id)}
              key={movie.id}
            />
            <p>{movie.id}</p>
            <p>{state.context.page}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
