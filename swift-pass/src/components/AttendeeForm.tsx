import React from 'react';
import { CloudUpload, Mail } from 'lucide-react';
import { FormErrors, UserInfo } from '../types/types';

export type ImageDropHandler = (e: React.DragEvent<HTMLDivElement>) => Promise<void>;
export type ImageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

interface AttendeeFormProps {
  userInfo: UserInfo;
  formErrors: FormErrors;
  onImageUpload: ImageUploadHandler;
  onImageDrop: ImageDropHandler;
  profileImage: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, errors: FormErrors) => void;
  onBack: () => void;
  isUploading: boolean;
  uploadError: string | null; // Add uploadError prop
  selectedTicketPrice?: number;
}

const LoadingSpinner = () => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner-track"></div>
      <div className="spinner"></div>
      <style>{`
        .spinner-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          z-index: 10;
        }

        .spinner-track {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid #e5e7eb;
          border-radius: 50%;
        }

        .spinner {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const AttendeeForm: React.FC<AttendeeFormProps> = ({
  userInfo,
  formErrors,
  profileImage,
  onSubmit,
  onImageUpload,
  onBack,
  isUploading,
  uploadError, // Add uploadError prop
  selectedTicketPrice
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Validate all required fields
    const errors: FormErrors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!profileImage) {
      errors.profileImage = 'Please upload an image';
    }
    if (uploadError) {
      errors.profileImage = uploadError; // Display upload error message
    }

    // If there are errors, prevent form submission and display error messages
    if (Object.keys(errors).length > 0) {
      onSubmit(e, errors);
      return;
    }

    // If no errors, proceed with form submission
    onSubmit(e, {});
  };

  return (
    <div className="details">
      <form onSubmit={handleSubmit} noValidate>
        <div className={`form-group ${formErrors.profileImage ? 'error' : ''}`}>
          <label className="form-label">Upload Profile Photo</label>
          <div className="upload-area">
            <div 
              className="upload-image-area" 
              style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                width: '240px',
                height: '240px',
                borderRadius: '32px',
                border: '4px solid rgba(36, 160, 181, 0.5)',
                backgroundColor: '#0E464F'
              }}
            >
              {isUploading && <LoadingSpinner />}
              <div 
                style={{ 
                  opacity: isUploading ? 0.5 : 1,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '32px'
                    }}
                  />
                ) : (
                  <>
                    <CloudUpload className="upload-icon" size={32} aria-hidden="true" />
                    {!isUploading && (
                      <span>Drag & drop or click to upload</span>
                    )}
                  </>
                )}
              </div>
              <input
                type="file"
                required
                accept="image/*"
                onChange={onImageUpload}
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
            {formErrors.profileImage && (
              <span className="error-message" role="alert">{formErrors.profileImage}</span>
            )}
          </div>
        </div>

        <div className="line"></div>

        <div className={`form-name ${formErrors.name ? 'error' : ''}`}>
          <label htmlFor="name">Enter your name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            required
            defaultValue={userInfo.name}
            aria-invalid={!!formErrors.name}
            aria-describedby={formErrors.name ? 'name-error' : undefined}
          />
          {formErrors.name && (
            <span id="name-error" className="error-message" role="alert">
              {formErrors.name}
            </span>
          )}
        </div>

        <div className={`form-name ${formErrors.email ? 'error' : ''}`}>
          <label htmlFor="email">Enter your email *</label>
          <div className="input-container">
            <Mail size={24} aria-hidden="true" className='mail-icon'/>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input-name"
              placeholder='hello@avioflagos.io'
              required
              defaultValue={userInfo.email}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? 'email-error' : undefined}
            />
          </div>
          {formErrors.email && (
            <span id="email-error" className="error-message" role="alert">
              {formErrors.email}
            </span>
          )}
        </div>

        <div className="form-name">
          <label htmlFor="project">Special request?</label>
          <textarea
            id="project"
            name="project"
            className="form-input"
            placeholder='Textarea'
            rows={4}
            defaultValue={userInfo.project}
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
            aria-label="Go back to ticket selection"
          >
            Back
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            aria-label="Complete booking"
            disabled={isUploading || !!uploadError} // Disable if uploading or if there's an upload error
          >
            Get My {selectedTicketPrice === 0 ? 'Free ' : ''}Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendeeForm;