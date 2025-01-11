import React from 'react';
import {Route, Routes} from "react-router-dom";
import Create from "./tests/Create";

function Tests(props) {
  return (
      <Routes>
        <Route path="create" element={<Create/>} />
      </Routes>
  );
}

export default Tests;