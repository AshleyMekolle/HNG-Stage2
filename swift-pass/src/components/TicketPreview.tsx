import React, { RefObject } from 'react';
import Barcode from 'react-barcode';
import { UserInfo, BookingState } from '../types/types';

interface TicketPreviewProps {
  userInfo: UserInfo;
  bookingState: BookingState;
  ticketRef: RefObject<HTMLDivElement | null>;
  onDownload: () => void;
  onBookAnother: () => void;
}

const TicketPreview: React.FC<TicketPreviewProps> = ({
  userInfo,
  bookingState,
  ticketRef,
  onDownload,
  onBookAnother
}) => {
  return (
    <>
      <div className="event-banner-ready">
        <h2>Your Ticket is Booked!</h2>
        <p>Check your email or you can download it</p>
      </div>

      <div className="ticket-preview" ref={ticketRef}>
        <div className="ticket-content">
          <div className="ticket-header">
            <h3 className="ticket-title">Techember Fest '25</h3>
            <div className="event-location">📍 04 Rumens road, Ikoyi, Lagos || March 15, 2025 | 7:00 PM</div> 
            {userInfo.profileImage && (
              <img 
                src={userInfo.profileImage} 
                alt="Profile" 
                className="profile-image"
                style={{
                  objectFit: 'cover',
                }}
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
            <div className="detail-group-special">
              <span className="detail-label">Special request?</span>
              <span className="detail-value">{userInfo.project}</span>
            </div>
          </div>
          
          <div className="ticket-divider"></div>
          <div className="barcode-section">
            <Barcode 
              value="1234567890" 
              displayValue={true}
              height={30} 
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
          Download Ticket
        </button>
      </div>
    </>
  );
};

export default TicketPreview;