import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Toaster></Toaster>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
