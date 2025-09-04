import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AllPools from './pages/AllPools'
import CreatePool from './pages/CreatePool'
import PoolDetails from './pages/PoolDetails'
import QuoteDebug from './pages/QuoteDebug'
import Leaderboard from './pages/Leaderboard'
import NoAuction from './pages/NoAuction'
import CreateNoAuctionToken from './pages/CreateNoAuctionToken'
import NoAuctionPoolDetails from './pages/NoAuctionPoolDetails'
import { Navbar } from './components/ui/navbar'
import Sidebar from './components/ui/sidebar'
import FooterNav from './components/ui/footerNav'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-background cyber-grid flex">
            {/* Sidebar: hidden on mobile */}
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <div className="flex-1 min-h-screen bg-gradient-to-b from-primary/5 via-background to-background md:ml-64">
              <Navbar />
              <main className="container mx-auto pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<AllPools />} />
                  <Route path="/create" element={<CreatePool />} />
                  <Route path="/pool/:address" element={<PoolDetails />} />
                  <Route path="/debug/quote" element={<QuoteDebug />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/no-auction" element={<NoAuction />} />
                  <Route path="/create-no-auction" element={<CreateNoAuctionToken />} />
                  <Route path="/no-auction/pool/:address" element={<NoAuctionPoolDetails />} />
                </Routes>
              </main>
              {/* Mobile Footer Nav */}
              <FooterNav />
            </div>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
