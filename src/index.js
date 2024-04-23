import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routing from './Routing';
render(
  <BrowserRouter>
    <Routing />
  </BrowserRouter>,
  document.getElementById('root')
);
