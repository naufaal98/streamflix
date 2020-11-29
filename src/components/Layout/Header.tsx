import { UserContext } from 'context/UserContext';
import React from 'react';
import { NavLink } from 'react-router-dom';
import formatToCurrency from 'utils/formatToCurrency';
import styles from './Header.module.scss';

export default function Header() {
  const { userData } = React.useContext(UserContext);
  return (
    <header className={styles.Header}>
      <h1 className={styles.LogoWrapper}>
        <NavLink to="/" className={styles.Logo}>
          StreamFlix
        </NavLink>
      </h1>
      <div className={styles.RightSide}>
        <nav className={styles.Navigation}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/library">Library</NavLink>
          <NavLink to="/library">Top Up</NavLink>
        </nav>
        <div className={styles.Balance}>
          Balance: <span>{formatToCurrency(userData.balance)}</span>
        </div>
      </div>
    </header>
  );
}
