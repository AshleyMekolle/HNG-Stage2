export interface TicketType {
    type: 'REGULAR' | 'VIP' | 'VVIP';
    price: number;
    available: number;
    label: string;
  }
  
  export interface AttendeeDetails {
    name: string;
    email: string;
    about: string;
    profilePhoto?: File;
  }
  
  export interface BookingState {
    step: number;
    selectedTicket?: TicketType;
    quantity: number;
    attendeeDetails?: AttendeeDetails;
  }

 export interface UserInfo {
    name: string;
    email: string;
    project: string;
    profileImage: string | null;
  }
  
 export interface FormErrors {
    name?: string;
    email?: string;
    profileImage?: string;
  }