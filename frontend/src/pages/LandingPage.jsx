import { useState } from "react";
import axios from "axios";
import { AdoreScore } from "../components/AdoreScore";
import { AnalysisDashboard } from "../components/AnalysisDashboard";
import { Themes } from "../components/Themes";
import { Data } from "../components/Data";
import { DropDown } from "../components/DropDown"; // Import the dropdown component

export const LandingPage = () => {
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Store selected language
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
      const res = await axios.post("http://127.0.0.1:8000/translate", {
        text: text,
        language: selectedLanguage, // Pass selected language code
      });
      const emo = await axios.post("http://127.0.0.1:8000/all_emotions", {
        text: text,
        language: selectedLanguage,
      });
      console.log("RES", res);
      const responseData = {
        analysis: JSON.parse(res.data.result),
        translation: res.data.translation,
        emotions: JSON.parse(emo.data),
      };

      console.log("API Response:", responseData);
      setResponse(responseData);
    } catch (err) {
      setError("Error connecting to API." + err);
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
      <div className="flex justify-between gap-6">
        <div className="bg-white flex flex-col w-1/2 p-4 rounded-lg my-6">
          {/* Input Section with Dropdown */}
          <div className=" rounded-md p-4 mb-6 flex flex-col gap-4  ">
            <div>
              <textarea
                className="w-full p-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your feedback..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              {/* Language Dropdown Component */}
              <DropDown onSelect={setSelectedLanguage} />
            </div>
          </div>
          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            onClick={analyzeEmotion}
          >
            Analyze Emotion
          </button>
        </div>

        <div className="flex justify-center items-center w-[50rem] bg-white my-6 rounded-lg shadow">{response && <AdoreScore data={response} />}</div>
      </div>

      {loading && <p className="mt-3 text-blue-500">Loading...</p>}
      {error && <p className="mt-3 text-red-500">{error}</p>}

      {/* Display Analysis Components when response is available */}
      {response && <AnalysisDashboard data={response} />}
      {response && (
        <Themes
          topics={response.analysis.topics}
          originalText={response.translation}
        />
      )}
      {response && <Data data={response} />}
    </div>
  );
};
