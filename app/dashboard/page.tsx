"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Video } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import toast from 'react-hot-toast'; // Import react-hot-toast

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/use-auth';
import { useProtectedRoute } from '../../hooks/use-protected-route';
import { getUserAppointments, cancelAppointment, getFeedback } from '../../lib/api';
import { format } from 'date-fns';

export default function DashboardPage() {
  useProtectedRoute();

  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getUserAppointments(user.id);
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load your appointments'); // Use react-hot-toast for errors
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleReschedule = (appointmentId: string) => {
    router.push(`/reschedule?appointment=${appointmentId}`);
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      setActionInProgress(appointmentId);
      await cancelAppointment(appointmentId);

      setAppointments(appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'cancelled' }
          : appointment
      ));

      toast.success('Your appointment has been cancelled successfully.'); // Use react-hot-toast for success
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel your appointment'); // Use react-hot-toast for errors
    } finally {
      setActionInProgress(null);
    }
  };

  const handleJoinMeeting = (appointmentId: string) => {
    console.log('Joining meeting for appointment:', appointmentId);
  };

  const handleViewFeedback = (appointmentId: string) => {
    console.log('Viewing feedback for appointment:', appointmentId);
  };

  const upcomingAppointments = appointments.filter(appointment => appointment.status === 'scheduled');
  const pastAppointments = appointments.filter(appointment => appointment.status === 'completed');
  const cancelledAppointments = appointments.filter(appointment => appointment.status === 'cancelled');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upcoming Sessions */}
          <Card className="col-span-1 p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You do not have any upcoming sessions</p>
                <Button onClick={() => router.push('/experts')}>Book a Session</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Session with {appointment.expert_profiles?.profiles?.full_name || 'Expert'}</h3>
                      <span className="text-sm text-green-600">Upcoming</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(appointment.availability.start_time), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date(appointment.availability.end_time), 'h:mm a')}
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" onClick={() => handleJoinMeeting(appointment.id)}>Join</Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewFeedback(appointment.id)}>View Feedback</Button>
                      <Button size="sm" variant="outline" onClick={() => handleReschedule(appointment.id)} disabled={actionInProgress === appointment.id}>Reschedule</Button>
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleCancel(appointment.id)} disabled={actionInProgress === appointment.id}>
                        {actionInProgress === appointment.id ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Calendar */}
          <Card className="col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule</h2>
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={appointments.map(appointment => ({
                  title: `Session with ${appointment.expert_profiles?.profiles?.full_name || 'Expert'}`,
                  start: appointment.availability.start_time,
                  end: appointment.availability.end_time,
                  backgroundColor:
                    appointment.status === 'scheduled' ? '#10B981' :
                      appointment.status === 'completed' ? '#6B7280' : '#EF4444',
                  borderColor:
                    appointment.status === 'scheduled' ? '#059669' :
                      appointment.status === 'completed' ? '#4B5563' : '#DC2626',
                  textColor: '#FFFFFF',
                  extendedProps: {
                    appointmentId: appointment.id,
                    status: appointment.status
                  }
                }))}
                editable={false}
                selectable={false}
                dayMaxEvents={true}
                weekends={true}
                expandRows={true}
                height="100%"
              />
            </div>
          </Card>
        </div>

        {/* Feedback Section */}
        {feedback.length > 0 && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>
            {feedback.map(item => (
              <div key={item.id} className="mb-4">
                <h3 className="font-medium">{item.title}</h3>
                <p>{item.comments}</p>
              </div>
            ))}
          </Card>
        )}

        {/* Past Sessions */}
        {(pastAppointments.length > 0 || cancelledAppointments.length > 0) && (
          <div className="mt-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastAppointments.map(appointment => (
                  <div key={appointment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Session with {appointment.expert_profiles?.profiles?.full_name || 'Expert'}</h3>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Date: {format(new Date(appointment.availability.start_time), 'MMMM d, yyyy')}</p>
                      <p>Time: {format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date(appointment.availability.end_time), 'h:mm a')}</p>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewFeedback(appointment.id)}>
                        View Feedback
                      </Button>
                    </div>
                  </div>
                ))}

                {cancelledAppointments.map(appointment => (
                  <div key={appointment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Session with {appointment.expert_profiles?.profiles?.full_name || 'Expert'}</h3>
                      <span className="text-sm text-red-600">Cancelled</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Date: {format(new Date(appointment.availability.start_time), 'MMMM d, yyyy')}</p>
                      <p>Time: {format(new Date(appointment.availability.start_time), 'h:mm a')} - {format(new Date(appointment.availability.end_time), 'h:mm a')}</p>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" onClick={() => router.push('/experts')}>
                        Book New Session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
