import React, { useState, useRef, useEffect } from "react";
import { Code, Plus, Trash2, X } from "lucide-react";

const LANGUAGES = [
  { name: "العربية", code: "ar", flag: "🇸🇦", keywords: ["arabic", "saudi arabia"] },
  { name: "English", code: "en", flag: "🇬🇧", keywords: ["english", "united kingdom"] },
  { name: "Français", code: "fr", flag: "🇫🇷", keywords: ["french", "france"] },
  { name: "Türkçe", code: "tr", flag: "🇹🇷", keywords: ["turkish", "turkey"] },
  { name: "Deutsch", code: "de", flag: "🇩🇪", keywords: ["german", "germany"] },
  { name: "Español", code: "es", flag: "🇪🇸", keywords: ["spanish", "spain"] },
  { name: "Русский", code: "ru", flag: "🇷🇺", keywords: ["russian", "russia"] },
  { name: "Italiano", code: "it", flag: "🇮🇹", keywords: ["italian", "italy"] },
  { name: "فارسی", code: "fa", flag: "🇮🇷", keywords: ["persian", "iran"] },
  { name: "中文", code: "zh", flag: "🇨🇳", keywords: ["chinese", "china"] },
  { name: "Kurdî", code: "ku", flag: "🇹🇷", keywords: ["kurdish", "turkey"] },
  // ...add more as needed
];

export const LanguagesInputComponent = ({ formData, setFormData }) => {
  const [currentLang, setCurrentLang] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizeText = (text) => text.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, "");

  const searchLanguages = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }
    const normalizedQuery = normalizeText(query);
    const existingLangs = formData.languages || [];
    const matchingLangs = LANGUAGES.filter(lang => {
      const normalizedLang = normalizeText(lang.name);
      const keywordMatch = lang.keywords && lang.keywords.some(kw => normalizeText(kw).includes(normalizedQuery));
      return (normalizedLang.includes(normalizedQuery) || keywordMatch) && !existingLangs.includes(lang.name);
    });
    setSearchResults(matchingLangs);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentLang(value);
    searchLanguages(value);
    setShowDropdown(value.length > 0);
  };

  const handleInputFocus = () => {
    if (currentLang.length > 0) {
      searchLanguages(currentLang);
      setShowDropdown(true);
    }
  };

  const addLanguage = (langName = null) => {
    let lang = langName || currentLang.trim();
    if (!lang) return;
    // Find language object by name
    const langObj = LANGUAGES.find(l => l.name === lang);
    if (!langObj) return;
    if (!formData.languages.includes(langObj.code)) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, langObj.code] }));
    }
    setCurrentLang("");
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        addLanguage(searchResults[selectedIndex].name);
      } else if (searchResults.length > 0) {
        addLanguage(searchResults[0].name);
      } else {
        addLanguage();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setCurrentLang("");
      setSearchResults([]);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex(prev => (prev + 1) % searchResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex(prev => prev <= 0 ? searchResults.length - 1 : prev - 1);
      }
    }
  };

  const handleDropdownItemClick = (langName) => {
    addLanguage(langName);
  };

  const clearSearch = () => {
    setCurrentLang("");
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-carbon mb-6 flex items-center">
        <Code className="w-6 h-6 mr-2 text-rich-gold" />
        اللغات
      </h2>
      <div className="space-y-6">
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentLang}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-xs sm:text-base"
                  placeholder="ابحث أو اكتب لغة (مثال: العربية، الإنجليزية، التركية...)"
                />
                {currentLang && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {showDropdown && (searchResults.length > 0 || currentLang.trim()) && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto transition-shadow duration-200 hover:shadow-xl"
                >
                  {searchResults.map((lang, index) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleDropdownItemClick(lang.name)}
                      className={`dropdown-item w-full text-right px-4 py-3 text-carbon transition-all duration-200 border-b border-gray-100 last:border-b-0 focus:bg-gray-100 focus:outline-none cursor-pointer ${
                        index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="transition-colors duration-200 text-xl">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400 transition-colors duration-200 group-hover:text-gray-600" />
                      </div>
                    </button>
                  ))}
                  {searchResults.length === 0 && currentLang.trim() && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span>لا توجد اقتراحات. اضغط Enter أو انقر على &quot;إضافة لغة&quot; للإضافة</span>
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => addLanguage()}
                          className="text-deep-green hover:text-green-dark font-medium cursor-pointer transition-colors duration-200 hover:bg-green-50 px-2 py-1 rounded"
                        >
                          إضافة &quot;{currentLang.trim()}&quot;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => addLanguage()}
              disabled={!currentLang.trim()}
              className="bg-deep-green hover:bg-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-200 whitespace-nowrap hover:shadow-md"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>إضافة لغة</span>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            ابدأ بالكتابة للبحث من اللغات الشائعة أو أضف لغتك الخاصة. استخدم ↑↓ للتنقل، Enter للإضافة، Esc للإغلاق.
          </p>
        </div>
        {formData.languages && formData.languages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-carbon">اللغات المختارة:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.languages.map((langCode, index) => {
                const langObj = LANGUAGES.find((l) => l.code === langCode);
                return (
                  <div
                    key={langCode}
                    className="bg-sand border border-gray-200 rounded-lg px-4 py-3 min-h-[3rem] flex items-center justify-center group hover:bg-gray-100 transition-colors relative"
                  >
                    <span className="text-xl mr-2">{langObj ? langObj.flag : "🏳️"}</span>
                    <span className="text-carbon text-sm text-center flex-1 pr-6">{langObj ? langObj.name : langCode}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      title="إزالة اللغة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!formData.languages || formData.languages.length === 0) && (
          <div className="text-center py-6 text-gray-600">
            <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">لا توجد لغات مضافة بعد. ابحث أو اكتب لغة أعلاه واضغط &quot;إضافة لغة&quot;.</p>
            <p className="text-xs text-gray-500 mt-2">ستظهر الاقتراحات الشائعة أثناء الكتابة</p>
          </div>
        )}
      </div>
    </div>
  );
};
