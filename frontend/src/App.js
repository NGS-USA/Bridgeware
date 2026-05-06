import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
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
import Account from './pages/Account'
import AuditLog from './pages/AuditLog'
import NewTicket from './pages/NewTicket'
import NewCompany from './pages/NewCompany'
import NewContact from './pages/NewContact'
import NewOpportunity from './pages/NewOpportunity'
import NewQuote from './pages/NewQuote'
import NewInvoice from './pages/NewInvoice'
import NewProject from './pages/NewProject'
import NewTask from './pages/NewTask'
import NewEmployee from './pages/NewEmployee'
import NewPTORequest from './pages/NewPTORequest'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ticketing" element={<Ticketing />} />
                  <Route path="/crm" element={<CRM />} />
                  <Route path="/sales" element={<Opportunities />} />
                  <Route path="/invoicing" element={<Invoicing />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/hr" element={<HR />} />
                  <Route path="/erp" element={<ERP />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/workflows" element={<Workflows />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/audit-log" element={<AuditLog />} />
                  <Route path="/ticketing/new" element={<NewTicket />} />
                  <Route path="/crm/new" element={<NewCompany />} />
                  <Route path="/crm/contacts/new" element={<NewContact />} />
                  <Route path="/sales/new" element={<NewOpportunity />} />
                  <Route path="/sales/quotes/new" element={<NewQuote />} />
                  <Route path="/invoicing/new" element={<NewInvoice />} />
                  <Route path="/projects/new" element={<NewProject />} />
                  <Route path="/projects/tasks/new" element={<NewTask />} />
                  <Route path="/hr/new" element={<NewEmployee />} />
                  <Route path="/hr/pto/new" element={<NewPTORequest />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App