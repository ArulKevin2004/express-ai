import React from "react";
import { RadarChartComponent } from "./RadarChartComponents";

export const AnalysisDashboard = ({ data }) => {
  // Extract analysis info (adorescore and primary/secondary emotions)
  const { adorescore, emotions: analysisEmotions } = data.analysis;
  const adorescoreValue =
    adorescore && adorescore.overall !== undefined
      ? `+${adorescore.overall}`
      : "+0";

  // Get emotions data for radar charts
  const emotionsData = data?.emotions?.emotions || [];

  // Define activation categories
  const highActivation = [
    "excitement",
    "desire",
    "joy",
    "confidence",
    "anger",
    "fear",
    "nervousness",
    "annoyance",
    "surprise",
  ];
  const mediumActivation = [
    "amusement",
    "gratitude",
    "pride",
    "trust",
    "optimism",
    "disappointment",
    "disapproval",
    "embarrassment",
    "remorse",
    "curiosity",
    "realization",
    "neutral",
  ];
  const lowActivation = [
    "admiration",
    "caring",
    "love",
    "relief",
    "approval",
    "sadness",
    "grief",
    "disgust",
    "confusion",
  ];

  // Filter emotions by activation category
  const filterByActivation = (category) =>
    emotionsData.filter((em) => category.includes(em.emotion));

  const highActivationData = filterByActivation(highActivation);
  const mediumActivationData = filterByActivation(mediumActivation);
  const lowActivationData = filterByActivation(lowActivation);

  return (
    <div className="bg-white p-4 rounded-md shadow">
      {/* Two-Column Layout: Left for Radar Charts, Right for Adorescore */}
      <div className="flex flex-row gap-6 mx-auto">
        {/* Left Side: 3 Radar Charts */}
        <div className="flex flex-row justify-evenly gap-10 align-middle flex-grow">
          <RadarChartComponent
            title="HIGH ACTIVATION EMOTIONS"
            data={highActivationData}
            color="#ff6b6b"
          />
          <RadarChartComponent
            title="MEDIUM ACTIVATION EMOTIONS"
            data={mediumActivationData}
            color="#feca57"
          />
          <RadarChartComponent
            title="LOW ACTIVATION EMOTIONS"
            data={lowActivationData}
            color="#1dd1a1"
          />
        </div>
      </div>
    </div>
  );
};
