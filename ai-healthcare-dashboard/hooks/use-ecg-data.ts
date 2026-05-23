"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ECGDataPoint {
  timestamp: number;
  value: number;
}

interface BackendResponse {
  bpm: number;
  ecg: number;
  condition: string;
  timestamp: number;
  aiPrediction: string;
  confidence: number;
}

interface HealthData {
  bpm: number;
  condition: string;
  aiPrediction: string;
  confidence: number;
  timestamp: number;
}

interface UseECGDataReturn {
  ecgData: ECGDataPoint[];
  healthData: HealthData;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  reconnectAttempts: number;
}

const MAX_DATA_POINTS = 50;
const FETCH_INTERVAL = 1000;
const MAX_RECONNECT_ATTEMPTS = 5;
const BACKEND_URL = "https://job-remindful-landmark.ngrok-free.dev/api/latest";

// Simulated data generator for when backend is unavailable
const generateSimulatedData = (): BackendResponse => {
  const baseECG = 2300;
  const variation = Math.sin(Date.now() / 200) * 300 + (Math.random() - 0.5) * 100;
  const bpm = Math.floor(70 + Math.sin(Date.now() / 5000) * 10 + (Math.random() - 0.5) * 5);
  
  let condition = "NORMAL";
  let prediction = "Normal Rhythm";
  
  if (bpm > 100) {
    condition = "TACHYCARDIA";
    prediction = "Elevated Heart Rate";
  } else if (bpm < 60) {
    condition = "BRADYCARDIA";
    prediction = "Low Heart Rate";
  }

  return {
    bpm,
    ecg: Math.round(baseECG + variation),
    condition,
    timestamp: Date.now(),
    aiPrediction: prediction,
    confidence: 92 + Math.random() * 6
  };
};

export function useECGData(): UseECGDataReturn {
  const [ecgData, setECGData] = useState<ECGDataPoint[]>([]);
  const [healthData, setHealthData] = useState<HealthData>({
    bpm: 0,
    condition: "NORMAL",
    aiPrediction: "Initializing...",
    confidence: 0,
    timestamp: Date.now()
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [useSimulation, setUseSimulation] = useState(false);
  
  const fetchInProgress = useRef(false);

  const fetchData = useCallback(async () => {
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;

    try {
      if (!useSimulation) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(BACKEND_URL, { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: BackendResponse = await response.json();
        
        setECGData(prev => {
          const newPoint: ECGDataPoint = {
            timestamp: Date.now(),
            value: data.ecg
          };
          const updated = [...prev, newPoint];
          return updated.slice(-MAX_DATA_POINTS);
        });
        
        setHealthData({
          bpm: data.bpm,
          condition: data.condition,
          aiPrediction: data.aiPrediction,
          confidence: data.confidence,
          timestamp: data.timestamp
        });
        
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);
        setIsLoading(false);
      }
    } catch (err) {
      // If backend fails, switch to simulation mode
      if (!useSimulation) {
        console.log("[v0] Backend unavailable, switching to simulation mode");
        setUseSimulation(true);
        setReconnectAttempts(prev => prev + 1);
      }
    } finally {
      fetchInProgress.current = false;
    }
  }, [useSimulation]);

  // Simulation effect
  useEffect(() => {
    if (!useSimulation) return;

    const simulateData = () => {
      const data = generateSimulatedData();
      
      setECGData(prev => {
        const newPoint: ECGDataPoint = {
          timestamp: Date.now(),
          value: data.ecg
        };
        const updated = [...prev, newPoint];
        return updated.slice(-MAX_DATA_POINTS);
      });
      
      setHealthData({
        bpm: data.bpm,
        condition: data.condition,
        aiPrediction: data.aiPrediction,
        confidence: data.confidence,
        timestamp: data.timestamp
      });
      
      setIsConnected(false);
      setIsLoading(false);
      setError("Backend unavailable - showing simulated data");
    };

    simulateData();
    const interval = setInterval(simulateData, FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [useSimulation]);

  // Try to reconnect to backend periodically
  useEffect(() => {
    if (!useSimulation) return;

    const tryReconnect = async () => {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(BACKEND_URL, { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log("[v0] Backend reconnected");
          setUseSimulation(false);
          setError(null);
        }
      } catch {
        // Still disconnected
      }
    };

    const reconnectInterval = setInterval(tryReconnect, 10000);
    return () => clearInterval(reconnectInterval);
  }, [useSimulation, reconnectAttempts]);

  // Main fetch effect for real backend
  useEffect(() => {
    if (useSimulation) return;

    fetchData();
    const interval = setInterval(fetchData, FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData, useSimulation]);

  return {
    ecgData,
    healthData,
    isConnected,
    isLoading,
    error,
    reconnectAttempts
  };
}
