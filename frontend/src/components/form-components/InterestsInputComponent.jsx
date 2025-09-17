import { useState, useEffect, useRef } from 'react';
import { Heart, Plus, Trash2, X } from 'lucide-react';

// Popular interests across various categories
const POPULAR_INTERESTS = [
  // Technology & Computing
  'Programming', 'Web Development', 'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Cybersecurity', 'Cloud Computing', 'Mobile App Development', 'Game Development', 'Blockchain',
  'Cryptocurrency', 'Internet of Things', 'Virtual Reality', 'Augmented Reality', '3D Printing',
  'Robotics', 'Automation', 'Tech Startups', 'Open Source', 'Software Architecture',
  
  // Sports & Fitness
  'Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling', 'Hiking', 'Rock Climbing',
  'Yoga', 'Pilates', 'CrossFit', 'Martial Arts', 'Boxing', 'Weightlifting', 'Golf', 'Baseball',
  'Volleyball', 'Soccer', 'Table Tennis', 'Badminton', 'Skiing', 'Snowboarding', 'Surfing',
  'Skateboarding', 'Marathon Running', 'Triathlon', 'Fitness Training', 'Gym Workouts',
  
  // Arts & Creativity
  'Photography', 'Painting', 'Drawing', 'Digital Art', 'Graphic Design', 'Music', 'Playing Guitar',
  'Playing Piano', 'Singing', 'Dancing', 'Writing', 'Creative Writing', 'Poetry', 'Blogging',
  'Filmmaking', 'Video Editing', 'Animation', 'Sculpture', 'Pottery', 'Crafting', 'Jewelry Making',
  'Fashion Design', 'Interior Design', 'Architecture', 'Calligraphy', 'Street Art',
  
  // Music & Entertainment
  'Classical Music', 'Rock Music', 'Pop Music', 'Jazz', 'Electronic Music', 'Hip Hop', 'Country Music',
  'Playing Instruments', 'Music Production', 'DJing', 'Concert Attendance', 'Music Festivals',
  'Karaoke', 'Musical Theater', 'Opera', 'Composing Music', 'Audio Engineering',
  
  // Reading & Literature
  'Reading', 'Fiction Books', 'Non-fiction Books', 'Science Fiction', 'Fantasy', 'Mystery Novels',
  'Biographies', 'Self-help Books', 'Business Books', 'Technical Books', 'History Books',
  'Philosophy', 'Poetry Reading', 'Book Clubs', 'Literary Analysis', 'Audiobooks',
  
  // Travel & Culture
  'Traveling', 'Cultural Exchange', 'Learning Languages', 'International Cuisine', 'Food Tourism',
  'Historical Sites', 'Museums', 'Art Galleries', 'Architecture Tours', 'Adventure Travel',
  'Backpacking', 'Road Trips', 'Solo Travel', 'Group Travel', 'Photography Travel',
  'Cultural Festivals', 'Local Traditions', 'Geographic Exploration',
  
  // Food & Cooking
  'Cooking', 'Baking', 'Grilling', 'International Cuisine', 'Healthy Eating', 'Vegetarian Cooking',
  'Vegan Cooking', 'Food Photography', 'Wine Tasting', 'Coffee Culture', 'Tea Culture',
  'Restaurant Reviews', 'Food Blogging', 'Nutrition', 'Meal Planning', 'Food Preservation',
  'Fermentation', 'Brewing', 'Cocktail Making', 'Culinary Arts',
  
  // Nature & Outdoors
  'Gardening', 'Hiking', 'Camping', 'Bird Watching', 'Wildlife Photography', 'Environmental Conservation',
  'Sustainability', 'Eco-friendly Living', 'National Parks', 'Beach Activities', 'Mountain Climbing',
  'Forest Walks', 'Star Gazing', 'Weather Watching', 'Geocaching', 'Outdoor Survival',
  'Fishing', 'Hunting', 'Kayaking', 'Canoeing', 'Sailing',
  
  // Science & Learning
  'Astronomy', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Psychology', 'Sociology',
  'Anthropology', 'History', 'Geography', 'Geology', 'Marine Biology', 'Botany', 'Zoology',
  'Medical Science', 'Research', 'Scientific Experiments', 'Science Museums', 'Documentary Watching',
  'Online Learning', 'Educational Podcasts', 'TED Talks',
  
  // Business & Entrepreneurship
  'Entrepreneurship', 'Business Development', 'Investment', 'Stock Market', 'Real Estate',
  'Marketing', 'Sales', 'Leadership', 'Public Speaking', 'Networking', 'Business Books',
  'Startup Culture', 'Innovation', 'Product Development', 'E-commerce', 'Freelancing',
  'Consulting', 'Business Strategy', 'Financial Planning',
  
  // Gaming & Digital Entertainment
  'Video Games', 'Board Games', 'Card Games', 'Puzzle Games', 'Strategy Games', 'Role-playing Games',
  'Online Gaming', 'Competitive Gaming', 'Game Development', 'Game Design', 'Streaming',
  'YouTube', 'Podcasts', 'Social Media', 'Content Creation', 'Twitch Streaming',
  
  // Social & Community
  'Volunteering', 'Community Service', 'Social Justice', 'Human Rights', 'Charity Work',
  'Environmental Activism', 'Political Engagement', 'Public Policy', 'Mentoring', 'Teaching',
  'Youth Development', 'Elder Care', 'Animal Welfare', 'Disaster Relief', 'Fundraising',
  
  // Health & Wellness
  'Mental Health', 'Meditation', 'Mindfulness', 'Stress Management', 'Work-life Balance',
  'Healthy Living', 'Alternative Medicine', 'Herbal Remedies', 'Wellness Coaching',
  'Life Coaching', 'Personal Development', 'Self-improvement', 'Spirituality', 'Religion',
  
  // Hobbies & Collections
  'Collecting', 'Coin Collecting', 'Stamp Collecting', 'Art Collecting', 'Book Collecting',
  'Vintage Items', 'Antiques', 'Model Building', 'Puzzles', 'Crosswords', 'Sudoku',
  'Chess', 'Checkers', 'Woodworking', 'Metalworking', 'Electronics', 'Radio', 'Amateur Radio',
  
  // Fashion & Style
  'Fashion', 'Style', 'Sustainable Fashion', 'Vintage Fashion', 'Street Style', 'Fashion Design',
  'Fashion Photography', 'Makeup', 'Skincare', 'Beauty', 'Personal Styling', 'Thrift Shopping',
  'Fashion Blogging', 'Trend Analysis', 'Color Theory',
  
  // Automotive & Transportation
  'Cars', 'Motorcycles', 'Automotive Restoration', 'Car Racing', 'Formula 1', 'NASCAR',
  'Motorcycling', 'Bicycles', 'Public Transportation', 'Aviation', 'Flying', 'Trains',
  'Maritime', 'Boats', 'Automotive Technology', 'Electric Vehicles',
  
  // Home & Lifestyle
  'Home Improvement', 'DIY Projects', 'Interior Decorating', 'Feng Shui', 'Minimalism',
  'Organization', 'Cleaning', 'Home Automation', 'Smart Home Technology', 'Sustainable Living',
  'Zero Waste', 'Tiny House Living', 'Urban Living', 'Suburban Living', 'Rural Living',
  
  // Languages & Communication
  'Language Learning', 'Linguistics', 'Translation', 'Public Speaking', 'Debate', 'Storytelling',
  'Presentation Skills', 'Communication Skills', 'Cross-cultural Communication', 'Sign Language',
  'Ancient Languages', 'Language Exchange', 'Cultural Studies',
  
  // Animals & Pets
  'Pet Care', 'Dog Training', 'Cat Care', 'Exotic Pets', 'Animal Training', 'Veterinary Care',
  'Animal Behavior', 'Pet Photography', 'Animal Rescue', 'Wildlife Conservation', 'Zoo Visits',
  'Aquarium Keeping', 'Fish Care', 'Bird Care', 'Reptile Care',
  
  // Family & Relationships
  'Family Time', 'Parenting', 'Child Development', 'Education', 'Homeschooling', 'Family Travel',
  'Genealogy', 'Family History', 'Relationship Building', 'Marriage', 'Dating', 'Friendship',
  'Community Building', 'Social Skills', 'Emotional Intelligence'
];

