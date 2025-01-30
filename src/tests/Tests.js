import React from 'react';
import {Route, Routes} from "react-router-dom";
import Create from "./Create";
import TestHomePage from "./TestHomePage";
import Edit from "./Edit";
import Take from "./Take";

function Tests() {
  return (
      <Routes>
        <Route path="/" element={<TestHomePage/>} />
        <Route path="create" element={<Create/>} />
        <Route path="edit/:id" element={<Edit/>}/>
        <Route path="take/:id" element={<Take/>}/>
      </Routes>
  );
}

export default Tests;