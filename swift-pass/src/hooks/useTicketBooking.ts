
import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { 
  BookingState, 
  TicketType, 
  UserInfo, 
  FormErrors 
} from '../types/types';
import { getInitialTicketTypes } from '../utils/localStorage';
import { getFormData, saveFormData } from '../utils/IndexedDB';
import { validateEmail, validateImageUrl } from '../utils/validation';
import { uploadToCloudinary } from '../services/cloudinary';

export const useTicketBooking = () => {
  // State management
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(getInitialTicketTypes());
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 1,
    quantity: 1,
  });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    project: '',
    profileImage: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Load ticket types from localStorage
  useEffect(() => {
    localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));
  }, [ticketTypes]);

  // Load saved form data from IndexedDB
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

  // Ticket selection handlers
  const handleTicketSelect = (ticket: TicketType) => {
    setBookingState(prev => ({
      ...prev,
      selectedTicket: ticket,
    }));
  };

  const handleQuantityChange = (quantity: number) => {
    setBookingState(prev => ({
      ...prev,
      quantity,
    }));
  };

  // Navigation handlers
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

  // Reset booking
  const handleResetBooking = () => {
    setBookingState({
      step: 1,
      quantity: 1,
    });
  };

  // Image handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        setProfileImage(imageUrl);
        setUserInfo(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
        setFormErrors(prev => ({
          ...prev,
          profileImage: undefined
        }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: 'Failed to upload image. Please try again.'
        }));
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (validateImageUrl(url)) {
      setProfileImage(url);
      setUserInfo(prev => ({
        ...prev,
        profileImage: url
      }));
      setFormErrors(prev => ({
        ...prev,
        profileImage: undefined
      }));
    } else {
      setFormErrors(prev => ({
        ...prev,
        profileImage: 'Please provide a valid image URL'
      }));
    }
  };

  // Form validation and submission
  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (profileImage && !validateImageUrl(profileImage)) {
      newErrors.profileImage = 'Please provide a valid image URL';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttendeeDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) {
      return;
    }

    const newUserInfo = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      project: formData.get('project') as string,
      profileImage: profileImage
    };

    try {
      await saveFormData(newUserInfo);
      setUserInfo(newUserInfo);
      updateTicketAvailability();
      handleNext();
    } catch (error) {
      console.error('Error saving form data:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'Failed to save your information. Please try again.'
      }));
    }
  };

  // Ticket availability management
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

  // Ticket download
  const handleDownloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const dataUrl = await toPng(ticketRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `techember-ticket-${userInfo.name}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error downloading ticket:', err);
        // Optionally set an error state or show a notification
      }
    }
  };

  // Email ticket
  const handleEmailTicket = async () => {
    // Implementation for emailing ticket
    // This would typically integrate with a backend service
    console.log('Email ticket functionality to be implemented');
  };

  return {
    // State
    ticketTypes,
    bookingState,
    userInfo,
    formErrors,
    profileImage,
    ticketRef,

    // Handlers
    handleTicketSelect,
    handleQuantityChange,
    handleNext,
    handleBack,
    handleResetBooking,
    handleImageUpload,
    handleImageUrlChange,
    handleAttendeeDetailsSubmit,
    handleDownloadTicket,
    handleEmailTicket,
  };
};

export default useTicketBooking;