import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store';

// Vision UI Dashboard React Context Provider
import { VisionUIControllerProvider } from "./context";

import { Web3ContextProvider } from "./utils/web3-context";

ReactDOM.render(
  <BrowserRouter>
  <VisionUIControllerProvider>
    <Web3ContextProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </Web3ContextProvider>
  </VisionUIControllerProvider>
</BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

