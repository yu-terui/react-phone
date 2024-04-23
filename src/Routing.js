import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Top from './components/Top';

function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Top/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default Routing;
