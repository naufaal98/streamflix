import { Machine, assign, DoneInvokeEvent } from 'xstate';
import { Movie, MovieList } from 'types/Movie';
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

type MoviesEvent = { type: 'RETRY' } | { type: 'FETCH_MORE' };

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
      loaded: {
        on: {
          FETCH_MORE: {
            target: 'loading',
            actions: assign({
              page: (ctx: MoviesContext, _event) => ctx.page + 1,
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
      invokeGetMovieList: (ctx) => getNowPlayingMovies({ page: ctx.page }),
    },
  },
);

export default moviesMachine;
