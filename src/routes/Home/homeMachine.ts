import { Machine, assign, DoneInvokeEvent } from 'xstate';
import { Movie, MovieList } from 'data/movie/movie.type';
import MovieService from 'data/movie/movie.service';

export interface HomeStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

export interface HomeContext {
  page: number;
  pageFetched: number[];
  movies: Movie[];
}

export type HomeEvent = { type: 'RETRY' } | { type: 'FETCH'; page: number };

const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>(
  {
    id: 'Home',
    initial: 'loading',
    context: {
      page: 1,
      pageFetched: [],
      movies: [],
    },
    states: {
      loading: {
        invoke: {
          id: 'get-movie-list',
          src: 'invokeGetMovieList',
          onDone: {
            target: 'loaded',
            actions: assign<HomeContext, DoneInvokeEvent<MovieList>>({
              movies: (ctx: HomeContext, event) => ctx.movies.concat(event.data.results),
              pageFetched: (ctx) => ctx.pageFetched.concat(ctx.page),
            }),
          },
          onError: 'failure',
        },
      },
      loaded: {
        on: {
          FETCH: {
            cond: (ctx, event) => !ctx.pageFetched.includes(event.page),
            target: 'loading',
            actions: assign({
              page: (_ctx, event) => event.page,
            }),
          },
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
    services: {
      invokeGetMovieList: (ctx) => MovieService.getNowPlaying({ page: ctx.page }),
    },
  },
);

export default homeMachine;
