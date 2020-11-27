import { UserContext } from 'context/UserContext';
import React from 'react';
import { Link } from 'react-router-dom';
import formatToCurrency from 'utils/formatToCurrency';
import styles from './Header.module.scss';

export default function Header() {
  const { userData } = React.useContext(UserContext);
  return (
    <header className={styles.Header}>
      <h1 className={styles.Logo}>
        <Link to="/">StreamFlix</Link>
      </h1>
      <div className={styles.RightSide}>
        <div className={styles.Balance}>
          Balance: <span>{formatToCurrency(userData.balance)}</span>
        </div>
      </div>
    </header>
  );
}
