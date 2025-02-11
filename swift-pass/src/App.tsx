import React, { useState, useRef, useEffect } from 'react';
import { Ticket, ArrowRight, Download, CloudUpload } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { BookingState, TicketType } from './types/types';
import './App.css';

// Initialize ticket types with local storage
const getInitialTicketTypes = (): TicketType[] => {
  const storedTickets = localStorage.getItem('ticketTypes');
  if (storedTickets) {
    return JSON.parse(storedTickets);
  }
  return [
    { type: 'REGULAR', price: 0, available: 20, label: 'REGULAR ACCESS' },
    { type: 'VIP', price: 50, available: 20, label: 'VIP ACCESS' },
    { type: 'VVIP', price: 150, available: 20, label: 'VVIP ACCESS' },
  ];
};

interface UserInfo {
  name: string;
  email: string;
  project: string;
  profileImage: string | null;
}

const App: React.FC = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(getInitialTicketTypes());
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 1,
    quantity: 1,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    project: '',
    profileImage: null,
  });
  const ticketRef = useRef<HTMLDivElement>(null);

  // Save ticket types to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));
  }, [ticketTypes]);

  const handleTicketSelect = (ticket: TicketType) => {
    setBookingState(prev => ({
      ...prev,
      selectedTicket: ticket,
    }));
  };

  const handleNext = () => {
    setBookingState(prev => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const handleBack = () => {
    setBookingState(prev => ({
      ...prev,
      step: prev.step - 1,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        setUserInfo(prev => ({
          ...prev,
          profileImage: imageData,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTicketAvailability = () => {
    if (bookingState.selectedTicket && bookingState.quantity) {
      setTicketTypes(prev => 
        prev.map(ticket => 
          ticket.type === bookingState.selectedTicket?.type
            ? { ...ticket, available: ticket.available - bookingState.quantity }
            : ticket
        )
      );
    }
  };

  const handleDownloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const dataUrl = await toPng(ticketRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'techember-ticket.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error downloading ticket:', err);
      }
    }
  };

  const handleAttendeeDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUserInfo = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      project: formData.get('project') as string,
      profileImage,
    };
    
    setUserInfo(newUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    updateTicketAvailability();
    handleNext();
  };

  const renderStep = () => {
    switch (bookingState.step) {
      case 1:
        return (
          <>
        <div className="step-header">
            <div className="step-indicator">
              <div className="step-header">
                <div className='step-container'>
                  <h2 className="step-title">Ticket Selection</h2>
                  <span className="step-number">Step 1/3</span>
                </div>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '33.33%' }} />
              </div>
            </div>
            </div>

          <div className="event-container">
            <div className="event-banner">
              <h1 className="event-title">Techember Fest '25</h1>
              <p className="event-description">
                Join us for an unforgettable experience at Techember Fest! Secure your spot now.
              </p>
              <p className="event-details">
                📍 04 Rumens road, Ikoyi, Lagos || March 15, 2025 | 7:00 PM
              </p>
            </div>
            <div className="line"></div>

          <div className='select'>Select ticket type
            <div className="ticket-grid">
              {ticketTypes.map(ticket => (
                <div
                  key={ticket.type}
                  className={`ticket-option ${
                    bookingState.selectedTicket?.type === ticket.type ? 'selected' : ''
                  } ${ticket.available === 0 ? 'sold-out' : ''}`}
                  onClick={() => ticket.available > 0 && handleTicketSelect(ticket)}
                >
                  <div className="ticket-price">
                    {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
                  </div>
                  <div className="ticket-type">{ticket.label}</div>
                  <div className="ticket-availability">
                    {ticket.available === 0 ? 'SOLD OUT' : `${ticket.available}/${ticket.available}`}
                  </div>
                </div>
              ))}
            </div>
            </div>

            <div className="quantity-selector">
              <label className="quantity-label">Number of Tickets</label>
              <select 
                className="quantity-select"
                value={bookingState.quantity}
                onChange={(e) => setBookingState(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value)
                }))}
              >
                {[...Array(bookingState.selectedTicket?.available || 0)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button className="btn btn-secondary">Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!bookingState.selectedTicket || bookingState.selectedTicket.available === 0}
              >
                Next
              </button>
            </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
          <div className="step-header">
            <div className="step-indicator">
              <div className="step-header">
                <div className='step-container'>
                  <h2 className="step-title">Attendee Details</h2>
                  <span className="step-number">Step 2/3</span>
                </div>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '66.66%' }} />
              </div>
            </div>
            </div>
             <div className="details">
            <form onSubmit={handleAttendeeDetailsSubmit}>
              <div className="form-group">
                <label className="form-label">Upload Profile Photo</label>
                <div className="upload-area">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="upload-preview" />
                  ) : (
                    <CloudUpload className="upload-icon" size={32} />
                  )}
                  <span>Drag & drop or click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
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
              </div>

              <div className="line"></div>

              <div className="form-name">
                <label className="">Enter your name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  required
                  defaultValue={userInfo.name}
                />
              </div>

              <div className="form-name">
                <label className="">Enter your email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder='ashley@hng.com'
                  required
                  defaultValue={userInfo.email}
                />
              </div>

              <div className="form-name">
                <label className="">Special request?</label>
                <textarea
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
                  onClick={handleBack}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Get My {bookingState.selectedTicket?.price === 0 ? 'Free ' : ''}Ticket
                </button>
              </div>
            </form>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="step-indicator">
              <div className="step-header">
                <div>
                  <h2 className="step-title">Ready</h2>
                  <span className="step-number">Step 3/3</span>
                </div>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="event-banner">
              <h2>Your Ticket is Booked!</h2>
              <p>You can download or check your email for a copy</p>
            </div>

            <div className="ticket-preview" ref={ticketRef}>
              <div className="ticket-header">
                {userInfo.profileImage ? (
                  <img 
                    src={userInfo.profileImage} 
                    alt="Profile" 
                    className="profile-image"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <QRCodeSVG
                    value="https://techember-fest.com/ticket/123"
                    size={100}
                    level="H"
                  />
                )}
              </div>
              <div className="ticket-info">
                <h3>Techember Fest '25</h3>
                <p>📍 04 Rumens road, Ikoyi, Lagos</p>
                <p>🗓 March 15, 2025 | 7:00 PM</p>
                <p>👤 {userInfo.name}</p>
                <div className="ticket-type-tag">
                  {bookingState.selectedTicket?.label}
                </div>
                <div className="ticket-quantity">
                  Quantity: {bookingState.quantity}
                </div>
              </div>
            </div>

            <div className="button-group">
              <button 
                className="btn btn-secondary"
                onClick={() => setBookingState({ step: 1, quantity: 1 })}
              >
                Book Another Ticket
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleDownloadTicket}
              >
                <Download size={16} />
                Download Ticket
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-header">
      <header className="header">
    <nav className="navbar">
    <div className="nav-links">
      <div className='logo'>
      <Ticket size={24} />
      <span>ticz</span>
      </div>
      <div className="links">
      <a href="/events" className="active">Events</a>
      <a href="/my-tickets">My Tickets</a>
      <a href="/about">About Project</a>
      </div>
    </div>
    <a href="/my-tickets" className="my-tickets-btn">
      MY TICKETS <ArrowRight size={16} />
    </a>
  </nav>
</header>

      <main className="card">{renderStep()}</main>
    </div>
  );
};

export default App;