import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Download, UploadCloud as CloudUpload, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { BookingState, TicketType, FormErrors } from './types/types';
import { validateEmail, validateImageUrl } from './utils/validation';
import { saveFormData, getFormData } from './utils/IndexedDB';
import './App.css';

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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));
  }, [ticketTypes]);

  useEffect(() => {
    const loadSavedFormData = async () => {
      try {
        const savedData = await getFormData();
        if (savedData) {
          const userData = savedData as UserInfo;  
          setUserInfo(userData);
          setProfileImage(userData.profileImage || null);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    };
  
    loadSavedFormData();
  }, []);
  

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

  const handleAttendeeDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUserInfo = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      project: formData.get('project') as string,
      profileImage,
    };

    const errors: FormErrors = {};
    if (!newUserInfo.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!validateEmail(newUserInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (profileImage && !validateImageUrl(profileImage)) {
      errors.profileImage = 'Please provide a valid image URL';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await saveFormData(newUserInfo);
      setUserInfo(newUserInfo);
      updateTicketAvailability();
      handleNext();
    } catch (error) {
      console.error('Error saving form data:', error);
    }
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
                <div className="ticket-grid" role="radiogroup" aria-label="Ticket options">
                  {ticketTypes.map(ticket => (
                    <div
                      key={ticket.type}
                      className={`ticket-option ${
                        bookingState.selectedTicket?.type === ticket.type ? 'selected' : ''
                      } ${ticket.available === 0 ? 'sold-out' : ''}`}
                      onClick={() => ticket.available > 0 && handleTicketSelect(ticket)}
                      role="radio"
                      aria-checked={bookingState.selectedTicket?.type === ticket.type}
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (ticket.available > 0) {
                            handleTicketSelect(ticket);
                          }
                        }
                      }}
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
                <label htmlFor="quantity" className="quantity-label">Number of Tickets</label>
                <select 
                  id="quantity"
                  className="quantity-select"
                  value={bookingState.quantity}
                  onChange={(e) => setBookingState(prev => ({
                    ...prev,
                    quantity: parseInt(e.target.value)
                  }))}
                  aria-label="Select number of tickets"
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
                  aria-label="Proceed to attendee details"
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
            <div className="step-header-attendee">
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
              <form onSubmit={handleAttendeeDetailsSubmit} noValidate>
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
                        onChange={handleImageUpload}
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
                    onClick={handleBack}
                    aria-label="Go back to ticket selection"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    aria-label="Complete booking"
                  >
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
                    onClick={() => setBookingState({ step: 1, quantity: 1 })}
                    aria-label="Book another ticket"
                  >
                    Book Another Ticket
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleDownloadTicket}
                    aria-label="Download ticket"
                  >
                    <Download size={16} aria-hidden="true" />
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
              <img src="../src/ticket-01.png" alt="Ticket icon" className='ticket-icon' />
              <span><img src='../src/ticz.png' alt="Ticz logo" className='ticket-logo'/></span>
            </div>
            <div className="links">
              <a href="/events" className="active">Events</a>
              <a href="/my-tickets">My Tickets</a>
              <a href="/about">About Project</a>
            </div>
          </div>
          <a href="/my-tickets" className="my-tickets-btn">
            MY TICKETS <ArrowRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main className="card" role="main">{renderStep()}</main>
    </div>
  );
};

export default App;