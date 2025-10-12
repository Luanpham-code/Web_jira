import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";

import { renderRoutes } from "./routers";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>{renderRoutes()}</Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
