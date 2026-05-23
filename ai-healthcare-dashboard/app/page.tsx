"use client";

import { Activity, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useECGData } from "@/hooks/use-ecg-data";
import { ECGChart } from "@/components/ecg-chart";
import {
  HeartRateCard,
  ConditionCard,
  AIDiagnosisCard,
  ConfidenceCard,
  EmergencyCard,
  CloudSyncIndicator,
} from "@/components/status-cards";
import { ExportButtons } from "@/components/export-buttons";

export default function ECGDashboard() {
  const { ecgData, healthData, isConnected, isLoading, error } = useECGData();

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Activity className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                ECG Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-Powered Cardiac Health Analysis
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CloudSyncIndicator isConnected={isConnected} />
            <ExportButtons ecgData={ecgData} healthData={healthData} />
          </div>
        </header>

        {/* Connection status banner */}
        {error && (
          <div className="mb-6 p-4 glass-card rounded-xl border border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <p className="text-amber-400 font-medium">Simulation Mode</p>
                <p className="text-sm text-amber-400/70">
                  {error}. Attempting to reconnect...
                </p>
              </div>
              <RefreshCw className="h-5 w-5 text-amber-400 animate-spin" />
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" />
            </div>
            <p className="text-muted-foreground">Connecting to ECG monitor...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ECG Waveform Section */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-foreground">
                      Live ECG Waveform
                    </h2>
                    <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wifi className="h-4 w-4" />
                    <span className="hidden sm:inline">Real-time data streaming</span>
                  </div>
                </div>
                <div className="h-64 sm:h-80 lg:h-96">
                  {ecgData.length > 0 ? (
                    <ECGChart data={ecgData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      Waiting for ECG data...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <HeartRateCard bpm={healthData.bpm} condition={healthData.condition} />
              <ConditionCard condition={healthData.condition} />
              <AIDiagnosisCard prediction={healthData.aiPrediction} />
              <ConfidenceCard confidence={healthData.confidence} />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Emergency Card */}
              <EmergencyCard phoneNumber="108" />

              {/* System Status Card */}
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden lg:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    System Status
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Data Points</p>
                      <p className="text-xl font-bold text-foreground tabular-nums">
                        {ecgData.length}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Sample Rate</p>
                      <p className="text-xl font-bold text-foreground">1 Hz</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Last Update</p>
                      <p className="text-xl font-bold text-foreground">
                        {new Date(healthData.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Connection</p>
                      <p
                        className={`text-xl font-bold ${
                          isConnected ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {isConnected ? "Live" : "Sim"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                Smart Healthcare ECG Monitoring System &bull; AI-Powered Analysis
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Data is for demonstration purposes only. Consult healthcare professionals for medical advice.
              </p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
