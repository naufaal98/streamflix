import { Machine, assign } from 'xstate';
import { getMovieDetail } from 'data/movie/movie.service';
import { MovieDetail } from 'data/movie/movie.type';
import { User } from 'types/User';

interface MovieStateSchema {
  states: {
    loading: {};
    failure: {};
    loaded: {
      states: {
        idle: {};
        insufficientBalance: {};
        movieAlreadyPurchased: {};
        purchaseSuccess: {};
      };
    };
  };
}

export interface MovieContext {
  id: number;
  user: User;
  movie: MovieDetail | null;
}

type MovieEvent = { type: 'PURCHASE' } | { type: 'RETRY' };

const createMovieMachine = (id: number) =>
  Machine<MovieContext, MovieStateSchema, MovieEvent>(
    {
      id: 'Movie',
      initial: 'loading',
      context: {
        id,
        user: {
          balance: 0,
          purchased_movies: [],
        },
        movie: null,
      },
      states: {
        loading: {
          invoke: {
            id: 'get-movie-detail',
            src: 'getMovieDetail',
            onDone: {
              target: 'loaded',
              actions: 'addMovieData',
            },
            onError: 'failure',
          },
        },
        loaded: {
          initial: 'idle',
          states: {
            idle: {
              always: [{ target: 'movieAlreadyPurchased', cond: 'isMovieAlreadyPurchased' }],
            },
            movieAlreadyPurchased: {},
            insufficientBalance: {},
            purchaseSuccess: {},
          },
          on: {
            PURCHASE: [
              {
                cond: 'isMovieAlreadyPurchased',
                target: 'loaded.movieAlreadyPurchased',
              },
              {
                cond: 'isBalanceInsufficient',
                target: 'loaded.insufficientBalance',
              },
              {
                actions: ['purchaseMovie', 'persist'],
                target: 'loaded.purchaseSuccess',
              },
            ],
          },
        },
        failure: {
          on: {
            RETRY: 'loading',
          },
        },
      },
    },
    {
      guards: {
        isMovieAlreadyPurchased: (ctx): boolean => ctx.user.purchased_movies.includes(id),
        isBalanceInsufficient: (ctx): boolean => ctx.user.balance < ctx.movie!.price,
      },
      actions: {
        purchaseMovie: assign({
          user: (context, _event) => ({
            balance: context.user.balance - context.movie!.price,
            purchased_movies: [...context.user.purchased_movies, context.id],
          }),
        }),
        addMovieData: assign({
          movie: (_ctx, event: any) => event.data,
        }),
      },
      services: {
        getMovieDetail: (ctx) => getMovieDetail(ctx.id),
      },
    },
  );

export default createMovieMachine;
