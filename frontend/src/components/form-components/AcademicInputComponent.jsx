import { useState, useEffect, useRef } from 'react';
import { GraduationCap, Plus, Trash2, X } from 'lucide-react';

// Turkish Universities List
const TURKISH_UNIVERSITIES = [
  'ABDULLAH GÜL ÜNİVERSİTESİ',
  'ACIBADEM MEHMET ALİ AYDINLAR ÜNİVERSİTESİ',
  'ADANA ALPARSLAN TÜRKEŞ BİLİM VE TEKNOLOJİ ÜNİVERSİTESİ',
  'ADIYAMAN ÜNİVERSİTESİ',
  'AFYON KOCATEPE ÜNİVERSİTESİ',
  'AFYONKARAHİSAR SAĞLIK BİLİMLERİ ÜNİVERSİTESİ',
  'AĞRI İBRAHİM ÇEÇEN ÜNİVERSİTESİ',
  'AKDENİZ ÜNİVERSİTESİ',
  'AKSARAY ÜNİVERSİTESİ',
  'ALANYA ALAADDİN KEYKUBAT ÜNİVERSİTESİ',
  'ALANYA ÜNİVERSİTESİ',
  'ALTINBAŞ ÜNİVERSİTESİ',
  'AMASYA ÜNİVERSİTESİ',
  'ANADOLU ÜNİVERSİTESİ',
  'ANKA TEKNOLOJİ ÜNİVERSİTESİ',
  'ANKARA BİLİM ÜNİVERSİTESİ',
  'ANKARA HACI BAYRAM VELİ ÜNİVERSİTESİ',
  'ANKARA MEDİPOL ÜNİVERSİTESİ',
  'ANKARA MÜZİK VE GÜZEL SANATLAR ÜNİVERSİTESİ',
  'ANKARA SOSYAL BİLİMLER ÜNİVERSİTESİ',
  'ANKARA ÜNİVERSİTESİ',
  'ANKARA YILDIRIM BEYAZIT ÜNİVERSİTESİ',
  'ANTALYA BELEK ÜNİVERSİTESİ',
  'ANTALYA BİLİM ÜNİVERSİTESİ',
  'ARDAHAN ÜNİVERSİTESİ',
  'ARTVİN ÇORUH ÜNİVERSİTESİ',
  'ATAŞEHİR ADIGÜZEL MESLEK YÜKSEKOKULU',
  'ATATÜRK ÜNİVERSİTESİ',
  'ATILIM ÜNİVERSİTESİ',
  'AVRASYA ÜNİVERSİTESİ',
  'AYDIN ADNAN MENDERES ÜNİVERSİTESİ',
  'BAHÇEŞEHİR ÜNİVERSİTESİ',
  'BALIKESİR ÜNİVERSİTESİ',
  'BANDIRMA ONYEDİ EYLÜL ÜNİVERSİTESİ',
  'BARTIN ÜNİVERSİTESİ',
  'BAŞKENT ÜNİVERSİTESİ',
  'BATMAN ÜNİVERSİTESİ',
  'BAYBURT ÜNİVERSİTESİ',
  'BEYKOZ ÜNİVERSİTESİ',
  'BEZM-İ ÂLEM VAKIF ÜNİVERSİTESİ',
  'BİLECİK ŞEYH EDEBALİ ÜNİVERSİTESİ',
  'BİNGÖL ÜNİVERSİTESİ',
  'BİRUNİ ÜNİVERSİTESİ',
  'BİTLİS EREN ÜNİVERSİTESİ',
  'BOĞAZİÇİ ÜNİVERSİTESİ',
  'BOLU ABANT İZZET BAYSAL ÜNİVERSİTESİ',
  'BURDUR MEHMET AKİF ERSOY ÜNİVERSİTESİ',
  'BURSA TEKNİK ÜNİVERSİTESİ',
  'BURSA ULUDAĞ ÜNİVERSİTESİ',
  'ÇAĞ ÜNİVERSİTESİ',
  'ÇANAKKALE ONSEKİZ MART ÜNİVERSİTESİ',
  'ÇANKAYA ÜNİVERSİTESİ',
  'ÇANKIRI KARATEKİN ÜNİVERSİTESİ',
  'ÇUKUROVA ÜNİVERSİTESİ',
  'DEMİROĞLU BİLİM ÜNİVERSİTESİ',
  'DİCLE ÜNİVERSİTESİ',
  'DOĞUŞ ÜNİVERSİTESİ',
  'DOKUZ EYLÜL ÜNİVERSİTESİ',
  'DÜZCE ÜNİVERSİTESİ',
  'EGE ÜNİVERSİTESİ',
  'ERCİYES ÜNİVERSİTESİ',
  'ERZİNCAN BİNALİ YILDIRIM ÜNİVERSİTESİ',
  'ERZURUM TEKNİK ÜNİVERSİTESİ',
  'ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ',
  'ESKİŞEHİR TEKNİK ÜNİVERSİTESİ',
  'FATİH SULTAN MEHMET VAKIF ÜNİVERSİTESİ',
  'FENERBAHÇE ÜNİVERSİTESİ',
  'FIRAT ÜNİVERSİTESİ',
  'GALATASARAY ÜNİVERSİTESİ',
  'GAZİ ÜNİVERSİTESİ',
  'GAZİANTEP İSLAM BİLİM VE TEKNOLOJİ ÜNİVERSİTESİ',
  'GAZİANTEP ÜNİVERSİTESİ',
  'GEBZE TEKNİK ÜNİVERSİTESİ',
  'GİRESUN ÜNİVERSİTESİ',
  'GÜMÜŞHANE ÜNİVERSİTESİ',
  'HACETTEPE ÜNİVERSİTESİ',
  'HAKKARİ ÜNİVERSİTESİ',
  'HALİÇ ÜNİVERSİTESİ',
  'HARRAN ÜNİVERSİTESİ',
  'HASAN KALYONCU ÜNİVERSİTESİ',
  'HATAY MUSTAFA KEMAL ÜNİVERSİTESİ',
  'HİTİT ÜNİVERSİTESİ',
  'IĞDIR ÜNİVERSİTESİ',
  'ISPARTA UYGULAMALI BİLİMLER ÜNİVERSİTESİ',
  'IŞIK ÜNİVERSİTESİ',
  'İBN HALDUN ÜNİVERSİTESİ',
  'İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ',
  'İNÖNÜ ÜNİVERSİTESİ',
  'İSKENDERUN TEKNİK ÜNİVERSİTESİ',
  'İSTANBUL AREL ÜNİVERSİTESİ',
  'İSTANBUL ATLAS ÜNİVERSİTESİ',
  'İSTANBUL AYDIN ÜNİVERSİTESİ',
  'İSTANBUL BEYKENT ÜNİVERSİTESİ',
  'İSTANBUL BİLGİ ÜNİVERSİTESİ',
  'İSTANBUL ESENYURT ÜNİVERSİTESİ',
  'İSTANBUL GALATA ÜNİVERSİTESİ',
  'İSTANBUL GEDİK ÜNİVERSİTESİ',
  'İSTANBUL GELİŞİM ÜNİVERSİTESİ',
  'İSTANBUL KENT ÜNİVERSİTESİ',
  'İSTANBUL KÜLTÜR ÜNİVERSİTESİ',
  'İSTANBUL MEDENİYET ÜNİVERSİTESİ',
  'İSTANBUL MEDİPOL ÜNİVERSİTESİ',
  'İSTANBUL NİŞANTAŞI ÜNİVERSİTESİ',
  'İSTANBUL OKAN ÜNİVERSİTESİ',
  'İSTANBUL RUMELİ ÜNİVERSİTESİ',
  'İSTANBUL SABAHATTİN ZAİM ÜNİVERSİTESİ',
  'İSTANBUL SAĞLIK VE SOSYAL BİLİMLER MESLEK YÜKSEKOKULU',
  'İSTANBUL SAĞLIK VE TEKNOLOJİ ÜNİVERSİTESİ',
  'İSTANBUL ŞİŞLİ MESLEK YÜKSEKOKULU',
  'İSTANBUL TEKNİK ÜNİVERSİTESİ',
  'İSTANBUL TİCARET ÜNİVERSİTESİ',
  'İSTANBUL TOPKAPI ÜNİVERSİTESİ',
  'İSTANBUL ÜNİVERSİTESİ',
  'İSTANBUL ÜNİVERSİTESİ-CERRAHPAŞA',
  'İSTANBUL YENİ YÜZYIL ÜNİVERSİTESİ',
  'İSTANBUL 29 MAYIS ÜNİVERSİTESİ',
  'İSTİNYE ÜNİVERSİTESİ',
  'İZMİR BAKIRÇAY ÜNİVERSİTESİ',
  'İZMİR DEMOKRASİ ÜNİVERSİTESİ',
  'İZMİR EKONOMİ ÜNİVERSİTESİ',
  'İZMİR KATİP ÇELEBİ ÜNİVERSİTESİ',
  'İZMİR KAVRAM MESLEK YÜKSEKOKULU',
  'İZMİR TINAZTEPE ÜNİVERSİTESİ',
  'İZMİR YÜKSEK TEKNOLOJİ ENSTİTÜSÜ',
  'KADİR HAS ÜNİVERSİTESİ',
  'KAFKAS ÜNİVERSİTESİ',
  'KAHRAMANMARAŞ İSTİKLAL ÜNİVERSİTESİ',
  'KAHRAMANMARAŞ SÜTÇÜ İMAM ÜNİVERSİTESİ',
  'KAPADOKYA ÜNİVERSİTESİ',
  'KARABÜK ÜNİVERSİTESİ',
  'KARADENİZ TEKNİK ÜNİVERSİTESİ',
  'KARAMANOĞLU MEHMETBEY ÜNİVERSİTESİ',
  'KASTAMONU ÜNİVERSİTESİ',
  'KAYSERİ ÜNİVERSİTESİ',
  'KIRIKKALE ÜNİVERSİTESİ',
  'KIRKLARELİ ÜNİVERSİTESİ',
  'KIRŞEHİR AHİ EVRAN ÜNİVERSİTESİ',
  'KİLİS 7 ARALIK ÜNİVERSİTESİ',
  'KOCAELİ SAĞLIK VE TEKNOLOJİ ÜNİVERSİTESİ',
  'KOCAELİ ÜNİVERSİTESİ',
  'KOÇ ÜNİVERSİTESİ',
  'KONYA GIDA VE TARIM ÜNİVERSİTESİ',
  'KONYA TEKNİK ÜNİVERSİTESİ',
  'KTO KARATAY ÜNİVERSİTESİ',
  'KÜTAHYA DUMLUPINAR ÜNİVERSİTESİ',
  'KÜTAHYA SAĞLIK BİLİMLERİ ÜNİVERSİTESİ',
  'LOKMAN HEKİM ÜNİVERSİTESİ',
  'MALATYA TURGUT ÖZAL ÜNİVERSİTESİ',
  'MALTEPE ÜNİVERSİTESİ',
  'MANİSA CELÂL BAYAR ÜNİVERSİTESİ',
  'MARDİN ARTUKLU ÜNİVERSİTESİ',
  'MARMARA ÜNİVERSİTESİ',
  'MEF ÜNİVERSİTESİ',
  'MERSİN ÜNİVERSİTESİ',
  'MİMAR SİNAN GÜZEL SANATLAR ÜNİVERSİTESİ',
  'MUDANYA ÜNİVERSİTESİ',
  'MUĞLA SITKI KOÇMAN ÜNİVERSİTESİ',
  'MUNZUR ÜNİVERSİTESİ',
  'MUŞ ALPARSLAN ÜNİVERSİTESİ',
  'NECMETTİN ERBAKAN ÜNİVERSİTESİ',
  'NEVŞEHİR HACI BEKTAŞ VELİ ÜNİVERSİTESİ',
  'NİĞDE ÖMER HALİSDEMİR ÜNİVERSİTESİ',
  'NUH NACİ YAZGAN ÜNİVERSİTESİ',
  'ONDOKUZ MAYIS ÜNİVERSİTESİ',
  'ORDU ÜNİVERSİTESİ',
  'ORTA DOĞU TEKNİK ÜNİVERSİTESİ',
  'OSMANİYE KORKUT ATA ÜNİVERSİTESİ',
  'OSTİM TEKNİK ÜNİVERSİTESİ',
  'ÖZYEĞİN ÜNİVERSİTESİ',
  'PAMUKKALE ÜNİVERSİTESİ',
  'PİRİ REİS ÜNİVERSİTESİ',
  'RECEP TAYYİP ERDOĞAN ÜNİVERSİTESİ',
  'SABANCI ÜNİVERSİTESİ',
  'SAĞLIK BİLİMLERİ ÜNİVERSİTESİ',
  'SAKARYA UYGULAMALI BİLİMLER ÜNİVERSİTESİ',
  'SAKARYA ÜNİVERSİTESİ',
  'SAMSUN ÜNİVERSİTESİ',
  'SANKO ÜNİVERSİTESİ',
  'SELÇUK ÜNİVERSİTESİ',
  'SİİRT ÜNİVERSİTESİ',
  'SİNOP ÜNİVERSİTESİ',
  'SİVAS BİLİM VE TEKNOLOJİ ÜNİVERSİTESİ',
  'SİVAS CUMHURİYET ÜNİVERSİTESİ',
  'SÜLEYMAN DEMİREL ÜNİVERSİTESİ',
  'ŞIRNAK ÜNİVERSİTESİ',
  'TARSUS ÜNİVERSİTESİ',
  'TED ÜNİVERSİTESİ',
  'TEKİRDAĞ NAMIK KEMAL ÜNİVERSİTESİ',
  'TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ',
  'TOKAT GAZİOSMANPAŞA ÜNİVERSİTESİ',
  'TOROS ÜNİVERSİTESİ',
  'TRABZON ÜNİVERSİTESİ',
  'TRAKYA ÜNİVERSİTESİ',
  'TÜRK HAVA KURUMU ÜNİVERSİTESİ',
  'TÜRK-ALMAN ÜNİVERSİTESİ',
  'TÜRKİYE ULUSLARARASI İSLAM, BİLİM VE TEKNOLOJİ ÜNİVERSİTESİ',
  'TÜRK-JAPON BİLİM VE TEKNOLOJİ ÜNİVERSİTESİ',
  'UFUK ÜNİVERSİTESİ',
  'UŞAK ÜNİVERSİTESİ',
  'ÜSKÜDAR ÜNİVERSİTESİ',
  'VAN YÜZÜNCÜ YIL ÜNİVERSİTESİ',
  'YALOVA ÜNİVERSİTESİ',
  'YAŞAR ÜNİVERSİTESİ',
  'YEDİTEPE ÜNİVERSİTESİ',
  'YILDIZ TEKNİK ÜNİVERSİTESİ',
  'YOZGAT BOZOK ÜNİVERSİTESİ',
  'YÜKSEK İHTİSAS ÜNİVERSİTESİ',
  'ZONGULDAK BÜLENT ECEVİT ÜNİVERSİTESİ'
];

