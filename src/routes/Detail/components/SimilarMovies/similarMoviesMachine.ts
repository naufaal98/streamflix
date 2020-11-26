import { Machine, assign, DoneInvokeEvent } from 'xstate';
import { Movie, MovieList } from 'data/movie/movie.type';
import { getSimilarMovies } from 'data/movie/movie.service';

interface SimilarMoviesStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

interface SimilarMoviesContext {
  id: number;
  movieList: Movie[];
}

type SimilarMoviesEvent = { type: 'RETRY' };

const createRecommendationMoviesMachine = (id: number) =>
  Machine<SimilarMoviesContext, SimilarMoviesStateSchema, SimilarMoviesEvent>(
    {
      initial: 'loading',
      context: {
        id,
        movieList: [],
      },
      states: {
        loading: {
          invoke: {
            id: 'get-recommendation-movies',
            src: 'getSimilarMovies',
            onDone: {
              target: 'loaded',
              actions: assign<SimilarMoviesContext, DoneInvokeEvent<MovieList>>({
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
        getSimilarMovies: (ctx) => getSimilarMovies(ctx.id, { page: 1 }),
      },
    },
  );

export default createRecommendationMoviesMachine;
