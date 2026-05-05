import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import Ticketing from './pages/Ticketing'
import CRM from './pages/CRM'
import Login from './pages/Login'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<div className="p-8 text-xl font-medium text-gray-800">Welcome to Bridgeware</div>} />
            <Route path="/ticketing" element={<Ticketing />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App