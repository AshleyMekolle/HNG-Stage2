// src/components/Header/Header.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-links">
          <div className='logo'>
            <img src="/ticket-01.png" alt="ticket-icon" className='ticket-icon' />
            <span><img src='/ticz.png' alt="ticz-logo" className='ticket-logo'/></span>
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
  );
};

export default Header;