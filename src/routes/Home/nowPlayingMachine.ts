import { Machine, assign, DoneInvokeEvent, sendParent } from 'xstate';
import { Movie, MovieList } from 'data/movie/movie.type';
import { getNowPlayingMovies } from 'data/movie/movie.service';

export interface NowPlayingStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

export interface NowPlayingContext {
  page: number;
  movieList: Movie[];
}

export type NowPlayingEvent = { type: 'RETRY' };

const createNowPlayingMachine = (page: number) =>
  Machine<NowPlayingContext, NowPlayingStateSchema, NowPlayingEvent>(
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
              actions: [
                assign<NowPlayingContext, DoneInvokeEvent<MovieList>>({
                  movieList: (ctx: NowPlayingContext, event) =>
                    ctx.movieList.concat(event.data.results),
                }),
                sendParent({ type: 'UPDATE.STATUS', status: true }),
              ],
            },
            onError: {
              target: 'failure',
              actions: sendParent({ type: 'UPDATE.STATUS', status: false }),
            },
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

export default createNowPlayingMachine;
