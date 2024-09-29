import React from 'react';

function ControlPanel({
  onMethodChange,
  onGenerateDataset,
  onStep,
  onRun,
  onReset,
  initializationMethod,
  k,
  setK,
  dataPoints, // Accept dataPoints as a prop
}) {
  const handleMethodChange = (e) => {
    onMethodChange(e.target.value);
  };

  const handleKChange = (e) => {
    const newK = parseInt(e.target.value);
    if (dataPoints && dataPoints.length > 0) {
      if (newK > dataPoints.length) {
        alert(`k cannot be greater than the number of data points (${dataPoints.length}).`);
        return;
      }
    }
    setK(newK);
    onReset();
  };
  

  return (
    <div className="control-panel">
      <label>
        Initialization Method:
        <select value={initializationMethod} onChange={handleMethodChange}>
          <option value="Random">Random</option>
          <option value="Farthest First">Farthest First</option>
          <option value="KMeans++">KMeans++</option>
          <option value="Manual">Manual</option>
        </select>
      </label>
      <label>
        Number of Clusters (k):
        <input
            type="number"
            value={k}
            onChange={handleKChange}
            min="1"
            max={dataPoints.length > 0 ? dataPoints.length : 100} // Use dataPoints.length
        />

      </label>
      <button onClick={onGenerateDataset}>Generate New Dataset</button>
      <button onClick={onStep}>Step</button>
      <button onClick={onRun}>Run to Convergence</button>
      <button onClick={onReset}>Reset Algorithm</button>
    </div>
  );
}

export default ControlPanel;
