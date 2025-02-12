import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { UserInfo, BookingState } from '../types/types';
import StepIndicator from './StepIndicator';

interface TicketConfirmationProps {
  userInfo: UserInfo;
  bookingState: BookingState;
  onDownload: () => void;
  onBookAnother: () => void;
}

const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  userInfo,
  bookingState,
  onDownload,
  onBookAnother
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <StepIndicator currentStep={3} title="Ready" />

      <div className="event-banner">
        <h2>Your Ticket is Booked!</h2>
        <p>You can download or check your email for a copy</p>
      </div>

      <div className="ticket-preview" ref={ticketRef}>
        <div className="ticket-content">
          <div className="ticket-header">
            <h3 className="ticket-title">Techember Fest '25</h3>
            {userInfo.profileImage ? (
              <img 
                src={userInfo.profileImage} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <QRCodeSVG
                value="https://techember-fest.com/ticket/123"
                size={100}
                level="H"
              />
            )}
          </div>
          
          <div className="ticket-details">
            <div className="detail-group">
              <span className="detail-label">Name</span>
              <span className="detail-value">{userInfo.name}</span>
            </div>
            <div className="detail-group">
              <span className="detail-label">Email</span>
              <span className="detail-value">{userInfo.email}</span>
            </div>
            <div className="detail-group">
              <span className="detail-label">Ticket Type</span>
              <span className="detail-value">{bookingState.selectedTicket?.label}</span>
            </div>
            <div className="detail-group">
              <span className="detail-label">Quantity</span>
              <span className="detail-value">{bookingState.quantity}</span>
            </div>
          </div>

          <div className="ticket-divider"></div>

          <div className="detail-group">
            <span className="detail-label">Venue</span>
            <span className="detail-value">04 Rumens road, Ikoyi, Lagos</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Date & Time</span>
            <span className="detail-value">March 15, 2025 | 7:00 PM</span>
          </div>

          <div className="barcode-section">
            <QRCodeSVG
              value={`https://techember-fest.com/ticket/${userInfo.email}`}
              size={120}
              level="H"
              style={{ background: 'white', padding: '8px', borderRadius: '8px' }}
            />
          </div>
        </div>
      </div>

      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={onBookAnother}
          aria-label="Book another ticket"
        >
          Book Another Ticket
        </button>
        <button 
          className="btn btn-primary"
          onClick={onDownload}
          aria-label="Download ticket"
        >
          <Download size={16} aria-hidden="true" />
          Download Ticket
        </button>
      </div>
    </>
  );
};

export default TicketConfirmation;