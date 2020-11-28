import { Machine, assign } from 'xstate';
import MovieService from 'data/movie/movie.service';
import { MovieDetail } from 'data/movie/movie.type';
import { User } from 'data/user/user.type';

interface DetailStateSchema {
  states: {
    loading: {};
    failure: {};
    loaded: {
      states: {
        idle: {};
        insufficientBalance: {};
        purchasing: {};
        purchased: {};
      };
    };
  };
}

export interface DetailContext {
  id: number | null;
  user: User;
  movie: MovieDetail | null;
}

type DetailEvent = { type: 'PURCHASE' } | { type: 'RETRY' };

const detailMachine = Machine<DetailContext, DetailStateSchema, DetailEvent>(
  {
    id: 'Detail',
    initial: 'loading',
    context: {
      id: null,
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
            actions: 'storeMovieData',
          },
          onError: 'failure',
        },
      },
      loaded: {
        initial: 'idle',
        states: {
          idle: {
            always: [{ target: 'purchased', cond: 'isMovieAlreadyPurchased' }],
          },
          insufficientBalance: {},
          purchasing: {
            invoke: {
              id: 'purchase-movie',
              src: 'purchaseMovie',
              onDone: {
                target: 'purchased',
                actions: ['assignUserContext', 'persist'],
              },
            },
          },
          purchased: {},
        },
        on: {
          PURCHASE: [
            {
              cond: 'isMovieAlreadyPurchased',
              target: 'loaded.purchased',
            },
            {
              cond: 'isBalanceInsufficient',
              target: 'loaded.insufficientBalance',
            },
            {
              target: 'loaded.purchasing',
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
      isMovieAlreadyPurchased: (ctx): boolean => ctx.user.purchased_movies.includes(ctx.movie!.id),
      isBalanceInsufficient: (ctx): boolean => ctx.user.balance < ctx.movie!.price,
    },
    actions: {
      assignUserContext: assign({
        user: (context, _event) => ({
          balance: context.user.balance - context.movie!.price,
          purchased_movies: [...context.user.purchased_movies, context.id!],
        }),
      }),
      storeMovieData: assign({
        movie: (_ctx, event: any) => event.data,
      }),
    },
    services: {
      getMovieDetail: (ctx) => MovieService.getDetail(ctx.id!),
      purchaseMovie: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 2000);
        }),
    },
  },
);

export default detailMachine;