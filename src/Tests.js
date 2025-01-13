import React from 'react';
import {Route, Routes} from "react-router-dom";
import Create from "./tests/Create";
import TestHomePage from "./tests/TestHomePage";

function Tests(props) {
  return (
      <Routes>
        <Route path="/" element={<TestHomePage/>} />
        <Route path="create" element={<Create/>} />
      </Routes>
  );
}

export default Tests;