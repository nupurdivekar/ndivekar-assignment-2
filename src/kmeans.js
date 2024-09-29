export function generateDataset(numPoints = 100) {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      data.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
    return data;
  }
  
  export function initializeCentroids(dataPoints, k, method) {
    let centroids = [];
    if (method === 'Random') {
      centroids = dataPoints
        .sort(() => 0.5 - Math.random())
        .slice(0, k)
        .map((point) => ({ ...point }));
    } else if (method === 'Farthest First') {
      centroids = initializeFarthestFirst(dataPoints, k);
    } else if (method === 'KMeans++') {
      centroids = initializeKMeansPlusPlus(dataPoints, k);
    }
    return centroids;
  }
  
  function initializeFarthestFirst(dataPoints, k) {
    const centroids = [];
    const dataCopy = [...dataPoints];
  
    const firstCentroid =
      dataCopy.splice(Math.floor(Math.random() * dataCopy.length), 1)[0];
    centroids.push(firstCentroid);
  
    while (centroids.length < k) {
      let farthestPoint = null;
      let maxDistance = -Infinity;
      for (const point of dataCopy) {
        const minDistToCentroids = Math.min(
          ...centroids.map((c) => calculateDistance(point, c))
        );
        if (minDistToCentroids > maxDistance) {
          maxDistance = minDistToCentroids;
          farthestPoint = point;
        }
      }
      centroids.push(farthestPoint);
      dataCopy.splice(dataCopy.indexOf(farthestPoint), 1);
    }
  
    return centroids;
  }
  
  function initializeKMeansPlusPlus(dataPoints, k) {
    const centroids = [];
    const dataCopy = [...dataPoints];
  
    const firstCentroid =
      dataCopy[Math.floor(Math.random() * dataCopy.length)];
    centroids.push(firstCentroid);
  
    while (centroids.length < k) {
      const distances = dataCopy.map((point) => {
        const minDist = Math.min(
          ...centroids.map((c) => calculateDistance(point, c))
        );
        return minDist ** 2; // Use squared distance
      });
  
      const sumDistances = distances.reduce((sum, d) => sum + d, 0);
      const probabilities = distances.map((d) => d / sumDistances);
  
      const cumulativeProbabilities = [];
      probabilities.reduce((sum, p, i) => {
        cumulativeProbabilities[i] = sum + p;
        return cumulativeProbabilities[i];
      }, 0);
  
      const rand = Math.random();
      let selectedPointIndex = cumulativeProbabilities.findIndex(
        (p) => p > rand
      );
      if (selectedPointIndex === -1)
        selectedPointIndex = cumulativeProbabilities.length - 1;
  
      const selectedPoint = dataCopy[selectedPointIndex];
      centroids.push(selectedPoint);
    }
  
    return centroids;
  }
  
  function calculateDistance(point1, point2) {
    return Math.sqrt(
      (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
    );
  }
  
  export function stepKMeans(dataPoints, centroids, k) {
    const assignments = assignClusters(dataPoints, centroids);
    const newCentroids = updateCentroids(dataPoints, assignments, k);
    return { newCentroids, newAssignments: assignments };
  }
  
  function assignClusters(dataPoints, centroids) {
      if (centroids.length === 0) {
        throw new Error('Centroids are empty. Cannot assign clusters.');
      }
    
      return dataPoints.map((point) => {
        let minDistance = Infinity;
        let assignment = -1;
        centroids.forEach((centroid, index) => {
          const distance = calculateDistance(point, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            assignment = index;
          }
        });
        return assignment;
      });
    }
  
  function updateCentroids(dataPoints, assignments, k) {
    const sums = Array(k)
      .fill(null)
      .map(() => ({ x: 0, y: 0, count: 0 }));
  
    assignments.forEach((clusterIndex, i) => {
      sums[clusterIndex].x += dataPoints[i].x;
      sums[clusterIndex].y += dataPoints[i].y;
      sums[clusterIndex].count += 1;
    });
  
    const newCentroids = sums.map((sum) => ({
      x: sum.x / (sum.count || 1), // Avoid division by zero
      y: sum.y / (sum.count || 1),
    }));
  
    return newCentroids;
  }
  
  // Function to calculate new centroids
  function calculateNewCentroids(dataPoints, centroids, k) {
    const sums = Array(k)
      .fill(null)
      .map(() => ({ x: 0, y: 0, count: 0 }));
  
    dataPoints.forEach((point) => {
      let minDistance = Infinity;
      let closestCentroidIndex = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = calculateDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = index;
        }
      });
  
      sums[closestCentroidIndex].x += point.x;
      sums[closestCentroidIndex].y += point.y;
      sums[closestCentroidIndex].count += 1;
    });
  
    const newCentroids = sums.map((sum) => ({
      x: sum.x / (sum.count || 1), 
      y: sum.y / (sum.count || 1),
    }));
  
    return newCentroids;
  }
  
  // Convergence detection with tolerance for precision errors
  function centroidsHaveChanged(oldCentroids, newCentroids, tolerance = 1e-4) {
    for (let i = 0; i < oldCentroids.length; i++) {
      if (Math.abs(oldCentroids[i].x - newCentroids[i].x) > tolerance || 
          Math.abs(oldCentroids[i].y - newCentroids[i].y) > tolerance) {
        return true; // Centroids have changed
      }
    }
    return false; // No changes in centroids
  }
  
  // Main KMeans function
  export function runKMeans(dataPoints, k, method) {
    let centroids = initializeCentroids(dataPoints, k, method);
    let iterations = 0;
    let maxIterations = 100;
  
    while (iterations < maxIterations) {
      const newCentroids = calculateNewCentroids(dataPoints, centroids, k);
  
      // Debugging: Log centroids to see changes
      console.log("Old Centroids:", centroids);
      console.log("New Centroids:", newCentroids);
  
      if (!centroidsHaveChanged(centroids, newCentroids)) {
        window.alert("K-Means has converged!");
        break; 
      }
  
      centroids = newCentroids;
      iterations++;
    }
  
    if (iterations === maxIterations) {
      console.warn("Max iterations reached without convergence.");
    }
  
    return centroids;
  }
  