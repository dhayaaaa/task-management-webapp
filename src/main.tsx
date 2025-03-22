import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <StrictMode>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error(
    "Root container not found! Did you forget <div id='root'></div> in index.html?"
  );
}


function Main() {
  const navigate = useNavigate();

  const goToSecondsComp = () => {
    // This will navigate to second component
    navigate("/second");
  };
  const gotToFirstComp = () => {
    // This will navigate to first component
    navigate("/first");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Main components</p>
        <button className="directpage" onClick={goToSecondsComp}>
          go to 2nd
        </button>
        <button className="directpage" onClick={gotToFirstComp}>
          go to 1st
        </button>
      </header>
    </div>
  );
}

export default Main;
