// Web Worker for Python/Pyodide statistical engine calculations
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js');

let pyodideInstance = null;
let pyodideReady = false;

// Queue of messages received before pyodide is fully initialized
const messageQueue = [];

async function initPyodide() {
  try {
    self.postMessage({ type: 'status', message: 'BOOTING_PYTHON_WASM' });
    
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
    });

    self.postMessage({ type: 'status', message: 'MOUNTING_FILESYSTEM' });

    // Fetch the Python code
    const response = await fetch('/spurious_engine.py');
    if (!response.ok) {
      throw new Error(`Failed to fetch /spurious_engine.py: ${response.statusText}`);
    }
    const pythonCode = await response.text();

    // Run Python engine script inside the Pyodide VM
    await pyodideInstance.runPythonAsync(pythonCode);
    
    pyodideReady = true;
    self.postMessage({ type: 'status', message: 'PIPELINE_ONLINE' });

    // Process any queued messages
    while (messageQueue.length > 0) {
      const { data, ports } = messageQueue.shift();
      handleMessage(data, ports);
    }
  } catch (error) {
    self.postMessage({ type: 'status', message: 'ERROR', error: error.message });
  }
}

async function handleMessage(data, ports) {
  const { id, type, payload } = data;

  if (type === 'init') {
    // If already initialized, send status update
    if (pyodideReady) {
      self.postMessage({ type: 'status', message: 'PIPELINE_ONLINE' });
    }
    return;
  }

  try {
    let result;
    const startTime = performance.now();

    if (type === 'calculateCorrelation') {
      const { dataA, dataB, minCorrelation } = payload;
      const dataAStr = JSON.stringify(dataA);
      const dataBStr = JSON.stringify(dataB);
      
      const pyResultJson = pyodideInstance.globals.get('score_correlation_js')(
        dataAStr,
        dataBStr,
        minCorrelation || 0.87
      );
      
      const response = JSON.parse(pyResultJson);
      if (!response.success) {
        throw new Error(response.error);
      }
      
      result = response.result;
    } 
    else if (type === 'discoverCorrelations') {
      const { leftId, leftData, candidates, minCorrelation, limit } = payload;
      const leftDataStr = JSON.stringify(leftData);
      const candidatesStr = JSON.stringify(candidates);
      
      const pyResultJson = pyodideInstance.globals.get('discover_correlations_js')(
        leftId,
        leftDataStr,
        candidatesStr,
        minCorrelation || 0.87,
        limit || 48
      );
      
      const response = JSON.parse(pyResultJson);
      if (!response.success) {
        throw new Error(response.error);
      }
      
      result = response.results;
    }
    else if (type === 'evaluateExpression') {
      const { expression } = payload;
      
      const pyResultJson = pyodideInstance.globals.get('evaluate_expression_js')(
        expression
      );
      
      const response = JSON.parse(pyResultJson);
      if (!response.success) {
        throw new Error(response.error);
      }
      
      result = response.result;
    }
    else if (type === 'generateExplanation') {
      const { nameA, nameB, rPercent } = payload;

      const pyResultJson = pyodideInstance.globals.get('generate_explanation_payload_js')(
        nameA,
        nameB,
        rPercent
      );

      const response = JSON.parse(pyResultJson);
      if (!response.success) {
        throw new Error(response.error);
      }

      result = response.result;
    }
    else {
      throw new Error(`Unsupported message type: ${type}`);
    }

    const latency = performance.now() - startTime;
    self.postMessage({ 
      id, 
      type: 'success', 
      payload: result,
      latency 
    });
  } catch (error) {
    self.postMessage({ 
      id, 
      type: 'error', 
      error: error.message 
    });
  }
}

self.onmessage = function(e) {
  if (!pyodideReady && e.data.type !== 'init') {
    messageQueue.push({ data: e.data, ports: e.ports });
    return;
  }
  
  if (e.data.type === 'init' && !pyodideInstance) {
    initPyodide();
    return;
  }

  handleMessage(e.data, e.ports);
};
