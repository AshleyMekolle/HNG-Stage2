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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  isUploading: boolean;
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
  selectedTicketPrice
}) => {
  return (
    <div className="details">
      <form onSubmit={onSubmit} noValidate>
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
                overflow: 'hidden'
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
                      position: 'absolute',
                      top: 0,
                      left: 0
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
          >
            Get My {selectedTicketPrice === 0 ? 'Free ' : ''}Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendeeForm;