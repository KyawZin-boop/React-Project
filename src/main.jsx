import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './weatherStyle.css'
import { SpeedInsights } from '@vercel/speed-insights/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpeedInsights />
    <App />
  </StrictMode>,
)
