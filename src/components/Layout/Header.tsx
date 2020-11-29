import Button from 'components/Button/Button';
import { UserContext } from 'context/UserContext';
import React from 'react';
import { Link } from 'react-router-dom';
import formatToCurrency from 'utils/formatToCurrency';
import styles from './Header.module.scss';

export default function Header() {
  const { userData } = React.useContext(UserContext);
  return (
    <header className={styles.Header}>
      <h1 className={styles.LogoWrapper}>
        <Link to="/" className={styles.Logo}>
          StreamFlix
        </Link>
      </h1>
      <div className={styles.RightSide}>
        <nav className={styles.Navigation}>
          <Link to="/library">Library</Link>
        </nav>
        <div className={styles.Balance}>
          Balance: <span>{formatToCurrency(userData.balance)}</span>
        </div>
      </div>
    </header>
  );
}
