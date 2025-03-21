import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import First from "./first";



const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/first" element={<First />} />
        </Routes>
      </Router>
     
    </div>
    
  );
};

export default App;
