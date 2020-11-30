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

it('should reach "lastPage" when requested page is greater than total_pages', (done) => {
  const mockHomeMachine = homeMachine.withContext({
    page: 1,
    total_pages: 1,
    pageFetched: [],
    movies: [],
  });

  const homeService = interpret(mockHomeMachine)
    .onTransition((state) => {
      if (state.matches('lastPage')) {
        done();
      }
    })
    .start('loaded');

  homeService.send('FETCH', { page: 2 });
});
