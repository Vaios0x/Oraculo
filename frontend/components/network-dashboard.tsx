"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { OraculoRpcClient, createDevnetRpcClient } from "@/lib/rpc-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Shield, 
  Zap,
  Users,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface NetworkMetrics {
  slot: number;
  blockHeight: number;
  epoch: number;
  supply: {
    total: number;
    circulating: number;
    nonCirculating: number;
  };
  health: string;
  performance: Array<{
    slot: number;
    numTransactions: number;
    numSlots: number;
    samplePeriodSecs: number;
    numNonVoteTransactions: number;
  }>;
  tps: number;
  avgLatency: number;
}

export function NetworkDashboard() {
  const { connection } = useConnection();
  const [rpcClient] = useState(() => createDevnetRpcClient());
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchNetworkMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const startTime = Date.now();
      const networkInfo = await rpcClient.getNetworkInfo();
      const latency = Date.now() - startTime;

      // Calcular TPS promedio
      const totalTransactions = networkInfo.performance.reduce(
        (sum, sample) => sum + sample.numTransactions, 0
      );
      const totalTime = networkInfo.performance.reduce(
        (sum, sample) => sum + sample.samplePeriodSecs, 0
      );
      const tps = totalTime > 0 ? totalTransactions / totalTime : 0;

      setMetrics({
        slot: networkInfo.slot,
        blockHeight: networkInfo.blockHeight,
        epoch: networkInfo.epoch,
        supply: networkInfo.supply,
        health: networkInfo.health,
        performance: networkInfo.performance,
        tps: Math.round(tps),
        avgLatency: latency,
      });

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchNetworkMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  const formatSOL = (lamports: number): string => {
    return (lamports / 1e9).toFixed(2) + ' SOL';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'ok': return 'text-green-600';
      case 'behind': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'behind': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Network Dashboard</h2>
          <p className="text-gray-600">
            Real-time Solana network metrics and performance data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={fetchNetworkMetrics}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Slot */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Slot</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.slot)}</div>
            <p className="text-xs text-muted-foreground">
              Block Height: {formatNumber(metrics.blockHeight)}
            </p>
          </CardContent>
        </Card>

        {/* Epoch Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Epoch</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.epoch}</div>
            <p className="text-xs text-muted-foreground">
              Network consensus period
            </p>
          </CardContent>
        </Card>

        {/* Network Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            {getHealthIcon(metrics.health)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics.health)}`}>
              {metrics.health.toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              Node synchronization status
            </p>
          </CardContent>
        </Card>

        {/* TPS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions/sec</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tps}</div>
            <p className="text-xs text-muted-foreground">
              Average over last 5 samples
            </p>
          </CardContent>
        </Card>

        {/* Latency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">
              RPC response time
            </p>
          </CardContent>
        </Card>

        {/* Supply */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSOL(metrics.supply.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              Circulating: {formatSOL(metrics.supply.circulating)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Performance</CardTitle>
          <CardDescription>
            Transaction throughput over the last 5 samples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.performance.map((sample, index) => (
              <div key={sample.slot} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Slot {formatNumber(sample.slot)}</p>
                    <p className="text-sm text-gray-600">
                      {sample.samplePeriodSecs}s period
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {sample.numTransactions} txns
                  </p>
                  <p className="text-sm text-gray-600">
                    {Math.round(sample.numTransactions / sample.samplePeriodSecs)} TPS
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Network Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Health:</span>
              <Badge variant={metrics.health === 'ok' ? 'default' : 'destructive'}>
                {metrics.health}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Latency:</span>
              <span className="text-sm font-medium">
                {metrics.avgLatency}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">TPS:</span>
              <span className="text-sm font-medium">
                {metrics.tps} tx/s
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Supply Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-sm font-medium">
                {formatSOL(metrics.supply.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Circulating:</span>
              <span className="text-sm font-medium">
                {formatSOL(metrics.supply.circulating)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Non-Circulating:</span>
              <span className="text-sm font-medium">
                {formatSOL(metrics.supply.nonCirculating)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
