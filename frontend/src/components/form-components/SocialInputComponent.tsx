import { useState, useEffect, useRef } from 'react';
import { Globe, Plus, Trash2, X, ExternalLink } from 'lucide-react';

// Popular social media platforms
const SOCIAL_PLATFORMS = [
  // Professional Networks
  'LinkedIn', 'GitHub', 'GitLab', 'Behance', 'Dribbble', 'Stack Overflow', 'AngelList', 'Xing',
  
  // Social Media
  'Facebook', 'Twitter/X', 'Instagram', 'YouTube', 'TikTok', 'Snapchat', 'Pinterest', 'Reddit',
  'Discord', 'Telegram', 'WhatsApp', 'Signal', 'Clubhouse', 'Threads',
  
  // Professional Portfolios
  'Portfolio Website', 'Personal Website', 'Blog', 'Medium', 'Dev.to', 'Hashnode', 'Substack',
  
  // Creative Platforms
  'Figma', 'Adobe Portfolio', 'Canva', 'Unsplash', 'Flickr', 'DeviantArt', 'ArtStation', 'Sketch',
  
  // Video & Streaming
  'Twitch', 'Vimeo', 'YouTube Gaming', 'Dailymotion', 'Rumble',
  
  // Music & Audio
  'Spotify', 'SoundCloud', 'Bandcamp', 'Apple Music', 'YouTube Music', 'Podcast',
  
  // Business & E-commerce
  'Shopify', 'Etsy', 'Amazon Store', 'eBay', 'Fiverr', 'Upwork', 'Freelancer',
  
  // Regional/International
  'WeChat', 'Weibo', 'Line', 'KakaoTalk', 'VKontakte', 'Odnoklassniki', 'QQ',
  
  // Emerging Platforms
  'Mastodon', 'Bluesky', 'Nostr', 'Lens Protocol', 'Mirror', 'Glass'
];

interface SocialMediaItem {
  platform: string;
  url: string;
}

