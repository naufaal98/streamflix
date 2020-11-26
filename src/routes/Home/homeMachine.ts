import { Machine, assign, spawn } from 'xstate';
import nowPlayingMoviesMachine from './nowPlayingMoviesMachine';

interface HomeStateSchema {
  states: {
    idle: {};
    requested: {};
  };
}

interface HomeContext {
  nextPage: number;
  nowPlayingList: any;
}

type HomeEvent = { type: 'REQUEST'; page: number };

const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>({
  id: 'Home',
  initial: 'idle',
  context: {
    nextPage: 1,
    nowPlayingList: [],
  },
  states: {
    idle: {},
    requested: {},
  },
  on: {
    REQUEST: {
      target: 'requested',
      actions: assign((context, _event) => {
        const nowPlayingMovies = spawn(nowPlayingMoviesMachine(context.nextPage));
        return {
          nowPlayingList: [...context.nowPlayingList, nowPlayingMovies],
          nextPage: context.nextPage + 1,
        };
      }),
    },
  },
});

export default homeMachine;
