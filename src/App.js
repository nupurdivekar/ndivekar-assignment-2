import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ScatterPlot from './components/ScatterPlot';
import { generateDataset, initializeCentroids, stepKMeans } from './kmeans';
import './App.css';

function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [initializationMethod, setInitializationMethod] = useState('Random');
  const [k, setK] = useState(Math.min(3, dataPoints.length));
  const [steps, setSteps] = useState(0);

  // Generate initial dataset on component mount
  useEffect(() => {
    const data = generateDataset(200);
    setDataPoints(data);
  }, []);  

  const handleGenerateDataset = () => {
    const data = generateDataset(200);
    setDataPoints(data);
    resetAlgorithm();
  };

  const handleMethodChange = (method) => {
    setInitializationMethod(method);
    resetAlgorithm();
  };

  const handleStep = () => {
    let currentCentroids = centroids;

    if (currentCentroids.length === 0 && initializationMethod !== 'Manual') {
      // Initialize centroids
      currentCentroids = initializeCentroids(
        dataPoints,
        k,
        initializationMethod
      );
      setCentroids(currentCentroids);
    } else if (initializationMethod === 'Manual' && currentCentroids.length < k) {
      alert(`Please select ${k} centroids by clicking on the plot.`);
      return;
    }

    // Perform one KMeans step
    const { newCentroids, newAssignments } = stepKMeans(
      dataPoints,
      currentCentroids,
      k
    );
    setCentroids(newCentroids);
    setAssignments(newAssignments);
    setSteps((prev) => prev + 1);
  };

  const handleRun = () => {
    let currentCentroids = centroids;

    if (currentCentroids.length === 0 && initializationMethod !== 'Manual') {
      currentCentroids = initializeCentroids(
        dataPoints,
        k,
        initializationMethod
      );
      setCentroids(currentCentroids);
    } else if (initializationMethod === 'Manual' && currentCentroids.length < k) {
      alert(`Please select ${k} centroids by clicking on the plot.`);
      return;
    }

    let changed = true;
    let iterations = 0;
    let newCentroids = currentCentroids;
    let newAssignments = assignments;

    while (changed) {
      const prevCentroids = newCentroids;
      const result = stepKMeans(dataPoints, newCentroids, k);
      newCentroids = result.newCentroids;
      newAssignments = result.newAssignments;
      changed = !centroidsConverged(prevCentroids, newCentroids);
      iterations++;

      // Prevent infinite loop in case of issues
      if (iterations > 1000) {
        alert('Algorithm did not converge within 1000 iterations.');
        break;
      }
    }

    setCentroids(newCentroids);
    setAssignments(newAssignments);
    setSteps((prev) => prev + iterations);
  };

  const centroidsConverged = (oldCentroids, newCentroids) => {
    for (let i = 0; i < oldCentroids.length; i++) {
      if (
        Math.abs(oldCentroids[i].x - newCentroids[i].x) > 0.0001 ||
        Math.abs(oldCentroids[i].y - newCentroids[i].y) > 0.0001
      ) {
        return false;
      }
    }
    return true;
  };

  const handleReset = () => {
    resetAlgorithm();
  };

  const resetAlgorithm = () => {
    setCentroids([]);
    setAssignments([]);
    setSteps(0);
  };

  const handlePlotClick = (x, y) => {
    if (initializationMethod === 'Manual' && centroids.length < k) {
      setCentroids([...centroids, { x, y }]);
    }
  };

  return (
    <div className="App">
      <h1>KMeans Clustering Visualization</h1>
      <ControlPanel
        onMethodChange={handleMethodChange}
        onGenerateDataset={handleGenerateDataset}
        onStep={handleStep}
        onRun={handleRun}
        onReset={handleReset}
        initializationMethod={initializationMethod}
        k={k}
        setK={setK}
        dataPoints={dataPoints} // Pass dataPoints as a prop
      />
      <ScatterPlot
        dataPoints={dataPoints}
        centroids={centroids}
        assignments={assignments}
        onPlotClick={handlePlotClick}
      />
      <p>Iterations: {steps}</p>
    </div>
  );
}

export default App;
