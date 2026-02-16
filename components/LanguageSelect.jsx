import React from "react";

const LanguageSelect = ({ id, value, onChange, languages }) => {
  return (
    <select 
      id={id} 
      value={value} 
      onChange={onChange}
      className="flex-1 p-2 border border-gray-300 rounded-lg cursor-pointer"
    >

      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;