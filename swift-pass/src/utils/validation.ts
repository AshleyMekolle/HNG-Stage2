export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validateImageUrl = (url: string): boolean => {
    const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i;
    return imageUrlRegex.test(url);
  };