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

    // Auto-expand: Add new empty field if user is typing in the last field and it's not empty
    if (index === socialMediaList.length - 1 && value.trim() !== '') {
      setSocialMediaList([...newList, { platform: '', url: '' }]);
    }
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

    // Auto-expand: If this is the last field and both platform and URL are filled, add a new field
    if (index === socialMediaList.length - 1 && 
        newList[index].platform.trim() !== '' && 
        normalizedUrl.trim() !== '') {
      setSocialMediaList([...newList, { platform: '', url: '' }]);
    }
  };

  const addSocialMedia = () => {
    setSocialMediaList([...socialMediaList, { platform: '', url: '' }]);
  };

  const removeSocialMedia = (index: number) => {
    if (socialMediaList.length > 1) {
      const newList = socialMediaList.filter((_, i) => i !== index);
      setSocialMediaList(newList);
      updateSocialMediaData(newList);
    }
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
    
    if (platformLower.includes('linkedin')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0077B5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    } else if (platformLower.includes('github')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#181717">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    } else if (platformLower.includes('twitter') || platformLower.includes('x')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    } else if (platformLower.includes('instagram')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
          <defs>
            <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#833ab4'}} />
              <stop offset="50%" style={{stopColor:'#fd1d1d'}} />
              <stop offset="100%" style={{stopColor:'#fcb045'}} />
            </linearGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    } else if (platformLower.includes('youtube')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    } else if (platformLower.includes('facebook')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    } else if (platformLower.includes('tiktok')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      );
    } else if (platformLower.includes('discord')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg>
      );
    } else if (platformLower.includes('behance')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1769FF">
          <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.125 1.07.32 1.485.58.41.267.733.603.96 1.005.225.4.34.877.34 1.433 0 .502-.105.954-.318 1.36-.213.405-.512.745-.896 1.018-.385.274-.84.485-1.367.63-.527.146-1.095.22-1.705.22H0V4.503h6.938zm0 8.458c.91 0 1.704.063 2.375.19.67.127 1.22.327 1.658.602.435.274.756.644.96 1.107.203.462.305.995.305 1.598 0 .613-.102 1.16-.305 1.628-.204.47-.525.854-.96 1.15-.438.3-.988.52-1.658.66-.67.14-1.466.21-2.375.21H0v-7.144h6.938zm-4.09-6.787v4.82h2.53c.85 0 1.527-.182 2.027-.544.5-.362.75-.876.75-1.54 0-.338-.07-.617-.18-.84-.132-.222-.296-.403-.49-.54-.19-.14-.414-.24-.67-.305-.258-.064-.533-.096-.825-.096H2.848zM2.848 15.15v5.31h3.043c.42 0 .805-.04 1.158-.12.354-.08.658-.2.914-.36.257-.16.46-.37.61-.628.148-.26.223-.57.223-.93 0-.765-.233-1.325-.698-1.68-.466-.356-1.114-.534-1.944-.534H2.848zm16.195-8.39c-.827 0-1.583.15-2.267.447-.684.298-1.277.71-1.777 1.235-.502.526-.89 1.15-1.168 1.873-.277.723-.416 1.506-.416 2.35 0 .84.138 1.623.416 2.348.278.725.665 1.35 1.168 1.876.5.527 1.093.938 1.777 1.236.684.297 1.44.446 2.267.446.918 0 1.743-.176 2.476-.527.732-.352 1.353-.83 1.863-1.434l-1.327-1.06c-.35.434-.73.754-1.14.96-.41.207-.86.31-1.35.31-.582 0-1.093-.13-1.533-.39-.44-.26-.796-.625-1.067-1.094h6.167c.02-.165.03-.33.03-.496 0-.828-.14-1.598-.418-2.31-.278-.712-.665-1.324-1.162-1.836-.496-.512-1.088-.907-1.777-1.185-.69-.278-1.448-.417-2.277-.417zm-3.705 4.91c.07-.582.27-1.095.6-1.54.33-.445.733-.794 1.21-1.047.476-.253.996-.38 1.56-.38.564 0 1.084.127 1.56.38.477.253.88.602 1.21 1.047.33.445.53.958.6 1.54h-6.74zm7.62-6.44v1.474h4.77V4.226h-4.77z"/>
        </svg>
      );
    } else if (platformLower.includes('dribbble')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#EA4C89">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm9.568 5.302c.846 1.353 1.348 2.915 1.411 4.7-.188-.04-2.046-.412-3.926-.412-.8 0-1.588.06-2.357.18-.077-.188-.154-.378-.244-.566-.23-.486-.486-.97-.742-1.438 2.065-.842 3.777-2.123 4.858-3.464zm-1.715-1.12c-.952 1.215-2.515 2.378-4.426 3.144-.719-1.318-1.518-2.515-2.399-3.598C13.944 3.365 14.897 3.237 16 3.237c1.498 0 2.895.486 4.085 1.306-.154.23-.309.46-.465.69-.231.345-.462.69-.693 1.035-.23.345-.46.69-.693 1.034-.231.346-.462.69-.693 1.035zm-6.853-1.597c.897 1.12 1.715 2.357 2.449 3.713-3.093.822-5.84.822-6.93.822h-.05c.412-1.9 1.24-3.598 2.531-4.535zm-4.374 6.853c0-.154.014-.308.014-.462h.078c1.312 0 4.374 0 7.75-.925.154.308.295.616.436.937.05.103.09.205.14.308-2.45.719-4.426 2.795-5.642 5.025C1.895 16.19 1.34 14.188 1.34 12zm2.091 7.415c.9-1.9 2.63-3.598 4.682-4.374.822 2.131 1.543 4.415 2.091 6.597C8.645 22.268 7.23 21.37 5.885 20.082c-.462-.44-.897-.925-1.284-1.43-.386-.503-.719-1.034-1.006-1.597-.287-.564-.515-1.155-.693-1.768-.178-.613-.308-1.25-.387-1.91-.08-.66-.105-1.34-.105-2.036 0-.695.025-1.375.105-2.035.08-.66.21-1.297.387-1.91.178-.613.406-1.204.693-1.768.287-.563.62-1.094 1.006-1.597.387-.503.822-.99 1.284-1.43C7.23 2.63 8.645 1.732 10.204 1.1c1.56-.632 3.209-.953 4.944-.953 1.736 0 3.385.32 4.944.953 1.56.632 2.975 1.53 4.32 2.817.462.44.897.925 1.284 1.43.386.503.719 1.034 1.006 1.597.287.564.515 1.155.693 1.768.178.613.308 1.25.387 1.91.08.66.105 1.34.105 2.035 0 .696-.025 1.376-.105 2.036-.08.66-.21 1.297-.387 1.91-.178.613-.406 1.204-.693 1.768-.287.563-.62 1.094-1.006 1.597-.387.503-.822.99-1.284 1.43-1.345 1.288-2.76 2.186-4.32 2.818-1.56.632-3.208.953-4.944.953-1.735 0-3.384-.32-4.944-.953zm10.29-.924c-.463-2.028-1.135-4.055-1.9-5.904 1.595-.257 3.212-.154 4.709.154-.36 2.399-1.595 4.467-3.309 6.05-.514-.1-1.028-.2-1.5-.3z"/>
        </svg>
      );
    } else if (platformLower.includes('gitlab')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FCA326">
          <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.918 1.263c-.135-.423-.73-.423-.867 0L1.387 9.452.045 13.587c-.121.375.014.789.331 1.023L12 23.054l11.624-8.443c.318-.235.453-.648.331-1.024"/>
        </svg>
      );
    } else if (platformLower.includes('reddit')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF4500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      );
    } else if (platformLower.includes('medium')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      );
    } else if (platformLower.includes('dev.to')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A0A0A">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.46-.02c.28 0 .5-.05.67-.15.18-.1.28-.25.28-.45V10.3c0-.25-.1-.45-.28-.6zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
        </svg>
      );
    } else if (platformLower.includes('stack overflow')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#F58025">
          <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z"/>
        </svg>
      );
    } else if (platformLower.includes('twitch')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#9146FF">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      );
    } else if (platformLower.includes('pinterest')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#BD081C">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z"/>
        </svg>
      );
    } else if (platformLower.includes('spotify')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.301.421-1.02.599-1.559.3z"/>
        </svg>
      );
    } else if (platformLower.includes('soundcloud')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF5500">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.255-2.154c-.009-.054-.049-.1-.099-.1m1.33.719c-.058 0-.105.053-.112.117L2.13 14.379l.263 1.318c.007.064.054.117.112.117.057 0 .104-.053.111-.117l.289-1.318-.289-1.318c-.007-.064-.054-.117-.111-.117m1.354-.117c-.063 0-.114.056-.122.126l-.22 1.09.22 1.09c.008.07.059.126.122.126.062 0 .113-.056.121-.126l.244-1.09-.244-1.09c-.008-.07-.059-.126-.121-.126m1.303.058c-.069 0-.124.063-.134.14l-.193.992.193.992c.01.077.065.14.134.14.068 0 .123-.063.133-.14l.215-.992-.215-.992c-.01-.077-.065-.14-.133-.14m1.308-.117c-.073 0-.132.068-.143.148l-.173 1.09.173 1.09c.011.08.07.148.143.148.072 0 .131-.068.142-.148l.192-1.09-.192-1.09c-.011-.08-.07-.148-.142-.148m1.306.117c-.077 0-.139.073-.151.158l-.153 1.09.153 1.09c.012.085.074.158.151.158.076 0 .138-.073.15-.158l.169-1.09-.169-1.09c-.012-.085-.074-.158-.15-.158m1.217-.07c-.08 0-.145.077-.158.171l-.15 1.09.15 1.09c.013.094.078.171.158.171.08 0 .145-.077.158-.171l.166-1.09-.166-1.09c-.013-.094-.078-.171-.158-.171m1.22-.053c-.084 0-.152.08-.166.178l-.133 1.137.133 1.137c.014.098.082.178.166.178.083 0 .151-.08.165-.178l.148-1.137-.148-1.137c-.014-.098-.082-.178-.165-.178m1.225-.023c-.087 0-.158.084-.172.186l-.117 1.16.117 1.16c.014.102.085.186.172.186.087 0 .158-.084.172-.186l.131-1.16-.131-1.16c-.014-.102-.085-.186-.172-.186m1.24-.035c-.091 0-.165.088-.18.194l-.1 1.195.1 1.195c.015.106.089.194.18.194.09 0 .164-.088.179-.194l.112-1.195-.112-1.195c-.015-.106-.089-.194-.179-.194m1.207.053c-.094 0-.171.092-.186.203l-.081 1.142.081 1.142c.015.111.092.203.186.203.093 0 .17-.092.185-.203l.093-1.142-.093-1.142c-.015-.111-.092-.203-.185-.203m1.23-.117c-.097 0-.175.096-.191.211l-.062 1.259.062 1.259c.016.115.094.211.191.211.096 0 .174-.096.19-.211l.07-1.259-.07-1.259c-.016-.115-.094-.211-.19-.211m1.177.18c-.1 0-.181.1-.198.22l-.044 1.079.044 1.079c.017.12.098.22.198.22.099 0 .18-.1.197-.22l.052-1.079-.052-1.079c-.017-.12-.098-.22-.197-.22m1.226-.063c-.103 0-.186.104-.203.228l-.025 1.142.025 1.142c.017.124.1.228.203.228.102 0 .185-.104.202-.228l.029-1.142-.029-1.142c-.017-.124-.1-.228-.202-.228m1.186.117c-.106 0-.191.108-.209.236l-.006 1.025.006 1.025c.018.128.103.236.209.236.105 0 .19-.108.208-.236l.007-1.025-.007-1.025c-.018-.128-.103-.236-.208-.236"/>
        </svg>
      );
    } else if (platformLower.includes('website') || platformLower.includes('portfolio')) {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4A90E2">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 5.302c.846 1.352 1.348 2.915 1.411 4.7-.188-.04-2.046-.412-3.926-.412-.8 0-1.588.06-2.357.18-.077-.188-.154-.378-.244-.566-.23-.486-.486-.97-.742-1.438 2.065-.842 3.777-2.123 4.858-3.464zm-1.715-1.12c-.952 1.215-2.515 2.378-4.426 3.144-.719-1.318-1.518-2.515-2.399-3.598C13.944 3.365 14.897 3.237 16 3.237c1.498 0 2.895.486 4.085 1.306-.154.23-.309.46-.465.69-.231.345-.462.69-.693 1.035zm-6.853-1.597c.897 1.12 1.715 2.357 2.449 3.713-3.093.822-5.84.822-6.93.822h-.05c.412-1.9 1.24-3.598 2.531-4.535zm-4.374 6.853c0-.154.014-.308.014-.462h.078c1.312 0 4.374 0 7.75-.925.154.308.295.616.436.937.05.103.09.205.14.308-2.45.719-4.426 2.795-5.642 5.025C1.895 16.19 1.34 14.188 1.34 12zm2.091 7.415c.9-1.9 2.63-3.598 4.682-4.374.822 2.131 1.543 4.415 2.091 6.597C8.645 22.268 7.23 21.37 5.885 20.082zm7.204.966c-.566-2.12-1.32-4.374-2.17-6.555 1.543-.205 3.264-.103 4.882.308-.36 2.669-1.595 5.076-2.712 6.247z"/>
        </svg>
      );
    }
    
    // Default icon for unknown platforms
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#666666">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-carbon flex items-center">
            <Globe className="w-6 h-6 mr-2 text-rich-gold" />
            وسائل التواصل الاجتماعي
          </h2>
          {/* Only show Add button if all current fields are filled or if there are no empty fields */}
          {socialMediaList.every(social => social.platform.trim() !== '') && (
            <button
              type="button"
              onClick={addSocialMedia}
              className="bg-rich-gold hover:bg-gold-dark text-deep-green px-4 py-2 rounded-lg flex items-center transition-colors font-medium hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة وسائل التواصل
            </button>
          )}
        </div>
        {socialMediaList.length === 1 && socialMediaList[0].platform === '' && (
          <p className="text-sm text-gray-600 mt-2">
            Start typing a platform name to add your social media. New fields will appear automatically as you fill them out.
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {socialMediaList.map((social, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-sand rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="relative">
              <label className="block text-sm font-medium text-carbon mb-2">
                المنصة *
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
                  placeholder="ابحث عن المنصات (مثال: LinkedIn، GitHub، Twitter)"
                />
                {social.platform && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getPlatformIcon(social.platform)}
                  </div>
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
                          <div className="w-5 h-5 flex items-center justify-center">
                            {getPlatformIcon(platform)}
                          </div>
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
                  أدخل الرابط الكامل، اسم المستخدم، أو @اسم_المستخدم - سنقوم بتنسيقه تلقائياً
                </p>
              </div>
              
              {socialMediaList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSocialMedia(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors hover:shadow-md"
                  title="إزالة إدخال وسائل التواصل هذا"
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
            <p>لا توجد روابط وسائل التواصل الاجتماعي مضافة بعد. انقر على &quot;إضافة وسائل التواصل&quot; للبدء.</p>
          </div>
        )}
      </div>
    </div>
  );
}
