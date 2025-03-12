// import store from "../store/store.js";

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//       <Toaster />
//     </BrowserRouter>
//   </Provider>
// );


import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/toaster.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
    <Toaster />
  </Provider>
);
