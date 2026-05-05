import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import Ticketing from './pages/Ticketing'
import CRM from './pages/CRM'
import Opportunities from './pages/Opportunities'
import Invoicing from './pages/Invoicing'
import Projects from './pages/Projects'
import HR from './pages/HR'
import ERP from './pages/ERP'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Workflows from './pages/Workflows'

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
            <Route path="/sales" element={<Opportunities />} />
            <Route path="/invoicing" element={<Invoicing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/erp" element={<ERP />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/workflows" element={<Workflows />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App