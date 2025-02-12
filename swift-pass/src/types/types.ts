export interface TicketType {
  type: string;
  price: number;
  available: number;
  label: string;
}

export interface BookingState {
  step: number;
  quantity: number;
  selectedTicket?: TicketType;
}

export interface FormErrors {
  name?: string;
  email?: string;
  profileImage?: string;
}

export interface UserInfo {
  name: string;
  email: string;
  project: string;
  profileImage: string | null;
}

export interface CloudinaryResponse {
  secure_url: string;
}