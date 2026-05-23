"use client";

import { FileText, Download } from "lucide-react";

interface ECGDataPoint {
  timestamp: number;
  value: number;
}

interface HealthData {
  bpm: number;
  condition: string;
  aiPrediction: string;
  confidence: number;
}

interface ExportButtonsProps {
  ecgData: ECGDataPoint[];
  healthData: HealthData;
}

export function ExportButtons({ ecgData, healthData }: ExportButtonsProps) {
  const exportToCSV = () => {
    const headers = ["Timestamp", "ECG Value", "BPM", "Condition", "AI Prediction", "Confidence"];
    const rows = ecgData.map((point) => [
      new Date(point.timestamp).toISOString(),
      point.value.toString(),
      healthData.bpm.toString(),
      healthData.condition,
      healthData.aiPrediction,
      healthData.confidence.toString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ecg_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Create a simple text-based PDF content
    const content = `
ECG MONITORING REPORT
=====================
Generated: ${new Date().toLocaleString()}

VITAL SIGNS
-----------
Heart Rate: ${healthData.bpm} BPM
Condition: ${healthData.condition}

AI ANALYSIS
-----------
Prediction: ${healthData.aiPrediction}
Confidence: ${healthData.confidence}%

ECG DATA POINTS
---------------
Total Points: ${ecgData.length}
Time Range: ${ecgData.length > 0 ? new Date(ecgData[0].timestamp).toLocaleTimeString() : 'N/A'} - ${ecgData.length > 0 ? new Date(ecgData[ecgData.length - 1].timestamp).toLocaleTimeString() : 'N/A'}
Average Value: ${ecgData.length > 0 ? (ecgData.reduce((sum, p) => sum + p.value, 0) / ecgData.length).toFixed(2) : 'N/A'}
    `;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ecg_report_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all duration-200 border border-border hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
      >
        <Download className="h-4 w-4" />
        <span>Export CSV</span>
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all duration-200 border border-border hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
      >
        <FileText className="h-4 w-4" />
        <span>Export Report</span>
      </button>
    </div>
  );
}
