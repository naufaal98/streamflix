import { Machine, assign, spawn } from 'xstate';
import nowPlayingMachine from './nowPlayingMachine';

interface HomeStateSchema {
  states: {
    idle: {};
    requested: {};
  };
}

interface HomeContext {
  nextPage: number;
  nowPlayingList: any;
  isPreviousRequestSuccess: boolean;
}

type HomeEvent = { type: 'REQUEST' } | { type: 'UPDATE.STATUS'; status: boolean };

const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>({
  id: 'Home',
  initial: 'idle',
  context: {
    isPreviousRequestSuccess: true,
    nextPage: 1,
    nowPlayingList: [],
  },
  states: {
    idle: {},
    requested: {},
  },
  on: {
    REQUEST: {
      cond: (ctx): boolean => ctx.isPreviousRequestSuccess,
      target: 'requested',
      actions: assign((context, _event) => {
        const nowPlayingMovies = spawn(nowPlayingMachine(context.nextPage));
        return {
          nowPlayingList: [...context.nowPlayingList, nowPlayingMovies],
          nextPage: context.nextPage + 1,
        };
      }),
    },
    'UPDATE.STATUS': {
      target: 'requested',
      actions: assign((context, event) => {
        return {
          ...context,
          isPreviousRequestSuccess: event.status,
        };
      }),
    },
  },
});

export default homeMachine;
