import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PaymentsProvider } from './hooks/usePayments';
import { BrowserRouter } from 'react-router-dom';
import { ColorsProvider } from './hooks/useColors';
import { CategoriesProvider } from './hooks/useCategories';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PaymentsProvider>
        <ColorsProvider>
          <CategoriesProvider>
            <App />
          </CategoriesProvider>
        </ColorsProvider>
      </PaymentsProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
