"use client";

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/use-auth';
import { useProtectedRoute } from '../../hooks/use-protected-route';
import { getExpertAppointments, addAvailability, removeAvailability } from '../../lib/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';

/**
 * ExpertDashboardPage component
 *
 * This component renders the dashboard for experts to manage their availability and view their upcoming and past sessions.
 */
export default function ExpertDashboardPage() {
  // Protect this route and ensure only experts can access it
  useProtectedRoute(true);

  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getExpertAppointments(user.id);
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your appointments',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  const handleDateSelect = async (selectInfo: any) => {
    if (!user) return;

    try {
      setActionInProgress(true);

      // Add new availability slot
      const startTime = new Date(selectInfo.startStr);
      const endTime = new Date(selectInfo.endStr);

      const newSlot = await addAvailability(user.id, startTime, endTime);

      // Update local state
      setAvailabilitySlots([...availabilitySlots, newSlot]);

      toast({
        title: 'Availability Added',
        description: 'Your availability has been added successfully.',
      });
    } catch (error) {
      console.error('Error adding availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to add availability',
        variant: 'destructive',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEventClick = async (clickInfo: any) => {
    // Only allow removing availability slots that aren't booked
    const eventData = clickInfo.event.extendedProps;

    if (eventData.type === 'availability' && !eventData.isBooked) {
      try {
        setActionInProgress(true);

        await removeAvailability(eventData.id);

        // Update local state
        setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== eventData.id));

        toast({
          title: 'Availability Removed',
          description: 'Your availability has been removed successfully.',
        });
      } catch (error) {
        console.error('Error removing availability:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove availability',
          variant: 'destructive',
        });
      } finally {
        setActionInProgress(false);
      }
    }
  };

  const upcomingAppointments = appointments.filter(
    appointment => appointment.status === 'scheduled'
  );

  const pastAppointments = appointments.filter(
    appointment => appointment.status === 'completed'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upcoming Appointments */}
          <Card className="col-span-1 p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any upcoming appointments</p>
                <p className="text-sm text-gray-600">Add availability slots to allow users to book sessions with you.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Session with {appointment.profiles?.full_name || 'User'}</h3>
                      <span className="text-sm text-green-600">Upcoming</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Date: {format(new Date(appointment.availability.start_time), 'EEEE, MMMM d, yyyy')}</p>
                      <p>Time: {format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date(appointment.availability.end_time), 'h:mm a')}</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm">Start Session</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Availability Calendar */}
          <Card className="col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Availability</h2>
            <p className="text-gray-600 mb-4">
              Click and drag to set your available time slots. Click on an available slot to remove it.
            </p>
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'timeGridWeek,timeGridDay'
                }}
                events={[
                  ...availabilitySlots.map(slot => ({
                    title: slot.is_booked ? 'Booked' : 'Available',
                    start: slot.start_time,
                    end: slot.end_time,
                    backgroundColor: slot.is_booked ? '#F59E0B' : '#10B981',
                    borderColor: slot.is_booked ? '#D97706' : '#059669',
                    textColor: '#FFFFFF',
                    extendedProps: {
                      id: slot.id,
                      type: 'availability',
                      isBooked: slot.is_booked
                    }
                  })),
                  ...appointments.map(appointment => ({
                    title: `Session with ${appointment.profiles?.full_name || 'User'}`,
                    start: appointment.availability.start_time,
                    end: appointment.availability.end_time,
                    backgroundColor: '#3B82F6',
                    borderColor: '#2563EB',
                    textColor: '#FFFFFF',
                    extendedProps: {
                      id: appointment.id,
                      type: 'appointment'
                    }
                  }))
                ]}
                editable={false}
                selectable={!actionInProgress}
                select={handleDateSelect}
                eventClick={handleEventClick}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                expandRows={true}
                height="100%"
                slotMinTime="09:00:00"
                slotMaxTime="18:00:00"
              />
            </div>
          </Card>
        </div>

        {/* Past Sessions */}
        {pastAppointments.length > 0 && (
          <div className="mt-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Session with {appointment.profiles?.full_name || 'User'}</h3>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Date: {format(new Date(appointment.availability.start_time), 'MMMM d, yyyy')}</p>
                      <p>Time: {format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date
