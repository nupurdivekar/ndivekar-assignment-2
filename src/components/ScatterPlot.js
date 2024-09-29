import React from 'react';
import Plot from 'react-plotly.js';

function ScatterPlot({
  dataPoints,
  centroids,
  assignments,
  onPlotClick,
}) {
  const handleClick = (event) => {
    // Extract the data coordinates from the click event
    const xInDataCoord = event.points[0].x;
    const yInDataCoord = event.points[0].y;
    onPlotClick(xInDataCoord, yInDataCoord);
  };

  const clusterColors = [
    'blue',
    'green',
    'red',
    'purple',
    'orange',
    'brown',
    'pink',
    'grey',
    'olive',
    'cyan',
  ];

  const data = [
    {
      x: dataPoints.map((p) => p.x),
      y: dataPoints.map((p) => p.y),
      mode: 'markers',
      marker: {
        color:
          assignments.length > 0
            ? assignments.map((a) => clusterColors[a % clusterColors.length])
            : 'black',
      },
      type: 'scatter',
      name: 'Data Points',
    },
  ];

  if (centroids.length > 0) {
    data.push({
      x: centroids.map((c) => c.x),
      y: centroids.map((c) => c.y),
      mode: 'markers',
      marker: {
        color: 'gold',
        symbol: 'x',
        size: 12,
        line: {
          color: 'black',
          width: 2,
        },
      },
      type: 'scatter',
      name: 'Centroids',
    });
  }

  // **Add an invisible scatter trace to capture clicks on empty space**
  data.push({
    x: [0], // You can set the range according to your data
    y: [0],
    xaxis: 'x',
    yaxis: 'y',
    mode: 'markers',
    marker: {
      opacity: 0,
    },
    hoverinfo: 'none',
    showlegend: false,
    type: 'scatter',
    name: 'Click Capture',
  });

  return (
    <Plot
      data={data}
      layout={{
        width: 700,
        height: 500,
        title: 'KMeans Clustering',
        clickmode: 'event',
        hovermode: 'closest',
        xaxis: {
          range: [0, 100], // Set the range according to your data generation
        },
        yaxis: {
          range: [0, 100],
        },
      }}
      onClick={handleClick}
      config={{
        displayModeBar: false, // Optional: Hide the toolbar
      }}
    />
  );
}

export default ScatterPlot;
