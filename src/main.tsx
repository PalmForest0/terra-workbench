import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'

import './styles/index.scss'

import App from './App.tsx'
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <CookiesProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </CookiesProvider>
);