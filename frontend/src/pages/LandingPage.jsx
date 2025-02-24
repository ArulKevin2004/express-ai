import React, { useState } from "react";
import axios from "axios";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

export const LandingPage = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeEmotion = async () => {
    if (!text.trim()) {
      setError("Please enter some feedback.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API calls for detailed analysis and overall emotions data
      const res = await axios.post("http://127.0.0.1:8000/analyze_emotion", {
        text: text,
      });
      const emo = await axios.post("http://127.0.0.1:8000/all_emotions", {
        text: text,
      });

      setResponse({
        analysis: JSON.parse(res.data), // analysis contains adorescore and primary/secondary emotions
        emotions: JSON.parse(emo.data), // emotions data for radar charts
      });
    } catch (err) {
      setError("Error connecting to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Feedback Emotion Analyzer
        </h1>
      </header>

      {/* Input Card */}
      <div className="bg-white rounded-md shadow p-4 mb-6 flex justify-between gap-3" >
          <div className="w-1/2" >
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your feedback..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <button
              className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
              onClick={analyzeEmotion}
            >
              Analyze Emotion
            </button>
            {loading && <p className="mt-3 text-blue-500">Loading...</p>}
            {error && <p className="mt-3 text-red-500">{error}</p>}
          </div>
          {response && <AdoreScore  data = {response} />}
      </div>

      {/* Display Analysis Dashboard when data is available */}
      {response && <AnalysisDashboard data={response} />}
    </div>
  );
};

const AdoreScore = ({data}) =>{
    const { adorescore, emotions: analysisEmotions } = data.analysis;
  const adorescoreValue =
    adorescore && adorescore.overall !== undefined
      ? `+${adorescore.overall}`
      : "+0";

    return <>
    <div className="w-1/2 flex flex-col items-center bg-gray-50 p-4 rounded-md border-neutral-500 border-[1px]">
          <h2 className="text-xl font-bold mb-2">Adorescore</h2>
          <p className="text-3xl font-extrabold text-green-600 mb-4">
            {adorescoreValue}
          </p>
          <p className="text-sm text-gray-600">
            Primary Emotion:{" "}
            <span className="font-semibold">
              {analysisEmotions?.primary?.emotion || "N/A"}
            </span>{" "}
            (
            {Math.round((analysisEmotions?.primary?.intensity || 0) * 100)}
            %)
          </p>
          <p className="text-sm text-gray-600">
            Secondary Emotion:{" "}
            <span className="font-semibold">
              {analysisEmotions?.secondary?.emotion || "N/A"}
            </span>{" "}
            (
            {Math.round((analysisEmotions?.secondary?.intensity || 0) * 100)}
            %)
          </p>
        </div>
    </>
}


const AnalysisDashboard = ({ data }) => {
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

        {/* Right Side: Adorescore Display */}
        
      </div>
    </div>
  );
};

const RadarChartComponent = ({ title, data, color }) => {
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
