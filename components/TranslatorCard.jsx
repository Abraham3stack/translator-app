"use client";
import { useState, useEffect } from "react";
import LanguageSelect from "./LanguageSelect";
import TextInput from "./TextInput";
import TranslateButton from "./TranslateButton";

export default function TranslatorCard() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load Dark mode to localstorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Save dark mode when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // swap languages
  const swapLanguages = () => {
    const tempLamp = fromLang;
    setFromLang(toLang);
    setToLang(tempLamp);

    const tempText = text;
    setText(translated);
    setTranslated(tempText);
  }

  const languageCodes = {
    English: "en",
    Spanish: "es",
    French: "fr",
    Swedish: "sv",
  }

  // translation function
  const translateText = async () => {
    if (!text) return;

    if (text.length > 500) {
      setTranslated("Text is too long. Maximum 500 characters allowed.");
      return;
    }

    setLoading(true);
    setTranslated("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: text,
          source: fromLang,
          target: toLang,
        }),
      });

      const data = await response.json();
      setTranslated(data.translatedText);
    } catch (error) {
      setTranslated("Translation failed. Try again.");    
    } finally {
      setLoading(false);
    }
  };

  // Copy Translation function
  const copyTranslation = async () => {
    if (!translated) return;

    try {
      await navigator.clipboard.writeText(translated);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.log("copy failed", error);   
    }
  };

  // Auto Translate when user stops typing
  useEffect(() => {
    if (!text) {
      setTranslated("");
      return;
    }

    const timer = setTimeout(() => {
      translateText();
    }, 700);

    return () => clearTimeout(timer);
  }, [text, fromLang, toLang]);

  // Languages
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "sv", name: "Swedish" },
  ]

  // UI 
  return (
    <div className={`w-full max-w-xl mx-4 sm:mx-0 p-4 sm:p-6 rounded-xl shadow-md transition-colors
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
      `}
    >

      <h1 className="text-2xl font-bold text-center mb-6">
        Message Translator
      </h1>

      {/* DarkMode toggle */}
      <div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors mb-4 cursor-pointer
            ${
              darkMode 
                ? "bg-gray-700 border-gray-500 text-yellow-300" 
                : "bg-gray-200 border-gray-400 text-gray-800"}
          `}
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Language Selectors */}
      <div className="flex flex-cl sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <LanguageSelect
          id="from"
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          languages={languages}
        />

        {/* Swap Languages Button */}
        <button
          onClick={swapLanguages}
          className={`px-3 py-3 sm:py-2 rounded-lg font-bold transition-colors cursor-pointer
            ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }
          `}
        >
          ↔
        </button>

        <LanguageSelect
          id="to"
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          languages={languages}
        />
      </div>

      {/* Text Input */}
      <TextInput 
        value={text}
        onChange={(e) => setText(e.target.value)}
        darkMode={darkMode}
      />

      {/* Translate Button */}
      <TranslateButton
        onClick={translateText}
        loading={loading}
      />

      {/* Output */}
      <div className={`mt-4 p-4 rounded-lg
            ${darkMode ? "bg-gray-700" : "bg-gray-100"}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">
            Translated ({fromLang} → {toLang})
          </p>

          <button
            onClick={copyTranslation}
            className={`p-2 rounded-full cursor-pointer
              ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`
            }
            title="Copy translation"
          >
            {copied ? (
              <span className="text-sm">copied!</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="8" y="9" width="12" height="14" rx="2" />
                <rect x="2" y="2" width="12" height="14" rx="2" />
              </svg>
            )}
          </button>
        </div>

        <p className="leading-relaxed whitespace-pre-wrap break-words">
          {translated}
        </p>       
      </div>
    </div>
  );
}