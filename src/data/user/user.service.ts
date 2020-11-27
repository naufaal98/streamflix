import { User } from 'data/user/user.type';

const FREE_BALANCE = 100000;

const setInitialData = () => {
  const user: User = {
    balance: FREE_BALANCE,
    purchased_movies: [],
  };
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const setLocalData = (user: User) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

const getLocalData = () => {
  try {
    if (!localStorage.getItem('user')) return setInitialData();
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

export default { setLocalData, getLocalData };
