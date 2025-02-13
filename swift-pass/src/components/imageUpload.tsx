import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';

interface ImageUploadProps {
  profileImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ profileImage, onImageUpload, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dywxwwecr/image/upload`, 
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Image upload failed');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        onImageUpload(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        onImageUpload(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div className={`form-group ${error ? 'error' : ''}`}>
      <label className="form-label">Upload Profile Photo</label>
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="upload-image-area">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="upload-preview" />
          ) : (
            <CloudUpload className="upload-icon" size={32} aria-hidden="true" />
          )}
          <span>Drag & drop or click to upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            aria-label="Upload profile photo"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>
        {error && (
          <span className="error-message" role="alert">{error}</span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;