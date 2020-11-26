import { Machine, assign, DoneInvokeEvent, spawn } from 'xstate';
import moviesMachine from './moviesMachine';

interface HomeStateSchema {
  states: {
    idle: {};
    fetched: {};
  };
}

interface HomeContext {
  page: number;
  movies: any;
}

type HomeEvent = { type: 'FETCH'; page: number };

const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>({
  id: 'Home',
  initial: 'idle',
  context: {
    page: 1,
    movies: {},
  },
  states: {
    idle: {},
    fetched: {},
  },
  on: {
    FETCH: {
      target: 'fetched',
      actions: assign((context, event) => {
        const movies = spawn(moviesMachine);
        return {
          movies: {
            ...context.movies,
            [context.page]: movies,
          },
          page: context.page + 1,
        };
      }),
    },
  },
});

export default homeMachine;
