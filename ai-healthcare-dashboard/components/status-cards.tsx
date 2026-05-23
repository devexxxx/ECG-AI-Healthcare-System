"use client";

import { Heart, Activity, Brain, Gauge, Phone, AlertTriangle, Cloud, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartRateCardProps {
  bpm: number;
  condition: string;
}

export function HeartRateCard({ bpm, condition }: HeartRateCardProps) {
  const isAbnormal = condition !== "NORMAL";
  
  return (
    <div className={cn(
      "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
      isAbnormal ? "glass-card-danger" : ""
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Heart Rate
          </span>
          <Heart 
            className={cn(
              "h-6 w-6 animate-heartbeat",
              isAbnormal ? "text-red-500" : "text-emerald-400"
            )} 
            fill="currentColor"
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-5xl font-bold tabular-nums",
            isAbnormal ? "text-red-400" : "text-emerald-400"
          )}>
            {bpm}
          </span>
          <span className="text-xl text-muted-foreground">BPM</span>
        </div>
        <div className={cn(
          "mt-4 h-1 rounded-full overflow-hidden",
          isAbnormal ? "bg-red-950" : "bg-emerald-950"
        )}>
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isAbnormal ? "bg-red-500" : "bg-emerald-400"
            )}
            style={{ width: `${Math.min((bpm / 180) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface ConditionCardProps {
  condition: string;
}

export function ConditionCard({ condition }: ConditionCardProps) {
  const getConditionStyles = (cond: string) => {
    switch (cond) {
      case "TACHYCARDIA":
        return {
          bgColor: "bg-red-500/20",
          textColor: "text-red-400",
          borderColor: "border-red-500/50",
          icon: "text-red-400",
          description: "Heart rate above normal range"
        };
      case "BRADYCARDIA":
        return {
          bgColor: "bg-amber-500/20",
          textColor: "text-amber-400",
          borderColor: "border-amber-500/50",
          icon: "text-amber-400",
          description: "Heart rate below normal range"
        };
      default:
        return {
          bgColor: "bg-emerald-500/20",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/50",
          icon: "text-emerald-400",
          description: "Heart rhythm is normal"
        };
    }
  };

  const styles = getConditionStyles(condition);

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Condition
          </span>
          <Activity className={cn("h-6 w-6", styles.icon)} />
        </div>
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
          styles.bgColor,
          styles.borderColor
        )}>
          <div className={cn("h-2 w-2 rounded-full animate-pulse", styles.textColor.replace("text-", "bg-"))} />
          <span className={cn("font-semibold text-lg", styles.textColor)}>
            {condition}
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {styles.description}
        </p>
      </div>
    </div>
  );
}

interface AIDiagnosisCardProps {
  prediction: string;
}

export function AIDiagnosisCard({ prediction }: AIDiagnosisCardProps) {
  const isNormal = prediction.toLowerCase().includes("normal");

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              AI Diagnosis
            </span>
            <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
              ML
            </span>
          </div>
          <Brain className="h-6 w-6 text-cyan-400" />
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-3 w-3 rounded-full",
            isNormal ? "bg-emerald-400 animate-pulse" : "bg-red-400 animate-pulse"
          )} />
          <span className={cn(
            "text-2xl font-bold",
            isNormal ? "text-emerald-400" : "text-red-400"
          )}>
            {prediction}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-1 w-3 bg-cyan-500/50 rounded-full" />
            ))}
          </div>
          <span>Neural network analysis complete</span>
        </div>
      </div>
    </div>
  );
}

interface ConfidenceCardProps {
  confidence: number;
}

export function ConfidenceCard({ confidence }: ConfidenceCardProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return { bar: "bg-emerald-400", text: "text-emerald-400" };
    if (conf >= 70) return { bar: "bg-amber-400", text: "text-amber-400" };
    return { bar: "bg-red-400", text: "text-red-400" };
  };

  const colors = getConfidenceColor(confidence);

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            ML Confidence
          </span>
          <Gauge className="h-6 w-6 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className={cn("text-4xl font-bold tabular-nums", colors.text)}>
            {confidence.toFixed(1)}
          </span>
          <span className="text-xl text-muted-foreground">%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.bar)}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

interface EmergencyCardProps {
  phoneNumber: string;
}

export function EmergencyCard({ phoneNumber }: EmergencyCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="glass-card-danger rounded-2xl p-6 relative overflow-hidden border border-red-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-sm font-medium text-red-400 uppercase tracking-wider">
              Emergency
            </span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">
          Contact emergency services immediately if experiencing severe symptoms.
        </p>
        <div className="flex items-center gap-3 mb-4">
          <Phone className="h-5 w-5 text-red-400" />
          <span className="text-lg font-mono text-foreground">{phoneNumber}</span>
        </div>
        <button
          onClick={handleCall}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
        >
          <Phone className="h-5 w-5" />
          Emergency Call
        </button>
      </div>
    </div>
  );
}

interface CloudSyncIndicatorProps {
  isConnected: boolean;
}

export function CloudSyncIndicator({ isConnected }: CloudSyncIndicatorProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
      isConnected 
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
        : "bg-red-500/10 border-red-500/30 text-red-400"
    )}>
      {isConnected ? (
        <>
          <Cloud className="h-4 w-4" />
          <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Connected</span>
        </>
      ) : (
        <>
          <CloudOff className="h-4 w-4" />
          <div className="h-2 w-2 bg-red-400 rounded-full" />
          <span className="text-sm font-medium">Disconnected</span>
        </>
      )}
    </div>
  );
}
