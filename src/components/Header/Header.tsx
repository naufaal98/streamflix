import React from 'react';
import { getLocalUserData } from 'data/user/user.service';
import styles from './Header.module.scss';

export default function Header() {
  const [balance, setBalance] = React.useState(getLocalUserData().balance);
  React.useEffect(() => {
    setBalance(getLocalUserData().balance);
  });
  return <div className={styles.Header}>Current Balance: {balance}</div>;
}
