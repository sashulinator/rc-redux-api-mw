## What is it?

Simple API middleware

### Usage

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
