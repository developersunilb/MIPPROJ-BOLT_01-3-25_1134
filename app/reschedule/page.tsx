"use client";

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'; // Updated import

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';
import { useProtectedRoute } from '../../hooks/use-protected-route';
import { getUserAppointments, rescheduleAppointment, getExpertAvailability } from '../../lib/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';

/**
 * Define Appointment type
 */
interface Appointment {
  id: string;
  expert_profiles: {
    image_url: string;
    profiles: {
      full_name: string;
      title: string;
      id: string; // Ensure id is included for expert identification
    };
  };
  availability: {
    start_time: string;
    end_time: string;
  };
}

/**
 * ReschedulePage component
 * 
 * This component allows users to reschedule their existing appointments with experts. It fetches
 * appointment details and available time slots for rescheduling, and provides an interface to 
 * select a new time slot and confirm the rescheduling.
 */
export default function ReschedulePage() {
  useProtectedRoute(); // Protect this route to ensure only authenticated users can access
  
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null); // Define Appointment type
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSlotData, setSelectedSlotData] = useState<any>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  useEffect(() => {
    /**
     * Fetches data including the appointment details and availability slots for rescheduling.
     */
    const fetchData = async () => {
      if (!user || !appointmentId) return;
      
      try {
        setLoading(true);
        setErrorMessage(null); // Reset error before fetching
        
        // Fetch the appointment details
        const appointments = await getUserAppointments(user.id);
const currentAppointment = appointments.find(apt => apt.id === appointmentId) as Appointment; // Cast to Appointment type

        
if (!currentAppointment || !currentAppointment.expert_profiles || !currentAppointment.availability) {

          setErrorMessage('The appointment you are trying to reschedule could not be found.'); // Update this line
          router.push('/dashboard');
          return;
        }
        
        setAppointment(currentAppointment);
        
        // Fetch available slots for the expert
        const availability = await getExpertAvailability(currentAppointment.expert_profiles.profiles.id); // Access expert_id correctly
        setAvailabilitySlots(availability.filter((slot: any) => !slot.is_booked) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load appointment data'); // Update this line
      } finally {
        setLoading(false);
      }
    };

    if (user && appointmentId) {
      fetchData();
    }
  }, [user, appointmentId, router]);

  // Function to handle date selection
const handleDateSelect = (selectInfo: any) => { // Ensure this function is defined

    const selectedDate = selectInfo.startStr;
    const slot = availabilitySlots.find(slot => new Date(slot.start_time).toISOString() === selectedDate && !slot.is_booked);
    
    if (slot) {
      setSelectedSlot(selectedDate);
      setSelectedSlotData(slot);
    }
  };

  // Function to confirm rescheduling
const handleConfirmReschedule = async () => { // Ensure this function is defined

    if (!user || !appointment || !selectedSlotData) return;

    try {
      setActionInProgress(true);
      await rescheduleAppointment(appointment.id, selectedSlotData.id);
      setErrorMessage(null); // Reset error message on success
      router.push('/dashboard');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setErrorMessage('There was an error rescheduling your appointment. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Display error message if it exists
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  // Display a message if the appointment is not found
  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Appointment Not Found</h2>
            <p className="mb-4">The appointment you are trying to reschedule could not be found.</p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Reschedule Appointment</h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Current Appointment */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Appointment</h2>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
<Avatar className="h-12 w-12">
  <AvatarImage
    src={appointment.expert_profiles?.image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&h=250&auto=format&fit=crop"}
    alt={appointment.expert_profiles?.profiles?.full_name || "Expert"}
  />
  <AvatarFallback>
    {appointment.expert_profiles?.profiles?.full_name?.charAt(0) || "E"}
  </AvatarFallback>

                </Avatar>
                <div>
                  <h3 className="font-medium">{appointment.expert_profiles?.profiles?.full_name || "Expert"}</h3>
<p className="text-sm text-gray-600">{appointment.expert_profiles?.profiles?.title}</p>

                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Current Date and Time:</p>
                <p>{format(new Date(appointment.availability.start_time), 'EEEE, MMMM d, yyyy')}</p>
                <p>{format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date(appointment.availability.end_time), 'h:mm a')}</p>
              </div>
            </div>
          </Card>

          {/* Calendar */}
          <Card className="col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-4">Select a New Time Slot</h2>
            {availabilitySlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No available time slots found for this expert</p>
                <Button onClick={() => router.push('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <div className="h-[600px]">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                  }}
                  events={availabilitySlots.map(slot => ({
                    title: 'Available',
                    start: slot.start_time,
                    end: slot.end_time,
                    backgroundColor: '#10B981',
                    borderColor: '#059669',
                    textColor: '#FFFFFF',
                    extendedProps: {
                      slotId: slot.id
                    }
                  }))}
                  selectable={true}
                  select={handleDateSelect}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  expandRows={true}
                  height="100%"
                  slotMinTime="09:00:00"
                  slotMaxTime="18:00:00"
                  selectAllow={(selectInfo) => {
                    // Only allow selection of available slots
                    const selectedDate = selectInfo.startStr;
                    return availabilitySlots.some(
                      slot => 
                        new Date(slot.start_time).toISOString() === selectedDate && 
                        !slot.is_booked
                    );
                  }}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Reschedule Summary */}
        {selectedSlot && selectedSlotData && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Reschedule Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-2">Current Appointment</h3>
                <p>{format(new Date(appointment.availability.start_time), 'EEEE, MMMM d, yyyy')}</p>
                <p>{format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date(appointment.availability.end_time), 'h:mm a')}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">New Appointment</h3>
                <p>{format(new Date(selectedSlot), 'EEEE, MMMM d, yyyy')}</p>
                <p>{format(new Date(selectedSlotData.end_time), 'h:mm a')} - {format(new Date(selectedSlotData.end_time), 'h:mm a')}</p>
                <div className="mt-4 flex space-x-4">
                  <Button
                    className="flex-1"
                    onClick={handleConfirmReschedule}
                    disabled={actionInProgress}
                  >
                    Confirm Reschedule
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
