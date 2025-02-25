import React, { useState } from "react";
import axios from "axios";
import { AdoreScore } from "../components/AdoreScore";
import { AnalysisDashboard } from "../components/AnalysisDashboard";
import { Themes } from "../components/Themes";
import { Data } from "../components/Data";

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
      const res = await axios.post("http://127.0.0.1:8000/analyze_emotion", {
        text: text,
      });
      const emo = await axios.post("http://127.0.0.1:8000/all_emotions", {
        text: text,
      });

      const responseData = {
        analysis: JSON.parse(res.data),
        emotions: JSON.parse(emo.data),
      };

      console.log("API Response:", responseData);
      setResponse(responseData);

    } catch (err) {
      setError("Error connecting to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-black">
          Customer Emotion Analysis System - Express AI
        </h1>
      </header>

      {/* Input Card */}
      <div className="bg-white rounded-md shadow p-4 mb-6 flex justify-between gap-3">
        <div className="w-1/2">
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
        {response && <AdoreScore data={response} />}
      </div>

      {/* Display Analysis Dashboard when data is available */}

      {response && <AnalysisDashboard data={response} />}

      {response && (
        <Themes topics={response.analysis.topics} originalText={text} />
      )}

      {response && <Data data={response} />}
    </div>
  );
};
