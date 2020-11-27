import React from 'react';
import UserService from 'data/user/user.service';
import { Link } from 'react-router-dom';
import formatToCurrency from 'utils/formatToCurrency';
import styles from './Header.module.scss';

export default function Header() {
  const [balance, setBalance] = React.useState(UserService.getLocalData().balance);

  React.useEffect(() => {
    setBalance(UserService.getLocalData().balance);
  });

  return (
    <header className={styles.Header}>
      <h1 className={styles.Logo}>
        <Link to="/">StreamFlix</Link>
      </h1>
      <div className={styles.RightSide}>
        <div className={styles.Balance}>
          Balance: <span>{formatToCurrency(balance)}</span>
        </div>
      </div>
    </header>
  );
}
