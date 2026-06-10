// API wrapper for the Web Worker running Python / Pyodide statistical engine

class PythonEngine {
  constructor() {
    this.worker = null;
    this.status = 'OFFLINE'; // OFFLINE, BOOTING_PYTHON_WASM, MOUNTING_FILESYSTEM, PIPELINE_ONLINE, ERROR
    this.error = null;
    this.pendingRequests = new Map();
    this.nextRequestId = 1;
    this.statusListeners = new Set();
    this.telemetryLogs = [];
    this.averageLatency = 0;
    this.totalCalculations = 0;
  }

  rejectPending(errorMessage) {
    const error = new Error(errorMessage || 'Python engine unavailable');
    for (const pending of this.pendingRequests.values()) {
      pending.reject(error);
    }
    this.pendingRequests.clear();
  }

  init() {
    if (this.worker) return;

    try {
      this.status = 'BOOTING_PYTHON_WASM';
      this.notifyStatusListeners();

      // Instantiate Web Worker using Vite-compatible classic Worker constructor
      this.worker = new Worker(
        new URL('./spuriousWorker.js', import.meta.url)
      );

      this.worker.onmessage = (e) => {
        const { id, type, payload, error, message, latency } = e.data;

        if (type === 'status') {
          this.status = message;
          if (message === 'ERROR') {
            this.error = error;
            this.rejectPending(error);
            console.warn('Python engine unavailable, using JavaScript fallback:', error);
          }
          this.notifyStatusListeners();
          return;
        }

        const pending = this.pendingRequests.get(id);
        if (!pending) return;

        this.pendingRequests.delete(id);

        if (type === 'success') {
          this.logTelemetry(pending.type, latency);
          pending.resolve(payload);
        } else {
          pending.reject(new Error(error || 'Unknown worker error'));
        }
      };

      this.worker.onerror = (e) => {
        this.status = 'ERROR';
        this.error = e.message;
        this.rejectPending(e.message);
        this.notifyStatusListeners();
        console.warn('Python worker unavailable, using JavaScript fallback:', e);
      };

      // Trigger Pyodide loading sequence inside worker
      this.worker.postMessage({ type: 'init' });
    } catch (err) {
      this.status = 'ERROR';
      this.error = err.message;
      this.rejectPending(err.message);
      this.notifyStatusListeners();
      console.warn('Failed to spawn Python engine worker, using JavaScript fallback:', err);
    }
  }

  addStatusListener(callback) {
    this.statusListeners.add(callback);
    callback(this.status, this.error);
    return () => this.statusListeners.delete(callback);
  }

  notifyStatusListeners() {
    for (const callback of this.statusListeners) {
      callback(this.status, this.error);
    }
  }

  logTelemetry(calcType, latency) {
    if (latency !== undefined) {
      this.totalCalculations += 1;
      this.averageLatency = 
        (this.averageLatency * (this.totalCalculations - 1) + latency) / 
        this.totalCalculations;
    }
    
    this.telemetryLogs.push({
      timestamp: new Date().toLocaleTimeString(),
      type: calcType,
      latency: latency ? `${latency.toFixed(2)}ms` : 'N/A',
      status: 'SUCCESS'
    });

    // Cap log history
    if (this.telemetryLogs.length > 50) {
      this.telemetryLogs.shift();
    }
  }

  sendRequest(type, payload) {
    return new Promise((resolve, reject) => {
      if (this.status === 'ERROR') {
        reject(new Error(`Python Engine is in ERROR state: ${this.error}`));
        return;
      }

      const id = this.nextRequestId++;
      this.pendingRequests.set(id, { resolve, reject, type });

      if (!this.worker) {
        this.init();
      }

      this.worker.postMessage({ id, type, payload });
    });
  }

  calculateCorrelation(dataA, dataB, minCorrelation = 0.87) {
    return this.sendRequest('calculateCorrelation', { dataA, dataB, minCorrelation });
  }

  discoverCorrelations(leftId, leftData, candidates, minCorrelation = 0.87, limit = 48) {
    return this.sendRequest('discoverCorrelations', { 
      leftId, 
      leftData, 
      candidates, 
      minCorrelation, 
      limit 
    });
  }

  evaluateExpression(expression) {
    return this.sendRequest('evaluateExpression', { expression });
  }

  generateExplanation(nameA, nameB, rPercent) {
    return this.sendRequest('generateExplanation', { nameA, nameB, rPercent });
  }
}

// Single instance representing our global Python runtime VM
const pythonEngine = new PythonEngine();
export default pythonEngine;
