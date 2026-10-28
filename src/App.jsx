import PartSearch from '@/components/PartSearch.jsx'
import ManufacturersList from '@/components/ManufacturersList.jsx'
import OffersTable from '@/components/OffersTable.jsx'

function App() {
  return (
    <main className="container py-5">
      <h1 className="mb-4">Поиск автозапчастей</h1>
      <PartSearch />
      <ManufacturersList />
      <OffersTable />
    </main>
  )
}

export default App
