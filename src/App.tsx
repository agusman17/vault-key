import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { VaultLayout } from './components/vault'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/vault" replace />} />
        <Route
          path="/vault"
          element={
            <RequireAuth>
              <VaultLayout />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
