"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Wifi,
  WifiOff,
  Users,
  Clock,
  RefreshCw,
  AlertCircle,
  Server,
  Globe,
  Database,
  Shield,
  Info,
  AlertTriangle,
} from "lucide-react";

import ServerStatus from "@/components/server-status";
import { handleSubmit } from "@/lib/server-actions/whitelistrequest";

// Tipos completos baseados na resposta da API
interface DNSRecord {
  name: string;
  type: string;
  class: string;
  ttl: number;
  rdlength: number;
  rdata: string;
  priority?: number;
  weight?: number;
  port?: number;
  target?: string;
  address?: string;
  typecovered?: string;
  algorithm?: number;
  labels?: number;
  origttl?: number;
  sigexp?: string;
  sigincep?: string;
  keytag?: number;
  signname?: string;
  signature?: string;
}

interface DNSInfo {
  srv: DNSRecord[];
  srv_a: DNSRecord[];
}

interface DebugInfo {
  ping: boolean;
  query: boolean;
  bedrock: boolean;
  srv: boolean;
  querymismatch: boolean;
  ipinsrv: boolean;
  cnameinsrv: boolean;
  animatedmotd: boolean;
  cachehit: boolean;
  cachetime: number;
  cacheexpire: number;
  apiversion: number;
  dns: DNSInfo;
  error?: {
    ping?: string;
    query?: string;
  };
}

interface ServerData {
  ip: string;
  port: number;
  hostname: string;
  online: boolean;
  debug: DebugInfo;
  players?: {
    online: number;
    max: number;
    list?: { name: string; uuid: string }[];
  };
  motd?: {
    raw: string;
    clean: string;
    html: string;
  };
  version?: string;
  protocol?: number;
  icon?: string;
  software?: string;
  plugins?: string[];
  mods?: string[];
}

