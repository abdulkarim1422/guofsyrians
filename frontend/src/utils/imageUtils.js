/**
 * Utility functions for handling member images
 */

/**
 * Get the appropriate image URL for a member
 * @param {string} imagePath - The image path from the backend (can be null/empty)
 * @param {string} gender - The gender of the member ('male' or 'female')
 * @returns {string} The complete image URL
 */
export const getMemberImageUrl = (imagePath, gender) => {
  if (imagePath && imagePath.trim()) {
    // If there's an image from backend, construct the full URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Handle both relative paths (e.g., "filename.jpg") and absolute paths (e.g., "/uploads/filename.jpg")
    if (imagePath.startsWith('http')) {
      // Already a full URL
      return imagePath;
    } else if (imagePath.startsWith('/uploads/')) {
      // Absolute path starting with /uploads/
      return `${API_BASE_URL}${imagePath}`;
    } else {
      // Relative path, assume it's in uploads directory
      return `${API_BASE_URL}/uploads/${imagePath}`;
    }
  } else {
    // Use default images based on gender
    if (gender === 'female') {
      return '/images/default_female_avatar.jpg';
    } else if (gender === 'male') {
      return '/images/default_male_avatar.jpg';
    } else {
      // Default to male avatar if gender is not specified
      return '/images/default_male_avatar.jpg';
    }
  }
};

/**
 * Get the default avatar path based on gender
 * @param {string} gender - The gender of the member ('male' or 'female')
 * @returns {string} The path to the default avatar
 */
export const getDefaultAvatarPath = (gender) => {
  if (gender === 'female') {
    return '/images/default_female_avatar.jpg';
  } else {
    return '/images/default_male_avatar.jpg';
  }
};
