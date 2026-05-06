import Sidebar from '../components/Sidebar'
import useSessionTimeout from '../hooks/useSessionTimeout'

function MainLayout({ children }) {
  useSessionTimeout()

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1 min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  )
}

export default MainLayout