interface SocialInputComponentProps {
  formData: {
    social_media: Record<string, string>;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export function SocialInputComponent({ formData, setFormData }: SocialInputComponentProps) {
  const [socialMediaList, setSocialMediaList] = useState<SocialMediaItem[]>([{ platform: '', url: '' }]);
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [platformSearchResults, setPlatformSearchResults] = useState<string[]>([]);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [selectedPlatformIndex, setSelectedPlatformIndex] = useState(-1);
  const [focusedInputIndex, setFocusedInputIndex] = useState<number | null>(null);
  
  const platformInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize from formData
  useEffect(() => {
    if (formData.social_media && Object.keys(formData.social_media).length > 0) {
      const initialList = Object.entries(formData.social_media).map(([platform, url]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        url: url as string
      }));
      setSocialMediaList(initialList);
    }
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPlatformDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlatforms = (query: string) => {
    if (!query.trim()) {
      setPlatformSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase();
    const results = SOCIAL_PLATFORMS
      .filter(platform => 
        platform.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8);

    setPlatformSearchResults(results);
  };

  const handlePlatformInputChange = (value: string, index: number) => {
    setCurrentPlatform(value);
    setFocusedInputIndex(index);
    searchPlatforms(value);
    setShowPlatformDropdown(value.length > 0);
    
    // Update the actual list
    const newList = [...socialMediaList];
    newList[index].platform = value;
    setSocialMediaList(newList);
    updateSocialMediaData(newList);
  };

  const handlePlatformSelect = (platform: string, index: number) => {
    const newList = [...socialMediaList];
    newList[index].platform = platform;
    setSocialMediaList(newList);
    updateSocialMediaData(newList);
    
    setCurrentPlatform('');
    setPlatformSearchResults([]);
    setShowPlatformDropdown(false);
    setSelectedPlatformIndex(-1);
    setFocusedInputIndex(null);
  };

  const normalizeUrl = (url: string, platform: string): string => {
    if (!url.trim()) return '';
    
    let cleanUrl = url.trim();
    
    // If it's just a username or @username, build the URL based on platform
    if (!cleanUrl.includes('http') && !cleanUrl.includes('www.')) {
      // Remove @ if present
      cleanUrl = cleanUrl.replace(/^@/, '');
      
      const platformLower = platform.toLowerCase();
      
      // Platform-specific URL building
      switch (platformLower) {
        case 'twitter':
        case 'twitter/x':
        case 'x':
          return `https://twitter.com/${cleanUrl}`;
        case 'instagram':
          return `https://instagram.com/${cleanUrl}`;
        case 'linkedin':
          return `https://linkedin.com/in/${cleanUrl}`;
        case 'github':
          return `https://github.com/${cleanUrl}`;
        case 'gitlab':
          return `https://gitlab.com/${cleanUrl}`;
        case 'behance':
          return `https://behance.net/${cleanUrl}`;
        case 'dribbble':
          return `https://dribbble.com/${cleanUrl}`;
        case 'youtube':
          return `https://youtube.com/@${cleanUrl}`;
        case 'tiktok':
          return `https://tiktok.com/@${cleanUrl}`;
        case 'facebook':
          return `https://facebook.com/${cleanUrl}`;
        case 'pinterest':
          return `https://pinterest.com/${cleanUrl}`;
        case 'reddit':
          return `https://reddit.com/u/${cleanUrl}`;
        case 'discord':
          return cleanUrl.includes('#') ? cleanUrl : `${cleanUrl}#0000`;
        case 'medium':
          return `https://medium.com/@${cleanUrl}`;
        case 'dev.to':
          return `https://dev.to/${cleanUrl}`;
        case 'stack overflow':
          return `https://stackoverflow.com/users/${cleanUrl}`;
        case 'twitch':
          return `https://twitch.tv/${cleanUrl}`;
        case 'spotify':
          return `https://open.spotify.com/user/${cleanUrl}`;
        case 'soundcloud':
          return `https://soundcloud.com/${cleanUrl}`;
        default:
          // For other platforms, assume it's a username and the user will need to provide full URL
          return cleanUrl.includes('.') ? `https://${cleanUrl}` : cleanUrl;
      }
    }
    
    // If it already looks like a URL but missing protocol
    if (cleanUrl.includes('.') && !cleanUrl.startsWith('http')) {
      return `https://${cleanUrl}`;
    }
    
    return cleanUrl;
  };

  const handleUrlChange = (index: number, value: string) => {
    const newList = [...socialMediaList];
    const normalizedUrl = normalizeUrl(value, newList[index].platform);
    newList[index].url = normalizedUrl;
    setSocialMediaList(newList);
    updateSocialMediaData(newList);
  };

  const addSocialMedia = () => {
    setSocialMediaList([...socialMediaList, { platform: '', url: '' }]);
  };

  const removeSocialMedia = (index: number) => {
    const newList = socialMediaList.filter((_, i) => i !== index);
    setSocialMediaList(newList);
    updateSocialMediaData(newList);
  };

  const updateSocialMediaData = (list: SocialMediaItem[]) => {
    const socialMediaObj: Record<string, string> = {};
    list.forEach(item => {
      if (item.platform && item.url) {
        socialMediaObj[item.platform.toLowerCase()] = item.url;
      }
    });
    setFormData(prev => ({
      ...prev,
      social_media: socialMediaObj
    }));
  };

  const handlePlatformKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedPlatformIndex >= 0 && platformSearchResults[selectedPlatformIndex]) {
        handlePlatformSelect(platformSearchResults[selectedPlatformIndex], index);
      } else if (platformSearchResults.length > 0) {
        handlePlatformSelect(platformSearchResults[0], index);
      }
    } else if (e.key === 'Escape') {
      setShowPlatformDropdown(false);
      setPlatformSearchResults([]);
      setSelectedPlatformIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (platformSearchResults.length > 0) {
        setSelectedPlatformIndex(prev => (prev + 1) % platformSearchResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (platformSearchResults.length > 0) {
        setSelectedPlatformIndex(prev => prev <= 0 ? platformSearchResults.length - 1 : prev - 1);
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('github') || platformLower.includes('gitlab')) {
      return '🔗';
    } else if (platformLower.includes('linkedin')) {
      return '💼';
    } else if (platformLower.includes('twitter') || platformLower.includes('x')) {
      return '🐦';
    } else if (platformLower.includes('instagram')) {
      return '📷';
    } else if (platformLower.includes('youtube')) {
      return '🎥';
    } else if (platformLower.includes('behance') || platformLower.includes('dribbble')) {
      return '🎨';
    } else if (platformLower.includes('website') || platformLower.includes('portfolio')) {
      return '🌐';
    }
    return '📱';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-carbon flex items-center">
            <Globe className="w-6 h-6 mr-2 text-rich-gold" />
            Social Media
          </h2>
          <button
            type="button"
            onClick={addSocialMedia}
            className="bg-rich-gold hover:bg-gold-dark text-deep-green px-4 py-2 rounded-lg flex items-center transition-colors font-medium hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Media
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {socialMediaList.map((social, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-sand rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="relative">
              <label className="block text-sm font-medium text-carbon mb-2">
                Platform *
              </label>
              <div className="relative">
                <input
                  ref={el => platformInputRefs.current[index] = el}
                  type="text"
                  value={social.platform}
                  onChange={(e) => handlePlatformInputChange(e.target.value, index)}
                  onKeyDown={(e) => handlePlatformKeyPress(e, index)}
                  onFocus={() => {
                    setFocusedInputIndex(index);
                    if (social.platform) {
                      searchPlatforms(social.platform);
                      setShowPlatformDropdown(true);
                    }
                  }}
                  className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  placeholder="Search platforms (e.g., LinkedIn, GitHub, Twitter)"
                />
                {social.platform && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
                    {getPlatformIcon(social.platform)}
                  </span>
                )}
              </div>
              
              {/* Platform Dropdown */}
              {showPlatformDropdown && focusedInputIndex === index && platformSearchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {platformSearchResults.map((platform, platformIndex) => (
                    <button
                      key={platformIndex}
                      type="button"
                      onClick={() => handlePlatformSelect(platform, index)}
                      className={`w-full text-left px-4 py-3 text-carbon transition-all duration-200 border-b border-gray-100 last:border-b-0 cursor-pointer ${
                        platformIndex === selectedPlatformIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPlatformIcon(platform)}</span>
                          <span>{platform}</span>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-carbon mb-2">
                  URL / Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                    placeholder="https://... or @username or username"
                  />
                  {social.url && (
                    <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Enter full URL, username, or @username - we'll format it automatically
                </p>
              </div>
              
              {socialMediaList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSocialMedia(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors hover:shadow-md"
                  title="Remove this social media entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {socialMediaList.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No social media links added yet. Click "Add Social Media" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
