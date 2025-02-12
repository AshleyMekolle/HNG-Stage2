export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateImageUrl = (url: string): boolean => {
  const cloudinaryPattern = /^https?:\/\/res\.cloudinary\.com\//;
  const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i;
  return cloudinaryPattern.test(url) || imageUrlPattern.test(url);
};
