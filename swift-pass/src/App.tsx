import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import TicketSelection from './components/ticketSelection';
import AttendeeForm from './components/AttendeeForm';
import TicketPreview from './components/TicketPreview';
import { BookingState, TicketType, FormErrors, UserInfo } from './types/types';
import { validateEmail } from './utils/validation';
import { saveFormData, getFormData } from './utils/IndexedDB';
import './App.css';

const CLOUDINARY_CLOUD_NAME = 'dywxwwecr';
const CLOUDINARY_UPLOAD_PRESET = 'hng-ticket-conference';

const getInitialTicketTypes = (): TicketType[] => {
  const storedTickets = localStorage.getItem('ticketTypes');
  if (storedTickets) {
    return JSON.parse(storedTickets);
  }
  return [
    { type: 'REGULAR', price: 0, available: 20, label: 'REGULAR ACCESS', total: 20 },
    { type: 'VIP', price: 50, available: 20, label: 'VIP ACCESS', total: 20 },
    { type: 'VVIP', price: 150, available: 20, label: 'VVIP ACCESS', total: 20 },
  ];
};

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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));
  }, [ticketTypes]);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await getFormData();
        if (savedData) {
          const userData = savedData as UserInfo;
          setUserInfo(userData);
        }

        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
          setUserInfo(prev => ({ ...prev, profileImage: savedImage }));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    loadSavedData();
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary configuration is missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('timestamp', String(Math.round(new Date().getTime() / 1000)));

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image file.');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        console.error('Cloudinary Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });

        if (errorData.error && errorData.error.message) {
          throw new Error(`Upload failed: ${errorData.error.message}`);
        }
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Detailed upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Image upload failed. Please try again.');
    }
  };

  const verifyCloudinaryConfig = () => {
    if (!CLOUDINARY_CLOUD_NAME) {
      console.error('Missing CLOUDINARY_CLOUD_NAME');
      return false;
    }
    if (!CLOUDINARY_UPLOAD_PRESET) {
      console.error('Missing CLOUDINARY_UPLOAD_PRESET');
      return false;
    }
    return true;
  };

  const handleImageUpload = async (file: File) => {
    if (!verifyCloudinaryConfig()) {
      setFormErrors(prev => ({
        ...prev,
        profileImage: 'Image upload is not properly configured',
      }));
      return;
    }

    setIsUploading(true);
    setFormErrors(prev => ({ ...prev, profileImage: undefined }));

    try {
      const imageUrl = await uploadToCloudinary(file);
      setProfileImage(imageUrl);
      setUserInfo(prev => ({ ...prev, profileImage: imageUrl }));
      localStorage.setItem('profileImage', imageUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      console.error('Upload error:', error);
      setFormErrors(prev => ({
        ...prev,
        profileImage: errorMessage,
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageUpload(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

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

  const handleQuantityChange = (quantity: number) => {
    setBookingState(prev => ({
      ...prev,
      quantity,
    }));
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
      profileImage: profileImage,
    };

    const errors: FormErrors = {};
    if (!newUserInfo.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!validateEmail(newUserInfo.email)) {
      errors.email = 'Please enter a valid email address';
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

  const handleBookAnother = () => {
    setBookingState({ step: 1, quantity: 1 });
    setUserInfo({
      name: '',
      email: '',
      project: '',
      profileImage: null,
    });
    setProfileImage(null);
    localStorage.removeItem('profileImage');
  };

  const getStepTitle = () => {
    switch (bookingState.step) {
      case 1:
        return 'Ticket Selection';
      case 2:
        return 'Attendee Details';
      case 3:
        return 'Ready';
      default:
        return '';
    }
  };

  const renderStep = () => {
    switch (bookingState.step) {
      case 1:
        return (
          <TicketSelection
            ticketTypes={ticketTypes}
            selectedTicket={bookingState.selectedTicket}
            onTicketSelect={handleTicketSelect}
            quantity={bookingState.quantity}
            onQuantityChange={handleQuantityChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <AttendeeForm
            userInfo={userInfo}
            formErrors={formErrors}
            profileImage={profileImage}
            onSubmit={handleAttendeeDetailsSubmit}
            onImageUpload={handleFileInput}
            onImageDrop={handleDrop}
            onBack={handleBack}
            selectedTicketPrice={bookingState.selectedTicket?.price}
            isUploading={isUploading}
          />
        );
      case 3:
        return (
          <TicketPreview
            userInfo={userInfo}
            bookingState={bookingState}
            ticketRef={ticketRef}
            onDownload={handleDownloadTicket}
            onBookAnother={handleBookAnother}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-header">
      <Header />
      <main className="card" role="main">
        <StepIndicator
          currentStep={bookingState.step}
          title={getStepTitle()}
        />
        {renderStep()}
      </main>
    </div>
  );
};

export default App;