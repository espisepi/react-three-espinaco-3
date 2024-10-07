import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import MinecraftApp from './features/r3f/minecraft/apps/MinecraftApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <MinecraftApp />
  </StrictMode>,
)
