import React from 'react'

import { useDispatch } from 'react-redux'

import { get } from './redux/action'

function App(): JSX.Element {
  const dsp = useDispatch()

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={onButtonClick}>
          Edit and save to reload.
        </button>
      </header>
    </div>
  )

  function onButtonClick(): void {
    dsp(get())
  }
}

export default App
