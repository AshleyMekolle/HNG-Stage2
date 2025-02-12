import { TicketType } from '../types/types';

export const getInitialTicketTypes = (): TicketType[] => {
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