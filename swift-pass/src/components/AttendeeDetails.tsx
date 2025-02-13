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

const AttendeeForm: React.FC<AttendeeFormProps> = ({
  userInfo,
  formErrors,
  profileImage,
  onSubmit,
  onImageUpload,
  onBack,
  selectedTicketPrice
}) => {
  return (
    <div className="details">
      <form onSubmit={onSubmit} noValidate>
        {/* Image Upload Section */}
        <div className={`form-group ${formErrors.profileImage ? 'error' : ''}`}>
          <label className="form-label">Upload Profile Photo</label>
          <div className="upload-area">
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

        {/* Form Fields */}
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