## What is it?

Simple API middleware

## Features

- No dependencies
- Neat JWT token refreshing
- Neat error handling
- Request aborting
- [Pass queries as an object](#pass-queries-as-an-object)

## Usage

```js
import { REDUX_API_MIDDLEWARE } from '@savchenko91/rc-redux-api-mw'

const SAVE_CAT = {
  START: 'CATS | SAVE | START',
  FAIL: 'CATS | SAVE | FAIL',
  SUCCESS: 'CATS | SAVE | SUCCESS',
}

const saveCat = (id, body, onSuccess) => ({
  type: REDUX_API_MIDDLEWARE,
  url: `/api/v1/cats/${id}`,
  method: 'post',
  stageActionTypes: SAVE_CAT,
  body,
  onSuccess,
})
```

### Connect

```ts
import { applyMiddleware, compose, createStore, Store } from 'redux'
import rootReducer from 'path/to/rootReducer'
import preloadedState from 'path/to/preloadedState'

const api = new APIMiddleware({
  headers: () => {
    return new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
    })
  },
})

const store = createStore(rootReducer, preloadedState, composeEnhancer(applyMiddleware(api.middleware())))
```

<!-- ### JWT token refreshing -->

### Error handling

```ts
const api = new APIMiddleware({
  // handles responses with no ok status and failed requests
  onFail({ body, response, error }) {
    const requestErrorMessage = error ?? `Cannot make a request: ${error.toString()}`

    const err = body.errorDescription || requestErrorMessage

    if (!err) return

    showMessage(err, { type: 'error' })
  },
})
```

### Request aborting

You have a music mixer and the mixing is doing on a server. Sometimes it takes 30 seconds to compile so user can change something and makes a new request without receiving response from previous one.

```ts
const [mixAbortController, setMixAbortController] = useState<AbortController>(null)

dispatch(
  mixerActions.mix({
    onStart({ abortController }) {
      mixAbortController?.abort()
      setMixAbortController(abortController)
    },
  }),
)
```

Or you can store AbortController in redux store

```ts
const initialStore = {
  abortController: null
  url: ''
  error: ''
}

function mixReducer(store = initialStore, action) {
  const { type, abortController, error, body  } = action

    switch (action.type) {
      case CONSTANTS.GET_ONE?.START:
        // not the best place for this but as an option
        state.abortController.abort()

        return {
          ...state,
          url: ''
          abortController,
          error: '',
        }
      case this.constants?.REFRESH_LIST?.FAIL:
        return {
          ...state,
          error: body.errorMessage || error
        }
      case this.constants?.REFRESH_LIST?.SUCCESS:
        return {
          ...state,
          url: body.url
          error: '',
        }
    }
}
```

### Pass queries as an object

[rc-redux-api-mw-query](https://www.npmjs.com/package/@savchenko91/rc-redux-api-mw-query)

## Additional

### Pass to a store some data

```ts
const mix = ({ data, projectId }) => {
  return {
    url: `/api/v1/mixer/${projectId}/mix`
    type,
    stageActionTypes,
    method,
    body: data,
    // see payload?
    payload: data
  }
}

function mixReducer(store = initialStore, action) {
  // here is your payload
  const { type, abortController, error, body, action: { payload } } = action
  // ...
}
```
