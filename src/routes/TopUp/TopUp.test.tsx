import React from 'react';
import { UserContext } from 'context/UserContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { User } from 'data/user/user.type';
import TopUp from './TopUp';

test(`TopUp without error`, () => {
  const userData: User = {
    balance: 10000,
    purchased_movies: [],
  };

  const topUpAmount = 2000;

  const syncData = () => {
    userData.balance += topUpAmount;
  };

  render(
    <UserContext.Provider value={{ userData, syncUserContext: syncData }}>
      <TopUp />
    </UserContext.Provider>,
  );

  userEvent.type(screen.getByLabelText(/enter amount/i), topUpAmount.toString());
  userEvent.click(screen.getByRole('button', { name: /top up/i }));

  expect(screen.getByText(/Rp 12.000/)).toBeInTheDocument();
});
