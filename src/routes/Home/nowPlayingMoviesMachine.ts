import { Machine, assign, DoneInvokeEvent } from 'xstate';
import { Movie, MovieList } from 'data/movie/movie.type';
import { getNowPlayingMovies } from 'data/movie/movie.service';

export interface NowPlayingMoviesStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

export interface NowPlayingMoviesContext {
  page: number;
  movieList: Movie[];
}

export type NowPlayingMoviesEvent = { type: 'RETRY' };

const createNowPlayingMoviesMachine = (page: number) =>
  Machine<NowPlayingMoviesContext, NowPlayingMoviesStateSchema, NowPlayingMoviesEvent>(
    {
      id: 'Movies',
      initial: 'loading',
      context: {
        page,
        movieList: [],
      },
      states: {
        loading: {
          invoke: {
            id: 'get-movie-list',
            src: 'invokeGetMovieList',
            onDone: {
              target: 'loaded',
              actions: assign<NowPlayingMoviesContext, DoneInvokeEvent<MovieList>>({
                movieList: (ctx: NowPlayingMoviesContext, event) =>
                  ctx.movieList.concat(event.data.results),
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
        invokeGetMovieList: (ctx) => getNowPlayingMovies({ page: ctx.page }),
      },
    },
  );

export default createNowPlayingMoviesMachine;
