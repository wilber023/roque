import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cassandra from './Casandra.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cassandra />
  </StrictMode>,
)
