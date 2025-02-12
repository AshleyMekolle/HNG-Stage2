import React from 'react';
import { UserInfo, FormErrors } from '../types/types';
import { Mail, UploadCloud } from 'lucide-react';
import StepIndicator from './StepIndicator';

interface AttendeeDetailsProps {
  userInfo: UserInfo;
  formErrors: FormErrors;
  profileImage: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUrlChange: (url: string) => void;
  onBack: () => void;
}

const AttendeeDetails: React.FC<AttendeeDetailsProps> = ({
  userInfo,
  formErrors,
  profileImage,
  onSubmit,
  onImageUpload,
  onImageUrlChange,
  onBack
}) => {
  return (
    <>
      <StepIndicator currentStep={2} title="Attendee Details" />
      
      <div className="details">
        <form onSubmit={onSubmit} noValidate>
          <div className={`form-group ${formErrors.profileImage ? 'error' : ''}`}>
            <label className="form-label">Upload Profile Photo</label>
            <div className="upload-area">
              <div className="upload-image-area">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="upload-preview" />
                ) : (
                  <UploadCloud className="upload-icon" size={32} aria-hidden="true" />
                )}
                <span>Drag & drop or click to upload</span>
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
              {formErrors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {formErrors.email}
                </span>
              )}
            </div>
          </div>

          <div className="form-name">
            <label htmlFor="imageUrl">Enter image URL</label>
            <input
              type="url"
              id="imageUrl"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              onChange={(e) => onImageUrlChange(e.target.value)}
            />
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
              Get My Ticket
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AttendeeDetails;