import PortalLayout from '../../layouts/PortalLayout'

function PortalDocuments() {
  return (
    <PortalLayout>
      <div className="p-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Documents</h1>
        <div className="text-gray-400 text-sm">No documents shared yet.</div>
      </div>
    </PortalLayout>
  )
}

export default PortalDocuments