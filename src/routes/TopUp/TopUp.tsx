import React from 'react';
import Button from 'components/Button/Button';
import { UserContext } from 'context/UserContext';
import formatToCurrency from 'utils/formatToCurrency';

import UserService from 'data/user/user.service';
import styles from './TopUp.module.scss';

export default function TopUp() {
  const { userData, syncUserContext } = React.useContext(UserContext);
  const [topUpAmount, setTopUpAmount] = React.useState('');

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount === undefined) return;
    const amount = parseInt(topUpAmount!, 10);
    UserService.setLocalData({
      ...userData,
      balance: userData.balance + amount,
    });
    setTopUpAmount('');
    syncUserContext();
  };

  return (
    <div>
      <h2>Top Up Balance</h2>
      <p>Current Balance: {formatToCurrency(userData.balance)}</p>
      <form className={styles.TopUpForm} onSubmit={handleTopUp}>
        <label htmlFor="topUpAmount" className={styles.Label}>
          <span>Enter Amount</span>
          <input
            id="topUpAmount"
            name="topUpAmount"
            type="number"
            pattern="[0-9]*"
            className={styles.Input}
            placeholder="0"
            value={topUpAmount}
            onChange={(e: any) => setTopUpAmount(e.target.value)}
            required
          />
        </label>
        <Button type="submit">Top Up</Button>
      </form>
    </div>
  );
}
