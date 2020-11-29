import { MovieDetail } from 'data/movie/movie.type';
import { User } from 'data/user/user.type';
import { interpret } from 'xstate';
import detailMachine from './detailMachine';

const movie: MovieDetail = {
  id: 1,
  title: 'What a great Title',
  rating: 7,
  overview: 'Not bad',
  poster_path: 'somewhere',
  slug: 'what-a-great-title',
  price: 15000,
  duration: 160,
  genres: [],
  casts: [],
};

const userData: User = {
  balance: 10000,
  purchased_movies: [],
};

const mockGetMovieDetail = Promise.all([movie, { result: [] }, { result: [] }]);

const initialContext = {
  id: 1,
  movie: null,
  user: userData,
  similarMovies: [],
  recommendedMovies: [],
};

const mockDetailMachine = detailMachine.withConfig(
  {
    actions: {
      persist: () => {},
    },
    services: {
      getMovieDetail: () => mockGetMovieDetail,
    },
  },
  {
    ...initialContext,
  },
);

it('should reach "loaded.idle" when the movie is successfully fetched', (done) => {
  const detailService = interpret(mockDetailMachine)
    .onTransition((state) => {
      if (state.matches('loaded.idle')) {
        done();
      }
    })
    .start();

  detailService.send({ type: 'FETCH', id: movie.id });
});

it('should reach "loaded.purchased" if the user already purchase the movie', (done) => {
  const extendMockDetailMachine = mockDetailMachine.withContext({
    ...initialContext,
    user: {
      ...userData,
      purchased_movies: [movie],
    },
  });

  const detailService = interpret(extendMockDetailMachine)
    .onTransition((state) => {
      if (state.matches('loaded.purchased')) {
        done();
      }
    })
    .start();

  detailService.send({ type: 'FETCH', id: movie.id });
});

it('should reach "loaded.insufficientBalance" when purchasing with insufficient balance', (done) => {
  const extendMockDetailMachine = mockDetailMachine.withContext({
    ...initialContext,
    user: {
      ...userData,
      balance: 5000,
    },
    movie: {
      ...movie,
      price: 15000,
    },
  });

  const detailService = interpret(extendMockDetailMachine)
    .onTransition((state) => {
      if (state.matches('loaded.insufficientBalance')) {
        done();
      }
    })
    .start();

  detailService.send({ type: 'FETCH', id: movie.id });
  detailService.send('PURCHASE');
});

it('should reach "loaded.purchased" when purchasing with sufficient balance', (done) => {
  const extendMockDetailMachine = mockDetailMachine.withContext({
    ...initialContext,
    user: {
      ...userData,
      balance: 20000,
    },
    movie: {
      ...movie,
      price: 15000,
    },
  });

  const detailService = interpret(extendMockDetailMachine)
    .onTransition((state) => {
      if (state.matches('loaded.purchased')) {
        done();
      }
    })
    .start();

  detailService.send({ type: 'FETCH', id: movie.id });
  detailService.send('PURCHASE');
});
