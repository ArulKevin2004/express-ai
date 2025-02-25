import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

export const RadarChartComponent = ({ title, data, color }) => {
  // Determine the maximum intensity value from the data to set the chart domain
  const maxIntensity =
    data.length > 0 ? Math.max(...data.map((d) => d.intensity)) : 1;

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {data.length > 0 ? (
        <RadarChart
          cx={150}
          cy={150}
          outerRadius={90}
          width={300}
          height={300}
          data={data}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="emotion" />
          <PolarRadiusAxis angle={30} domain={[0, maxIntensity]} />
          <Radar
            name="Intensity"
            dataKey="intensity"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      ) : (
        <p className="text-gray-500 text-sm">
          No data available for this category.
        </p>
      )}
    </div>
  );
};