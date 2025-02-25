import React from "react";

export const Themes = ({ topics, originalText }) => {
  if (!topics || !topics.main || topics.main.length === 0) {
    return (<div className="bg-gray-50 rounded-sm p-4 mt-6"><p className="text-gray-500">No topics available.</p></div>)
  }

  // Highlight topics and subtopics in the original text
  const highlightText = (text, topics) => {
    if (!text) return "";

    let highlightedText = text;

    topics.main.forEach((topic) => {
      const regex = new RegExp(`\\b${topic}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="bg-blue-200 text-blue-800 font-bold px-1 rounded">${topic}</span>`
      );
    });

    Object.entries(topics.subtopics || {}).forEach(([topic, subtopics]) => {
      subtopics.forEach((subtopic) => {
        const regex = new RegExp(`\\b${subtopic}\\b`, "gi");
        highlightedText = highlightedText.replace(
          regex,
          `<span class="bg-green-200 text-green-800 font-semibold px-1 rounded">${subtopic}</span>`
        );
      });
    });

    return highlightedText;
  };

  return (
    <div className="bg-white p-4 rounded-md shadow mt-6">
      <h2 className="text-lg font-semibold mb-2">Extracted Themes</h2>
      {/* Display topics and subtopics */}
      {topics.main.map((topic, index) => (
        <div key={index} className="mb-4">
          {/* Topic as a subheading */}
          <h3 className="text-xl font-bold text-blue-700">{topic}</h3>

          {/* Subtopics as rounded tiles */}
          {topics.subtopics && topics.subtopics[topic]?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.subtopics[topic].map((subtopic, subIndex) => (
                <span
                  key={subIndex}
                  className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {subtopic}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
      {/* Original text with highlighted topics and subtopics */}
      <div className="bg-gray-100 p-4 rounded-md mb-4 border border-gray-300">
        <h3 className="text-md font-semibold mb-2">Highlighted Text:</h3>
        <p
          className="text-gray-900"
          dangerouslySetInnerHTML={{
            __html: highlightText(originalText, topics),
          }}
        />
      </div>
    </div>
  );
};
