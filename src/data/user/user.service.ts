import { Movie } from 'data/movie/movie.type';
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
  } catch (err) {
    return {
      balance: 0,
      purchased_movies: [],
    };
  }
};

const isMoviePurchased = (id: number) => {
  try {
    const userData = getLocalData();
    return !!userData!.purchased_movies.find((movie: Movie) => movie.id === id);
  } catch (err) {
    return false;
  }
};

export default { setLocalData, getLocalData, isMoviePurchased };
