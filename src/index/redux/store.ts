import { applyMiddleware, compose, createStore, Store } from 'redux'

import APIMiddleware from '../../apiMiddleware'

const api = new APIMiddleware({
  headers: () => ({
    'Content-type': 'application/json',
  }),
})

const isDevelopment = process.env.NODE_ENV === 'development'

const composeEnhancer =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (isDevelopment && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

function configureStore(): Store {
  const store = createStore(
    () => ({
      testState: {
        isLoading: false,
      },
    }),
    undefined,
    composeEnhancer(applyMiddleware(api.middleware())),
  )

  return store
}

export default configureStore()
