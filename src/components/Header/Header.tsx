import React from 'react';
import UserService from 'data/user/user.service';
import styles from './Header.module.scss';

export default function Header() {
  const [balance, setBalance] = React.useState(UserService.getLocalData().balance);
  React.useEffect(() => {
    setBalance(UserService.getLocalData().balance);
  });
  return <div className={styles.Header}>Current Balance: {balance}</div>;
}
