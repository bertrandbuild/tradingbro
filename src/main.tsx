import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoldRushProvider apikey={import.meta.env.VITE_COVALENT_API_KEY}>
      <App />
    </GoldRushProvider>
  </React.StrictMode>,
)
