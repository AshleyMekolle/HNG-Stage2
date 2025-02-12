import React from 'react';
import { ArrowRight } from 'lucide-react';

const Navbar: React.FC = () => (
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
);

export default Navbar;
