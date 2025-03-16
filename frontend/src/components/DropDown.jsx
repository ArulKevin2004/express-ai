import { useState } from "react";
import { flores200Languages } from "../constants/Languages";

export const DropDown = ({ onSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    onSelect(language); // Call the parent function with selected language
  };

  const filteredLanguages = Object.keys(flores200Languages).filter((lang) =>
    lang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search languages..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded-md w-full mb-2"
      />
      <select
        value={selectedLanguage}
        onChange={handleChange}
        className="p-2 border rounded-md w-full"
      >
        <option value="">Select a Language</option>
        {filteredLanguages.map((lang) => (
          <option key={lang} value={flores200Languages[lang]}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

