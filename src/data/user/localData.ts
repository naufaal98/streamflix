import { User } from 'types/User';

const FREE_BALANCE = 100000;

export const setInitialUserData = () => {
  const user: User = {
    balance: FREE_BALANCE,
    purchased_movies: [],
  };

  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const setLocalUserData = (user: User) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export const getLocalUserData = () => {
  try {
    if (!localStorage.getItem('user')) {
      return setInitialUserData();
    }

    const user = JSON.parse(localStorage.getItem('user')!) || [];
    return {
      balance: user.balance,
      purchased_movies: user.purchased_movies || [],
    };
  } catch (e) {
    return {
      balance: 0,
      purchased_movies: [],
    };
  }
};
