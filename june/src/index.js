import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter
} from "react-router-dom";
import "react-metismenu/dist/react-metismenu-standart.min.css";
import "./css/font-awesome.min.css";
import 'react-table/react-table.css';


ReactDOM.render(<BrowserRouter>
  <App />
</BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();