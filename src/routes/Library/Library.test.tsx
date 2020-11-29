import { Movie } from 'data/movie/movie.type';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from 'context/UserContext';
import { render, screen } from '@testing-library/react';
import { User } from 'data/user/user.type';
import Library from './Library';

const fakeMovies: Movie[] = [
  {
    id: 1,
    title: 'What a great Title',
    rating: 7,
    overview: 'Not bad',
    poster_path: 'somewhere',
    slug: 'what-a-great-title',
    price: 15000,
  },
];

const userData: User = {
  balance: 10000,
  purchased_movies: fakeMovies,
};

test(`renders the user's purchased movies`, () => {
  render(
    <Router>
      <UserContext.Provider value={{ userData, syncUserContext: jest.fn() }}>
        <Library />
      </UserContext.Provider>
    </Router>,
  );

  expect(screen.getByText(fakeMovies[0].title)).toBeInTheDocument();
});

test('renders feedback when purchased movies are empty', () => {
  render(
    <Router>
      <UserContext.Provider
        value={{ userData: { balance: 0, purchased_movies: [] }, syncUserContext: jest.fn() }}
      >
        <Library />
      </UserContext.Provider>
    </Router>,
  );

  expect(screen.getByRole('status')).toMatchSnapshot();
});
