// utils.ts
export const getUsernameFromUrl = () => {
  const path = window.location.pathname;
  // console.log('Full pathname:', path);
  
  const segments = path.split('/').filter(segment => segment.length > 0);
  // console.log('Path segments:', segments);
  
  let username = '';
  
  if (segments.length >= 2 && segments[0] === 'profile') {
    username = segments[1]; // /profile/username
  } else if (segments.length >= 1) {
    // Check if the last segment is a tab (posts, about, bookmarks, media)
    const validTabs = ['posts', 'about', 'bookmarks', 'media'];
    const lastSegment = segments[segments.length - 1];
    
    if (validTabs.includes(lastSegment) && segments.length >= 2) {
      // If last segment is a tab, username is the second-to-last segment
      username = segments[segments.length - 2]; // /username/tab
    } else {
      // Otherwise, username is the last segment
      username = segments[segments.length - 1]; // /username
    }
  }
  
  // console.log('Extracted username:', username);
  return username || '';
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Helper function to determine if a path segment is a tab
export const isValidTab = (segment: string): boolean => {
  return ['posts', 'about', 'bookmarks', 'media'].includes(segment);
};

// Helper function to extract tab from pathname
export const getTabFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  
  return isValidTab(lastSegment) ? lastSegment : 'posts';
};

// Helper function to clean username (remove @ if present)
export const cleanUsername = (username: string): string => {
  return username.startsWith('@') ? username.slice(1) : username;
};