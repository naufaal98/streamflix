import { Machine, assign } from 'xstate';
import { getMovieDetail } from 'data/movie/movie.service';
import { MovieDetail } from 'types/Movie';
import { User } from 'types/User';

interface MovieStateSchema {
  states: {
    loading: {};
    failure: {};
    loaded: {};
    buyingMovie: {};
  };
}

interface MovieContext {
  id: number;
  user: User | null;
  movie: MovieDetail | null;
}

type MovieEvent = { type: 'BUY' } | { type: 'RETRY' };

const createMovieMachine = (id: number) =>
  Machine<MovieContext, MovieStateSchema, MovieEvent>(
    {
      id: 'Movie',
      initial: 'loading',
      context: {
        id,
        user: null,
        movie: null,
      },
      states: {
        loading: {
          invoke: {
            id: 'get-movie-detail',
            src: 'getMovieDetail',
            onDone: {
              target: 'loaded',
              actions: assign({
                movie: (_ctx, event: any) => event.data,
              }),
            },
            onError: 'failure',
          },
        },
        loaded: {},
        failure: {
          on: {
            RETRY: 'loading',
          },
        },
        buyingMovie: {},
      },
    },
    {
      services: {
        getMovieDetail: (ctx) => getMovieDetail(ctx.id),
      },
    },
  );

export default createMovieMachine;
