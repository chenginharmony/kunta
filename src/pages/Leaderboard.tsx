import { usePools } from "@/hooks/usePools";
import { Pool } from "@/utils/graphql";
import { useMemo } from "react";

interface UserStats {
  address: string;
  poolsCreated: number;
  totalVolume: number;
}

export default function Leaderboard() {
  const { data: pools, isLoading, error } = usePools("all");

  // Aggregate user stats
  const leaderboard: UserStats[] = useMemo(() => {
    if (!pools?.items) return [];
    const stats: Record<string, UserStats> = {};
    pools.items.forEach((pool: Pool) => {
      const creator = pool.creator ?? pool.owner ?? "Unknown";
      if (!stats[creator]) {
        stats[creator] = {
          address: creator,
          poolsCreated: 0,
          totalVolume: 0,
        };
      }
      stats[creator].poolsCreated += 1;
      stats[creator].totalVolume += Number(pool.dailyVolume?.volumeUsd ?? 0);
    });
    return Object.values(stats).sort((a, b) => b.totalVolume - a.totalVolume);
  }, [pools]);

  // Stats for cards
  const activePools = pools?.items?.length ?? 0;
  const totalMarketcap = pools?.items?.reduce((acc, pool) => acc + Number(pool.asset?.marketCapUsd ?? 0), 0) ?? 0;
  const staticPools = pools?.items?.filter(pool => pool.type !== 'v4').length ?? 0;
  const dynamicPools = pools?.items?.filter(pool => pool.type === 'v4').length ?? 0;

  // Helper to format large numbers compactly
  function compactNumber(num: number) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Leaderboard</h1>
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
          <span className="text-lg font-bold">{compactNumber(staticPools)}</span>
          <span className="text-[10px] text-muted-foreground mt-1">📊 Static Only</span>
        </div>
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <span className="text-lg font-bold">{compactNumber(dynamicPools)}</span>
          <span className="text-[10px] text-muted-foreground mt-1">🚀 Dynamic Only</span>
        </div>
        <div className="bg-card border rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
          <a href="/debug/quote" className="text-primary font-bold underline text-sm">Quote Debugger</a>
          <span className="text-[10px] text-muted-foreground mt-1">Quick Quotes</span>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error loading leaderboard.</p>
      ) : (
        <table className="w-full border rounded-lg bg-card/50 backdrop-blur">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Pools Created</th>
              <th className="py-2 px-4 text-left">Total Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.address} className="border-b last:border-none">
                <td className="py-2 px-4 font-bold">{idx + 1}</td>
                <td className="py-2 px-4 font-mono text-xs break-all">{user.address}</td>
                <td className="py-2 px-4">{user.poolsCreated}</td>
                <td className="py-2 px-4">${user.totalVolume.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
