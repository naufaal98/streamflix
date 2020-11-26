import { Machine, assign, DoneInvokeEvent } from 'xstate';
import { Movie, MovieList } from 'data/movie/movie.type';
import { getNowPlayingMovies } from 'data/movie/movie.service';

interface MoviesStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

interface MoviesContext {
  page: number;
  movieList: Movie[];
}

type MoviesEvent = { type: 'RETRY' };

const moviesMachine = Machine<MoviesContext, MoviesStateSchema, MoviesEvent>(
  {
    id: 'Movies',
    initial: 'loading',
    context: {
      page: 1,
      movieList: [],
    },
    states: {
      loading: {
        invoke: {
          id: 'get-movie-list',
          src: 'invokeGetMovieList',
          onDone: {
            target: 'loaded',
            actions: assign<MoviesContext, DoneInvokeEvent<MovieList>>({
              movieList: (ctx: MoviesContext, event) => ctx.movieList.concat(event.data.results),
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
    actions: {
      increasePage: assign({
        page: (ctx: MoviesContext, _event) => ctx.page + 1,
      }),
    },
    services: {
      invokeGetMovieList: (ctx) => getNowPlayingMovies({ page: ctx.page }),
    },
  },
);

export default moviesMachine;
