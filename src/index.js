import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./components/search.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
console.log(registerServiceWorker('Yeah, glad you made it, my good ol serviceworker'));
