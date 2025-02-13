import React from 'react';
import { TicketType } from '../types/types';

interface TicketSelectionProps {
  ticketTypes: TicketType[];
  selectedTicket?: TicketType;
  onTicketSelect: (ticket: TicketType) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onNext: () => void;
}

const TicketSelection: React.FC<TicketSelectionProps> = ({
  ticketTypes,
  selectedTicket,
  onTicketSelect,
  quantity,
  onQuantityChange,
  onNext,
}) => {
  return (
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

    
      <div className="select">
        Select ticket type
        <div className="ticket-grid" role="radiogroup" aria-label="Ticket options">
          {ticketTypes.map((ticket) => (
            <div
              key={ticket.type}
              className={`ticket-option ${
                selectedTicket?.type === ticket.type ? 'selected' : ''
              } ${ticket.available === 0 ? 'sold-out' : ''} ${
                ticket.price === 0 ? 'free-ticket' : ''
              }`}
              onClick={() => ticket.available > 0 && onTicketSelect(ticket)}
              role="radio"
              aria-checked={selectedTicket?.type === ticket.type}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (ticket.available > 0) {
                    onTicketSelect(ticket);
                  }
                }
              }}
            >
             
              <div className="ticket-price">
                {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
              </div>

              <div className="ticket-type">{ticket.label}</div>

              <div className="ticket-availability">
                {ticket.available === 0 ? 'SOLD OUT' : `${ticket.available}/${ticket.total}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quantity-selector">
        <label htmlFor="quantity" className="quantity-label">
          Number of Tickets
        </label>
        <select
          id="quantity"
          className="quantity-select"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value))}
          aria-label="Select number of tickets"
        >
          {[...Array(selectedTicket?.available || 0)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary">Cancel</button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!selectedTicket || selectedTicket.available === 0}
          aria-label="Proceed to attendee details"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TicketSelection;