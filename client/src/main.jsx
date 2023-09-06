import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { StoreProvider } from './Store.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
