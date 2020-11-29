import { Machine, assign } from 'xstate';
import MovieService from 'data/movie/movie.service';
import { Movie, MovieDetail } from 'data/movie/movie.type';
import { User } from 'data/user/user.type';
import isMoviePurchased from 'utils/isMoviePurchased';

interface DetailStateSchema {
  states: {
    idle: {};
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
  similarMovies: Movie[];
  recommendedMovies: Movie[];
}

type DetailEvent = { type: 'FETCH'; id: number } | { type: 'PURCHASE' } | { type: 'RETRY' };

const detailMachine = Machine<DetailContext, DetailStateSchema, DetailEvent>(
  {
    id: 'Detail',
    initial: 'idle',
    context: {
      id: null,
      user: {
        balance: 0,
        purchased_movies: [],
      },
      movie: null,
      similarMovies: [],
      recommendedMovies: [],
    },
    states: {
      idle: {},
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
            always: [{ target: 'purchased', cond: 'isMoviePurchased' }],
          },
          insufficientBalance: {},
          purchasing: {
            invoke: {
              id: 'purchase-movie',
              src: 'purchaseMovie',
              onDone: {
                target: 'purchased',
                actions: ['updateUserPurchasedData', 'persist'],
              },
            },
          },
          purchased: {},
        },
        on: {
          PURCHASE: [
            {
              cond: 'isMoviePurchased',
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
    on: {
      FETCH: {
        target: 'loading',
        actions: assign({
          id: (_ctx, event) => event.id,
        }),
      },
    },
  },
  {
    guards: {
      isMoviePurchased: (ctx): boolean =>
        isMoviePurchased({ purchased_movies: ctx.user.purchased_movies, id: ctx.movie!.id }),
      isBalanceInsufficient: (ctx): boolean => ctx.user.balance < ctx.movie!.price,
    },
    actions: {
      updateUserPurchasedData: assign({
        user: (context, _event) => ({
          balance: context.user.balance - context.movie!.price,
          purchased_movies: [
            ...context.user.purchased_movies,
            {
              id: context.movie!.id,
              title: context.movie!.title,
              rating: context.movie!.rating,
              overview: context.movie!.overview,
              poster_path: context.movie!.poster_path,
              slug: context.movie!.slug,
              price: context.movie!.price,
            },
          ],
        }),
      }),
      storeMovieData: assign({
        movie: (_ctx, event: any) => event.data[0],
        similarMovies: (_ctx, event: any) => event.data[1].results,
        recommendedMovies: (_ctx, event: any) => event.data[2].results,
      }),
    },
    services: {
      getMovieDetail: (ctx) =>
        Promise.all([
          MovieService.getDetail(ctx.id!),
          MovieService.getSimilar(ctx.id!, { page: 1 }),
          MovieService.getRecommended(ctx.id!, { page: 1 }),
        ]),
      purchaseMovie: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 500);
        }),
    },
  },
);

export default detailMachine;
