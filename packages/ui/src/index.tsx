import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createClient, Provider } from "urql";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
const graphqlClient = createClient({
  url: `${process.env.REACT_APP_BACKEND_URL}`,
  suspense: true,
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider value={graphqlClient}>
        <DndProvider backend={HTML5Backend}>
          <ColorModeScript initialColorMode="dark" />
          <App />
        </DndProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