export default function Page() {
  const [notification, setNotification] = useState<string | null>(null);
  const [data, setData] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);

  async function onSubmit(formData: FormData) {
    try {
      const message = await handleSubmit(formData);
      setNotification(message);
    } catch (error) {
      setNotification(`Erro ao enviar a solicitação. 
 Motivo: ${error}`);
      console.log(error);
    }
  }
  useEffect(() => {
    if (data?.icon?.startsWith("data:image/")) {
      const link = document.querySelector(
        "link[rel~='icon']"
      ) as HTMLLinkElement;
      if (link) link.href = data.icon;
    }
  }, [data?.icon]);

  const fetchServerStatus = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/server-status");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const serverData: ServerData = await response.json();
      setData(serverData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching server status:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Falha ao conectar com o servidor";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServerStatus();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLastUpdate = (date: Date | null): string => {
    if (!date) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s atrás`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m atrás`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h atrás`;
  };

  const formatTimestamp = (timestamp: number): string => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString("pt-BR");
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl">
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-gray-300 text-lg">
              Carregando status do servidor...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="p-6 bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30 rounded-xl shadow-xl max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl font-bold text-red-300">
              Erro no Servidor
            </h2>
          </div>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={fetchServerStatus}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-all duration-200 text-white font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Tentando..." : "Tentar Novamente"}</span>
          </button>
        </div>
      </div>
    );
  }

  const isOnline = data?.online || false;
  const playerCount = data?.players?.online || 0;
  const maxPlayers = data?.players?.max || 0;
  const playerPercentage =
    maxPlayers > 0 ? (playerCount / maxPlayers) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Card Principal */}
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              {data?.icon?.startsWith("data:image/") && (
                <img
                  src={data.icon}
                  alt="Server Icon"
                  className="w-10 h-10 rounded-lg shadow-lg"
                />
              )}
              <span>Status do Servidor</span>
            </h2>
            {process.env.NODE_ENV === "development" && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group"
                  title="Mostrar informações técnicas"
                >
                  <Info className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </button>
                <button
                  onClick={fetchServerStatus}
                  disabled={loading}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg transition-all duration-200 group"
                  title="Atualizar status"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-gray-300 group-hover:text-white ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Status Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Status Online/Offline */}
            <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
              {isOnline ? (
                <Wifi className="w-8 h-8 text-green-400" />
              ) : (
                <WifiOff className="w-8 h-8 text-red-400" />
              )}
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p
                  className={`text-xl font-bold ${isOnline ? "text-green-400" : "text-red-400"}`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Jogadores Online */}
            <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Jogadores</p>
                <p className="text-xl font-bold text-white">
                  {playerCount} / {maxPlayers || "N/A"}
                </p>
                {maxPlayers > 0 && (
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(playerPercentage, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações de Conexão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg">
              <Globe className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">IP</p>
                <p className="text-white font-medium">{data?.ip || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg">
              <Server className="w-6 h-6 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Porta</p>
                <p className="text-white font-medium">{data?.port || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg">
              <Database className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Hostname</p>
                <p className="text-white font-medium text-sm">
                  {data?.hostname || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* MOTD */}
          {data?.motd?.clean && (
            <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-400 mb-1">Mensagem do Servidor</p>
              <p className="text-gray-200 leading-relaxed">{data.motd.clean}</p>
            </div>
          )}

          {/* Erros de Conexão */}
          {data?.debug?.error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400 font-medium">
                  Erros de Conexão
                </p>
              </div>
              <div className="space-y-1 text-sm">
                {data.debug.error.ping && (
                  <p className="text-red-200">
                    <span className="font-medium">Ping:</span>{" "}
                    {data.debug.error.ping}
                  </p>
                )}
                {data.debug.error.query && (
                  <p className="text-red-200">
                    <span className="font-medium">Query:</span>{" "}
                    {data.debug.error.query}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
            {data?.version && (
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <p className="text-gray-400">Versão</p>
                <p className="text-white font-medium">{data.version}</p>
              </div>
            )}

            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400">API Cache</p>
              <p className="text-white font-medium">
                {data?.debug?.cachehit ? "Hit" : "Miss"}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400">Última Atualização</p>
              <p className="text-white font-medium flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatLastUpdate(lastUpdate)}</span>
              </p>
            </div>
          </div>

          {/* Lista de Jogadores (se disponível) */}
          {data?.players?.list && data.players.list.length > 0 && (
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-3">Jogadores Online</p>
              <div className="flex flex-wrap gap-2">
                {data.players.list.map((player, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-600 text-gray-200 rounded-full text-sm font-medium"
                  >
                    {player.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informações Técnicas (Debug) */}
        {showDebugInfo && data?.debug && (
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">
                Informações Técnicas
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">DNS SRV</p>
                <p
                  className={`font-medium ${data.debug.srv ? "text-green-400" : "text-red-400"}`}
                >
                  {data.debug.srv ? "Configurado" : "Não Configurado"}
                </p>
              </div>

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Bedrock Support</p>
                <p
                  className={`font-medium ${data.debug.bedrock ? "text-green-400" : "text-gray-400"}`}
                >
                  {data.debug.bedrock ? "Sim" : "Não"}
                </p>
              </div>

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Cache Expire</p>
                <p className="text-white font-medium text-xs">
                  {formatTimestamp(data.debug.cacheexpire)}
                </p>
              </div>

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">API Version</p>
                <p className="text-white font-medium">
                  v{data.debug.apiversion}
                </p>
              </div>
            </div>

            {/* DNS Records */}
            {data.debug.dns?.srv && data.debug.dns.srv.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Registros DNS SRV
                </h4>
                <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
                  <div className="space-y-2 text-sm">
                    {data.debug.dns.srv
                      .filter((record) => record.type === "SRV")
                      .map((record, index) => (
                        <div key={index} className="text-gray-300">
                          <span className="text-blue-400">Target:</span>{" "}
                          {record.target} |{" "}
                          <span className="text-green-400">Port:</span>{" "}
                          {record.port} |{" "}
                          <span className="text-yellow-400">Priority:</span>{" "}
                          {record.priority} |{" "}
                          <span className="text-purple-400">TTL:</span>{" "}
                          {record.ttl}s
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} Dailycodes SMP. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
