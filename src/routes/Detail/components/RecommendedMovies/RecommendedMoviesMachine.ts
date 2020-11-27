import { Machine, assign, DoneInvokeEvent } from 'xstate';
import { Movie, MovieList } from 'data/movie/movie.type';
import MovieService from 'data/movie/movie.service';

interface RecommendedMoviesStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

interface RecommendedMoviesContext {
  id: number;
  movieList: Movie[];
}

type RecommendedMoviesEvent = { type: 'RETRY' };

const createRecommendedMoviesMachine = (id: number) =>
  Machine<RecommendedMoviesContext, RecommendedMoviesStateSchema, RecommendedMoviesEvent>(
    {
      initial: 'loading',
      context: {
        id,
        movieList: [],
      },
      states: {
        loading: {
          invoke: {
            id: 'get-recommended-movies',
            src: 'getRecommendedMovies',
            onDone: {
              target: 'loaded',
              actions: assign<RecommendedMoviesContext, DoneInvokeEvent<MovieList>>({
                movieList: (_ctx, event: any) => event.data,
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
      },
    },
    {
      services: {
        getRecommendedMovies: (ctx) => MovieService.getRecommended(ctx.id, { page: 1 }),
      },
    },
  );

export default createRecommendedMoviesMachine;
