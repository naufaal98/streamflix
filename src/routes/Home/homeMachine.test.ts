import { interpret } from 'xstate';
import homeMachine from './homeMachine';

const mockInvokeGetMovieList = (status: 'success' | 'error') =>
  new Promise((resolve, reject) => {
    if (status === 'success') {
      resolve({ success: true });
    } else {
      reject();
    }
  });

it('should reach "loaded" when data fetched successfully ', (done) => {
  const mockHomeMachine = homeMachine.withConfig({
    services: {
      invokeGetMovieList: (ctx) => mockInvokeGetMovieList('success'),
    },
  });

  interpret(mockHomeMachine)
    .onTransition((state) => {
      if (state.matches('loaded')) {
        done();
      }
    })
    .start();
});

it('should reach "failure" when service throw error', (done) => {
  const mockHomeMachine = homeMachine.withConfig({
    services: {
      invokeGetMovieList: () => mockInvokeGetMovieList('error'),
    },
  });

  interpret(mockHomeMachine)
    .onTransition((state) => {
      if (state.matches('failure')) {
        done();
      }
    })
    .start();
});