export function InterestsInputComponent({ formData, setFormData }) {
  const [currentInterest, setCurrentInterest] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allInterests, setAllInterests] = useState(POPULAR_INTERESTS);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch interests from backend when component mounts
  useEffect(() => {
    fetchInterestsFromBackend();
  }, []);

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

  const fetchInterestsFromBackend = async () => {
    try {
      const response = await fetch('/api/members/interests');
      if (response.ok) {
        const backendInterests = await response.json();
        // Combine popular interests with backend interests, removing duplicates
        const combinedInterests = [...new Set([...POPULAR_INTERESTS, ...backendInterests])];
        setAllInterests(combinedInterests.sort());
      }
    } catch (error) {
      console.error('Error fetching interests from backend:', error);
      // Continue with popular interests if backend fails
    }
  };

  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  };

  const searchInterests = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }

    const normalizedQuery = normalizeText(query);
    const existingInterests = formData.interests || [];
    
    // Check if the typed interest already exists
    const typedInterestExists = existingInterests.some(existingInterest => 
      normalizeText(existingInterest) === normalizedQuery
    );
    
    // Get matching interests from the list
    const matchingInterests = allInterests
      .filter(interest => {
        const normalizedInterest = normalizeText(interest);
        return normalizedInterest.includes(normalizedQuery) && 
               !existingInterests.some(existingInterest => 
                 normalizeText(existingInterest) === normalizedInterest
               );
      })
      .slice(0, 9); // Limit to 9 results to leave room for typed interest
    
    // Create results array
    let results = [];
    
    // Add the typed interest as first option if it doesn't already exist and doesn't exactly match any existing interest
    if (!typedInterestExists && query.trim()) {
      const exactMatch = matchingInterests.find(interest => 
        normalizeText(interest) === normalizedQuery
      );
      
      if (!exactMatch) {
        results.push({
          interest: query.trim(),
          isCustom: true
        });
      }
    }
    
    // Add matching interests from the list
    results.push(...matchingInterests.map(interest => ({
      interest: interest,
      isCustom: false
    })));

    setSearchResults(results);
    setSelectedIndex(-1); // Reset selection when results change
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentInterest(value);
    searchInterests(value);
    setShowDropdown(value.length > 0);
  };

  const handleInputFocus = () => {
    if (currentInterest.length > 0) {
      searchInterests(currentInterest);
      setShowDropdown(true);
    }
  };

  const addInterest = (interestToAdd = null) => {
    const interest = interestToAdd || currentInterest.trim();
    if (!interest) return;

    const existingInterests = formData.interests || [];
    
    // Check if interest already exists (case-insensitive)
    const interestExists = existingInterests.some(existingInterest => 
      normalizeText(existingInterest) === normalizeText(interest)
    );

    if (!interestExists) {
      setFormData(prev => ({
        ...prev,
        interests: [...existingInterests, interest]
      }));
    }

    setCurrentInterest('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        // Add the selected search result
        addInterest(searchResults[selectedIndex].interest);
      } else if (searchResults.length > 0) {
        // Add the first search result
        addInterest(searchResults[0].interest);
      } else {
        // Add the typed interest
        addInterest();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setCurrentInterest('');
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

  const handleDropdownItemClick = (interest) => {
    addInterest(interest);
  };

  const clearSearch = () => {
    setCurrentInterest('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-carbon mb-6 flex items-center">
        <Heart className="w-6 h-6 mr-2 text-rich-gold" />
        Interests
      </h2>
      
      <div className="space-y-6">
        {/* Interests Input with Search */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInterest}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleInterestKeyPress}
                  className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-xs sm:text-base"
                  placeholder="Search or type an interest (e.g., Photography, Travel, etc.)"
                />
                {currentInterest && (
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
              {showDropdown && (searchResults.length > 0 || currentInterest.trim()) && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto transition-shadow duration-200 hover:shadow-xl"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDropdownItemClick(result.interest)}
                      className={`dropdown-item w-full text-left px-4 py-3 text-carbon transition-all duration-200 border-b border-gray-100 last:border-b-0 focus:bg-gray-100 focus:outline-none cursor-pointer ${
                        index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="transition-colors duration-200">{result.interest}</span>
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
                  {searchResults.length === 0 && currentInterest.trim() && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span>No suggestions found. Press Enter or click "Add Interest" to add</span>
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => addInterest()}
                          className="text-deep-green hover:text-green-dark font-medium cursor-pointer transition-colors duration-200 hover:bg-green-50 px-2 py-1 rounded"
                        >
                          Add "{currentInterest.trim()}"
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => addInterest()}
              disabled={!currentInterest.trim()}
              className="bg-deep-green hover:bg-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-200 whitespace-nowrap hover:shadow-md"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Add Interest</span>
            </button>
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-gray-600 mt-2">
            Start typing to search from popular interests or add your own custom interest. Use ↑↓ arrows to navigate, Enter to add, Esc to close.
          </p>
        </div>
        
        {/* Interests Display */}
        {formData.interests && formData.interests.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-carbon">Your Interests:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.interests.map((interest, index) => (
                <div
                  key={index}
                  className="bg-sand border border-gray-200 rounded-lg px-4 py-3 min-h-[3rem] flex items-center justify-center group hover:bg-gray-100 transition-colors relative"
                >
                  <span className="text-carbon text-sm text-center flex-1 pr-6">{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove interest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {(!formData.interests || formData.interests.length === 0) && (
          <div className="text-center py-6 text-gray-600">
            <Heart className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No interests added yet. Search or type an interest above and click "Add Interest".</p>
            <p className="text-xs text-gray-500 mt-2">
              Popular suggestions will appear as you type
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
