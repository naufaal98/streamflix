import React from 'react';
import { useMachine } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import Header from 'components/Header/Header';
import { getLocalUserData } from 'data/user/user.service';
import NowPlaying from './NowPlaying';
import homeMachine from './homeMachine';
import styles from './index.module.scss';

export default function Home() {
  const [state, send] = useMachine(homeMachine);
  const [userData, setUserData] = React.useState(getLocalUserData());
  const { nowPlayingList } = state.context;
  const history = useHistory();

  const infiniteScroll = () => {
    const innerHeightPlusScrollTop = window.innerHeight + document.documentElement.scrollTop;
    const { offsetHeight } = document.documentElement;
    if (innerHeightPlusScrollTop === offsetHeight) send('REQUEST');
  };

  React.useEffect(() => {
    send('REQUEST');
    setUserData(getLocalUserData());
    window.addEventListener('scroll', infiniteScroll);
  }, []);

  React.useEffect(() => {
    history.replace({ pathname: `/?page=${state.context.nextPage - 1}` });
  });

  return (
    <div className={styles.Home}>
      <Header />
      <h2>Currently Playing in Indoesia </h2>
      <div className={styles.MoviesGrid}>
        {state.value === 'requested' &&
          nowPlayingList.map((movieListPerPage: any) => (
            <NowPlaying service={movieListPerPage} key={movieListPerPage.id} userData={userData} />
          ))}
      </div>
    </div>
  );
}