// University selector component
function UniversitySelector({ value, onChange, placeholder }) {
  const [currentUniversity, setCurrentUniversity] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle clicks outside dropdown
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

  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  };

  const searchUniversities = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }

    const normalizedQuery = normalizeText(query);
    
    // Check if the typed university exactly matches an existing one
    const typedUniversityExists = TURKISH_UNIVERSITIES.some(university => 
      normalizeText(university) === normalizedQuery
    );
    
    // Get matching universities from the list
    const matchingUniversities = TURKISH_UNIVERSITIES
      .filter(university => {
        const normalizedUniversity = normalizeText(university);
        return normalizedUniversity.includes(normalizedQuery);
      })
      .slice(0, 9); // Limit to 9 results to leave room for typed university
    
    // Create results array
    let results = [];
    
    // Add the typed university as first option if it doesn't exactly match any existing university
    if (!typedUniversityExists && query.trim()) {
      const exactMatch = matchingUniversities.find(university => 
        normalizeText(university) === normalizedQuery
      );
      
      if (!exactMatch) {
        results.push({
          university: query.trim(),
          isCustom: true
        });
      }
    }
    
    // Add matching universities from the list
    results.push(...matchingUniversities.map(university => ({
      university: university,
      isCustom: false
    })));

    setSearchResults(results);
    setSelectedIndex(-1); // Reset selection when results change
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCurrentUniversity(inputValue);
    onChange(inputValue);
    searchUniversities(inputValue);
    setShowDropdown(inputValue.length > 0);
  };

  const handleInputFocus = () => {
    if (value.length > 0) {
      setCurrentUniversity(value);
      searchUniversities(value);
      setShowDropdown(true);
    }
  };

  const handleUniversityKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        // Select the highlighted search result
        const selectedUniversity = searchResults[selectedIndex].university;
        onChange(selectedUniversity);
        setCurrentUniversity(selectedUniversity);
        setShowDropdown(false);
        setSearchResults([]);
        setSelectedIndex(-1);
      } else if (searchResults.length > 0) {
        // Select the first search result
        const firstUniversity = searchResults[0].university;
        onChange(firstUniversity);
        setCurrentUniversity(firstUniversity);
        setShowDropdown(false);
        setSearchResults([]);
        setSelectedIndex(-1);
      } else {
        // Use the typed value
        onChange(currentUniversity);
        setShowDropdown(false);
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setCurrentUniversity(value);
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

  const handleDropdownItemClick = (university) => {
    onChange(university);
    setCurrentUniversity(university);
    setShowDropdown(false);
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setCurrentUniversity('');
    onChange('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Sync with external value changes
  useEffect(() => {
    if (value !== currentUniversity) {
      setCurrentUniversity(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={currentUniversity}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleUniversityKeyPress}
          className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all pr-8 sm:pr-10 text-xs sm:text-base"
          placeholder={placeholder}
          autoComplete="off"
        />
        {currentUniversity && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Search Dropdown */}
      {showDropdown && (searchResults.length > 0 || currentUniversity.trim()) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto transition-shadow duration-200 hover:shadow-xl"
        >
          {searchResults.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDropdownItemClick(result.university)}
              className={`dropdown-item w-full text-left px-4 py-3 text-carbon transition-all duration-200 border-b border-gray-100 last:border-b-0 focus:bg-gray-100 focus:outline-none cursor-pointer ${
                index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="transition-colors duration-200">{result.university}</span>
                  {result.isCustom && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full transition-all duration-200">
                      Custom
                    </span>
                  )}
                </div>
                <Plus className="w-4 h-4 text-gray-400 transition-colors duration-200 group-hover:text-gray-600" />
              </div>
            </button>
          ))}
          
          {/* Show "No suggestions found" message when there are no results but user is typing */}
          {searchResults.length === 0 && currentUniversity.trim() && (
            <div className="px-4 py-3 text-gray-500 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span>No universities found. Press Enter to use "{currentUniversity.trim()}"</span>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => handleDropdownItemClick(currentUniversity.trim())}
                  className="text-deep-green hover:text-green-dark font-medium cursor-pointer transition-colors duration-200 hover:bg-green-50 px-2 py-1 rounded"
                >
                  Use "{currentUniversity.trim()}"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AcademicInputComponent({ formData, setFormData }) {
  const handleAcademicChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      academic: prev.academic.map((edu, i) => 
        i === index ? { 
          ...edu, 
          [field]: value,
          // Clear major when degree level changes
          ...(field === 'degreeLevel' ? { major: '' } : {})
        } : edu
      )
    }));
  };

  const getAvailableMajors = (degreeLevel) => {
    const majorsByDegree = {
      "Bachelor's": {
        "Engineering": [
          "Civil Engineering",
          "Electrical Engineering", 
          "Software Engineering",
          "Mechanical Engineering",
          "Chemical Engineering",
          "Computer Engineering",
          "Aerospace Engineering",
          "Environmental Engineering",
          "Industrial Design Engineering",
          "Architecture (الهندسة المعمارية)",
          "Industrial Engineering (الهندسة الصناعية)",
          "Energy Engineering / Renewable Energy (هندسة الطاقة / الطاقة المتجددة)",
          "Marine Engineering / Maritime Transport (الهندسة البحرية / الهندسة البحرية والنقل البحري)",
          "Biomedical Engineering (الهندسة الطبية الحيوية)",
          "Systems Engineering / Control Engineering (هندسة النظم / هندسة التحكم الآلي)",
          "Geotechnical Engineering (الهندسة الجيوتقنية)",
          "Agricultural Engineering (الهندسة الزراعية)",
          "Petroleum Engineering / Oil & Gas Engineering (الهندسة البترولية / هندسة النفط والغاز)"
        ],
        "Medicine & Health": [
          "Pre-Medicine",
          "Medicine",
          "Dentistry (طب الأسنان)",
          "Pharmacy / Pharmaceutical Sciences (الصيدلة)",
          "Midwifery (القبالة)",
          "Radiology / Radiologic Technology (علم الأشعة)",
          "Nutrition / Dietetics (التغذية)",
          "Audiology & Speech Therapy (السمعيات والنطق)",
          "Health Administration / Health Management (إدارة الخدمات الصحية)",
          "Medical Laboratory Sciences (علوم المختبرات الطبية)",
          "Paramedic Studies (الإسعافات)",
          "Nursing",
          "Public Health",
          "Biomedical Sciences",
          "Physical Therapy",
          "Occupational Therapy",
          "Medical Technology"
        ],
        "Business & Management": [
          "Business Administration",
          "Finance",
          "Marketing",
          "Human Resources",
          "International Business",
          "Accounting",
          "Economics",
          "Management Information Systems",
          "Entrepreneurship (ريادة الأعمال)",
          "Supply Chain & Logistics Management (إدارة سلسلة الإمداد / اللوجستيات)",
          "Business Analytics / Data Analytics (التحليلات التجارية / علوم البيانات للأعمال)",
          "E-commerce / Digital Business (التجارة الإلكترونية)",
          "Hospitality & Tourism Management (الإدارة الفندقية والسياحة)"
        ],
        "Humanities & Social Sciences": [
          "Psychology",
          "Sociology",
          "Literature",
          "History",
          "Political Science",
          "Philosophy",
          "Anthropology",
          "Communications",
          "Language & Translation / Linguistics (اللغة والترجمة)",
          "Geography (الجغرافيا)",
          "Development Studies / Applied Economics (علم الاقتصاد التطبيقي / التنمية)",
          "Digital Media / New Media Studies (الإعلام الرقمي)",
          "International Relations (الدراسات الدولية / العلاقات الدولية)"
        ],
        "Sciences": [
          "Computer Science",
          "Biology",
          "Chemistry",
          "Physics",
          "Mathematics",
          "Environmental Science",
          "Statistics",
          "Data Science"
        ],
        "Arts & Design": [
          "Fine Arts",
          "Graphic Design",
          "Architecture",
          "Music",
          "Theater Arts",
          "Digital Media",
          "Industrial Design",
          "Interior Design (التصميم الداخلي / İç Mimarlık)",
          "Photography (التصوير الفوتوغرافي)",
          "Cinema & Television / Film Studies (السينما والتلفزيون)",
          "Visual Arts (الفنون البصرية)",
          "Fashion & Textile Design (تصميم الأزياء والمنسوجات)",
          "Plastic Arts / Sculpture, Painting, Ceramics (الفنون التشكيلية)",
          "Visual Communication Design (تصميم الاتصالات البصرية)"
        ]
      },
      "Master's": {
        "Engineering": [
          "Master of Engineering (MEng)",
          "Master of Science in Engineering",
          "Software Engineering",
          "Data Engineering",
          "Systems Engineering",
          "Engineering Management"
        ],
        "Medicine & Health": [
          "Master of Public Health (MPH)",
          "Master of Health Administration",
          "Master of Nursing",
          "Master of Biomedical Sciences",
          "Master of Health Informatics"
        ],
        "Business & Management": [
          "Master of Business Administration (MBA)",
          "Master of Finance",
          "Master of Marketing",
          "Master of Project Management",
          "Master of International Business",
          "Master of Data Analytics"
        ],
        "Humanities & Social Sciences": [
          "Master of Psychology",
          "Master of Social Work",
          "Master of Education",
          "Master of Public Administration",
          "Master of International Relations"
        ],
        "Sciences": [
          "Master of Science (MS)",
          "Master of Computer Science",
          "Master of Data Science",
          "Master of Applied Mathematics",
          "Master of Statistics"
        ],
        "Arts & Design": [
          "Master of Fine Arts (MFA)",
          "Master of Architecture",
          "Master of Design",
          "Master of Digital Media"
        ]
      },
      "PhD/Doctorate": {
        "Engineering": [
          "Doctor of Philosophy in Engineering",
          "Doctor of Engineering",
          "PhD in Computer Science",
          "PhD in Electrical Engineering"
        ],
        "Medicine & Health": [
          "Doctor of Medicine (MD)",
          "Doctor of Dental Medicine (DMD)",
          "Doctor of Pharmacy (PharmD)",
          "Doctor of Veterinary Medicine (DVM)",
          "PhD in Biomedical Sciences"
        ],
        "Business & Management": [
          "Doctor of Business Administration (DBA)",
          "PhD in Business Administration",
          "PhD in Economics",
          "PhD in Management"
        ],
        "Humanities & Social Sciences": [
          "PhD in Psychology",
          "PhD in Sociology", 
          "PhD in Political Science",
          "PhD in Education",
          "PhD in Philosophy"
        ],
        "Sciences": [
          "PhD in Computer Science",
          "PhD in Mathematics",
          "PhD in Physics",
          "PhD in Chemistry",
          "PhD in Biology"
        ]
      },
      "Associate": {
        "Applied Sciences": [
          "Associate of Applied Science (AAS)",
          "Computer Information Systems",
          "Web Development",
          "Network Administration"
        ],
        "Business": [
          "Business Administration",
          "Accounting",
          "Marketing",
          "Office Administration"
        ],
        "Health Sciences": [
          "Medical Assistant",
          "Dental Hygiene",
          "Radiologic Technology",
          "Nursing (RN)"
        ],
        "Technical": [
          "Electronics Technology",
          "Automotive Technology",
          "Construction Management",
          "Culinary Arts"
        ]
      },
      "Certificate/Diploma": {
        "Technology": [
          "Web Development Certificate",
          "Cybersecurity Certificate",
          "Data Analytics Certificate",
          "Digital Marketing Certificate"
        ],
        "Professional": [
          "Project Management Certificate",
          "Human Resources Certificate",
          "Financial Planning Certificate",
          "Teaching Certificate"
        ],
        "Technical Skills": [
          "Microsoft Certification",
          "AWS Certification",
          "Google Analytics Certificate",
          "Adobe Certified Expert"
        ],
        "Healthcare": [
          "Medical Coding Certificate",
          "Pharmacy Technician Certificate",
          "Medical Assistant Certificate"
        ]
      }
    };

    return majorsByDegree[degreeLevel] || {};
  };

  const addAcademicEntry = () => {
    setFormData(prev => ({
      ...prev,
      academic: [...prev.academic, {
        degreeLevel: '',
        major: '',
        date: '',
        institution: '',
        gpa: '',
        rank: ''
      }]
    }));
  };

  const removeAcademicEntry = (index) => {
    if (formData.academic.length > 1) {
      setFormData(prev => ({
        ...prev,
        academic: prev.academic.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-carbon flex items-center">
          <GraduationCap className="w-6 h-6 mr-2 text-rich-gold" />
          Academic Background
        </h2>
      </div>
      
      {formData.academic.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 bg-sand relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon">Education {index + 1}</h3>
            {formData.academic.length > 1 && (
              <button
                type="button"
                onClick={() => removeAcademicEntry(index)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                title="Remove this education entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Degree Level *
              </label>
              <select
                value={edu.degreeLevel}
                onChange={(e) => handleAcademicChange(index, 'degreeLevel', e.target.value)}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-xs sm:text-base"
                required
              >
                <option value="">Select degree level</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="PhD/Doctorate">PhD/Doctorate</option>
                <option value="Associate">Associate Degree</option>
                <option value="Certificate/Diploma">Certificate/Diploma</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Select your degree level to see available fields of study
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Field of Study *
              </label>
              <select
                value={edu.major}
                onChange={(e) => handleAcademicChange(index, 'major', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                required
                disabled={!edu.degreeLevel}
              >
                <option value="">
                  {edu.degreeLevel ? "Select field of study" : "First select degree level"}
                </option>
                {edu.degreeLevel && Object.entries(getAvailableMajors(edu.degreeLevel)).map(([category, majors]) => (
                  <optgroup key={category} label={`${category} (${majors.length} options)`}>
                    {majors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </optgroup>
                ))}
                {edu.degreeLevel && (
                  <optgroup label="Other">
                    <option value="Other">Other (Please specify in institution field)</option>
                  </optgroup>
                )}
              </select>
              {edu.degreeLevel && (
                <p className="text-xs text-gray-600 mt-1">
                  Categories available for {edu.degreeLevel} level. Select "Other" if your field is not listed.
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Graduation Date *
              </label>
              <input
                type="date"
                value={edu.date}
                onChange={(e) => handleAcademicChange(index, 'date', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Select your graduation date or expected graduation date
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Institution *
              </label>
              <UniversitySelector
                value={edu.institution}
                onChange={(value) => handleAcademicChange(index, 'institution', value)}
                placeholder="Search for Turkish universities..."
              />
              <p className="text-xs text-gray-600 mt-1">
                Search and select from Turkish universities or type your own
              </p>
            </div>
            
            {/* Optional GPA and Rank Fields */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                GPA (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={edu.gpa || ''}
                onChange={(e) => handleAcademicChange(index, 'gpa', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                placeholder="3.75"
              />
              <p className="text-xs text-gray-600 mt-1">
                Grade Point Average (0.00 - 4.00 scale)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Rank/Level (Optional)
              </label>
              <select
                value={edu.rank || ''}
                onChange={(e) => handleAcademicChange(index, 'rank', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
              >
                <option value="">Select rank (optional)</option>
                <option value="summa_cum_laude">Summa Cum Laude</option>
                <option value="magna_cum_laude">Magna Cum Laude</option>
                <option value="cum_laude">Cum Laude</option>
                <option value="honors">With Honors</option>
                <option value="high_honors">High Honors</option>
                <option value="distinction">With Distinction</option>
                <option value="first_class">First Class</option>
                <option value="upper_second">Upper Second Class</option>
                <option value="lower_second">Lower Second Class</option>
                <option value="third_class">Third Class</option>
                <option value="dean_list">Dean's List</option>
                <option value="valedictorian">Valedictorian</option>
                <option value="salutatorian">Salutatorian</option>
                <option value="top_5_percent">Top 5%</option>
                <option value="top_10_percent">Top 10%</option>
                <option value="top_quarter">Top 25%</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Academic honors, class ranking, or distinction level
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {formData.academic.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No education entries yet. Click "Add Education" to get started.</p>
        </div>
      )}
      
      {/* Add Education Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={addAcademicEntry}
          className="bg-deep-green hover:bg-green-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تعليم</span>
        </button>
      </div>
    </div>
  );
}
