import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { usePools, PoolFilter } from "@/hooks/usePools"
import { Pool, Token } from "@/utils/graphql"
import { formatEther } from "viem"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function PoolCard({ pool }: { pool: Pool }) {
  // pool.baseToken now includes creatorAddress (optional)
  // Get holders and activities from pool if available
  const holders = (pool as any).holders ?? 'N/A';
  const activities = (pool as any).activities ?? 'N/A';
  // Get token price from pool.price (bigint, in USD)
  function getTokenPrice() {
    if (pool.price && pool.price > 0n) {
      return Number(formatEther(pool.price));
    }
    return null;
  }
  const formatNumber = (value: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(formatEther(value)))
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  return (
    <div className="border border-primary/20 rounded-lg p-3 bg-card/50 backdrop-blur hover:border-primary/40 transition-all flex flex-col gap-2 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            {pool.baseToken.symbol}/{pool.quoteToken.symbol}
          </h2>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
            {pool.baseToken.name} / {pool.quoteToken.name}
          </p>
          {/* Owner/Creator */}
          {pool.baseToken.creatorAddress && (
            <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]">
              Owner/Creator: <span className="font-mono">{pool.baseToken.creatorAddress}</span>
            </p>
          )}
        </div>
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {pool.type === 'v4' ? '🚀' : '📊'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-1">
        <div>
          <span className="text-muted-foreground">Market Cap</span>
          <div>{pool.asset ? formatNumber(BigInt(pool.asset.marketCapUsd)) : '$0'}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Liquidity</span>
          <div>{pool.dollarLiquidity ? formatNumber(pool.dollarLiquidity) : '$0'}</div>
        </div>
        <div>
          <span className="text-muted-foreground">24h Volume</span>
          <div>{pool.dailyVolume ? formatNumber(BigInt(pool.dailyVolume.volumeUsd)) : '$0'}</div>
        </div>
        <div>
          <span className="text-muted-foreground">24h Change</span>
          <div className={pool.percentDayChange >= 0 ? 'text-green-500' : 'text-red-500'}>
            {formatPercent(pool.percentDayChange)}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Holders</span>
          <div>{holders}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Activities</span>
          <div>{activities}</div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div>
          <span className="text-xs text-muted-foreground">Token Price</span>
          <span className="text-sm font-mono">
            {getTokenPrice() !== null && getTokenPrice() > 0
              ? `$${getTokenPrice()!.toFixed(4)}`
              : 'N/A'}
          </span>
        </div>
        <Link to={`/pool/${pool.address}?chainId=${pool.chainId}`}>
          <Button variant="secondary" className="w-full">View</Button>
        </Link>
      </div>
    </div>
  )
}

export default function AllPools() {
  const [poolFilter, setPoolFilter] = useState<PoolFilter>("all")
  const { data: pools, isLoading, error } = usePools(poolFilter)

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Loading Pools...</h1>
        <div className="grid gap-6">
          <div className="border border-primary/20 rounded-lg p-6 bg-card/50 backdrop-blur animate-pulse">
            <div className="h-8 bg-primary/20 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-2/3 mb-6"></div>
            <div className="h-10 bg-primary/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Error Loading Pools</h1>
        <div className="text-red-500">{(error as Error).message}</div>
      </div>
    )
  }

  // Stats for cards
  const activePools = pools?.items?.length ?? 0;
  const totalMarketcap = pools?.items?.reduce((acc, pool) => acc + Number(pool.asset?.marketCapUsd ?? 0), 0) ?? 0;
  const staticPools = pools?.items?.filter(pool => pool.type !== 'v4').length ?? 0;
  const dynamicPools = pools?.items?.filter(pool => pool.type === 'v4').length ?? 0;

  // Helper to format large numbers compactly
  function compactNumber(num: number, forceInt = false) {
    if (forceInt && num < 1000) return Math.round(num).toString();
    if (num >= 1e12) return (num / 1e12).toPrecision(3) + 'T';
    if (num >= 1e9) return (num / 1e9).toPrecision(3) + 'B';
    if (num >= 1e6) return (num / 1e6).toPrecision(3) + 'M';
    if (num >= 1e3) return (num / 1e3).toPrecision(3) + 'K';
    return num.toPrecision(3);
  }

  return (
    <div className="p-8">
      {/* Compact Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <span className="text-lg font-bold">{compactNumber(activePools)}</span>
          <span className="text-[10px] text-muted-foreground mt-1">Active Pools</span>
        </div>
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <span className="text-lg font-bold">${compactNumber(totalMarketcap)}</span>
          <span className="text-[10px] text-muted-foreground mt-1">Marketcap</span>
        </div>
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <span className="text-lg font-bold">{compactNumber(staticPools, true)}</span>
          <span className="text-[10px] text-muted-foreground mt-1">📊 Static Only</span>
        </div>
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <span className="text-lg font-bold">{compactNumber(dynamicPools, true)}</span>
          <span className="text-[10px] text-muted-foreground mt-1">🚀 Dynamic Only</span>
        </div>
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <Link to="/debug/quote" className="text-primary font-bold underline text-sm">Quote Debugger</Link>
          <span className="text-[10px] text-muted-foreground mt-1">Quick Quotes</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Active Pools</h1>
        <div className="flex items-center gap-2">
          <Link to="/debug/quote">
            <Button variant="outline">Quote Debugger</Button>
          </Link>
        </div>
      </div>
      
      <Tabs value={poolFilter} onValueChange={(value) => setPoolFilter(value as PoolFilter)} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Pools</TabsTrigger>
          <TabsTrigger value="static">📊 Static Only</TabsTrigger>
          <TabsTrigger value="dynamic">🚀 Dynamic Only</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {pools?.items?.map((pool) => (
          <PoolCard key={pool.address} pool={pool} />
        ))}
      </div>
      <Link to="/create" className="fixed bottom-8 right-8">
        <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40">
          Create New Pool
        </Button>
      </Link>
    </div>
  )
}
