"use client";

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { useToast } from '../../hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';
import { useProtectedRoute } from '../../hooks/use-protected-route';
import { getUserAppointments, getExpertAvailability, rescheduleAppointment } from '../../lib/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';

/**
 * ReschedulePage component
 *
 * This component renders a page for users to reschedule their appointments. It
 * fetches the appointment details and available time slots from the API and
 * displays a calendar for the user to select a new time slot. It also displays
 * a summary of the current and new appointment details.
 */
export default function ReschedulePage() {
  useProtectedRoute(); // Protect this route
  
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSlotData, setSelectedSlotData] = useState<any>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    /**
     * Fetch appointment details and available time slots when the component mounts.
     */
    const fetchData = async () => {
      if (!user || !appointmentId) return;
      
      try {
        setLoading(true);
        
        // Fetch the appointment details
        const appointments = await getUserAppointments(user.id);
        const currentAppointment = appointments.find(apt => apt.id === appointmentId);
        
        if (!currentAppointment) {
          toast({
            title: 'Appointment Not Found',
            description: 'The appointment you are trying to reschedule could not be found.',
            variant: 'destructive',
          });
          router.push('/dashboard');
          return;
        }
        
        setAppointment(currentAppointment);
        
        // Fetch available slots for the expert
        const availability = await getExpertAvailability(currentAppointment.expert_id);
        setAvailabilitySlots(availability.filter((slot: any) => !slot.is_booked) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointment data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && appointmentId) {
      fetchData();
    }
  }, [user, appointmentId, toast, router]);

  /**
   * Handle date selection on the calendar.
   * @param {object} selectInfo The selected date and time.
   */
  const handleDateSelect = (selectInfo: any) => {
    const selectedDate = selectInfo.startStr;
    
    // Find the availability slot that matches this time
    const slot = availabilitySlots.find(
      slot => 
        new Date(slot.start_time).toISOString() === selectedDate && 
        !slot.is_booked
    );
    
    if (slot) {
      setSelectedSlot(selectedDate);
      setSelectedSlotData(slot);
    }
  };

  /**
   * Handle confirmation of the new appointment date and time.
   */
  const handleConfirmReschedule = async () => {
    if (!user || !appointment || !selectedSlotData) return;
    
    try {
      setActionInProgress(true);
      
      // Reschedule the appointment
      await rescheduleAppointment(appointment.id, selectedSlotData.id);
      
      toast({
        title: 'Appointment Rescheduled',
        description: 'Your appointment has been rescheduled successfully.',
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: 'Rescheduling Failed',
        description: 'There was an error rescheduling your appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  /**
   * Render the component.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Appointment Not Found</h2>
            <p className="mb-4">The appointment you're trying to reschedule could not be found.</p>
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
        {/* Current Appointment */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Appointment</h2>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <img
                  src={appointment.expert_profiles?.image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&h=250&auto=format&fit=crop"}
                  alt={appointment.expert_profiles?.profiles?.full_name || "Expert"}
                  className="h-full w-full object-cover rounded-full"
                />
              </Avatar>
              <div>
                <h3 className="font-medium">{appointment.expert_profiles?.profiles?.full_name || "Expert"}</h3>
                <p className="text-sm text-gray-600">{appointment.expert_profiles?.title}</p>
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
                initialView="timeGridWeek" initialView="timeGridWeek"
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
              <p>{format(new Date(selectedSlot), 'h:mm a')} - {format(new Date(selectedSlotData.end_time), 'h:mm a')}</p>
              <div className="mt-4 flex space-x-4">
                <Button 
                  className="flex-1"
