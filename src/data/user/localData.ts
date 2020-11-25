import { User } from 'types/User';

const FREE_BALANCE = 100000;
const CURRENT_BALANCE = 'balance';
const PURCHASED_MOVIE = 'purchased_movie';
export enum ValidationStatus {
  Valid = 'valid',
  Invalid = 'invalid',
}

export const AddInitialUserData = () => {
  const user: User = {
    balance: FREE_BALANCE,
    purchased_movies: [],
  };
  if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const addFreeBalance = () => {
  if (!localStorage.getItem(CURRENT_BALANCE)) {
    localStorage.setItem(CURRENT_BALANCE, JSON.stringify(FREE_BALANCE));
  }
};

export const getCurrentBalance = () => {
  return JSON.parse(localStorage.getItem(CURRENT_BALANCE)!) as number;
};

export const subtractBalance = (price: number) => {
  const currentBalance = JSON.parse(localStorage.getItem(CURRENT_BALANCE)!) as number;
  const newBalance = currentBalance - price;
  localStorage.setItem(CURRENT_BALANCE, JSON.stringify(newBalance));
};

export const isTheBalanceSufficient = (price: number): boolean => {
  const currentBalance = JSON.parse(localStorage.getItem(CURRENT_BALANCE)!) as number;
  return currentBalance > price;
};

export const isTheMovieAlreadyPurchased = (id: number): boolean => {
  const currentPurchasedMovie = localStorage.getItem(PURCHASED_MOVIE)
    ? JSON.parse(localStorage.getItem(PURCHASED_MOVIE)!)
    : [];
  return currentPurchasedMovie.includes(id);
};

export const validatePurchase = ({ id, price }: { id: number; price: number }) => {
  if (isTheMovieAlreadyPurchased(id)) {
    return { status: ValidationStatus.Invalid, message: 'You already purchased this movie' };
  }
  if (!isTheBalanceSufficient(price)) {
    return {
      status: ValidationStatus.Valid,
      message: `You don't have enough balance to purchase this movie`,
    };
  }
  return {
    status: ValidationStatus.Valid,
    message: '',
  };
};

export const purchaseMovie = ({ id, price }: { id: number; price: number }) => {
  const checkValidation = validatePurchase({ id, price });
  if (checkValidation.status === ValidationStatus.Invalid) {
    return { status: checkValidation.status, message: checkValidation.message };
  }
  const currentPurchasedMovie = JSON.parse(localStorage.getItem(PURCHASED_MOVIE)!) || [];
  currentPurchasedMovie.push(id);
  localStorage.setItem(PURCHASED_MOVIE, JSON.stringify(currentPurchasedMovie));
  subtractBalance(price);
  return { status: 'success', message: 'Success' };
};
