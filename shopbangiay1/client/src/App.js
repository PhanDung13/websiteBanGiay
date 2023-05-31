import "./App.css";
import "antd/dist/antd.min.css";

import { BrowserRouter as Router } from "react-router-dom";
import AppRoutesComponent from "./routes/index";
import { Provider } from "react-redux";
import { persistor, store } from "redux/store";
import { PersistGate } from "redux-persist/integration/react";

import AppContainer from "AppContainer";
import DataProvider from "DataProvider";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <DataProvider>
              <AppContainer>
                <AppRoutesComponent />
              </AppContainer>
            </DataProvider>
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
