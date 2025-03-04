"use client";

import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../../components/ui/dialog'; // Updated import
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';

interface TimeSlotModalProps {
  open: boolean; // Changed from isOpen to open
  onClose: () => void;
  onSelect: (slots: string[]) => void; // Updated to accept multiple slots
}

/**
 * TimeSlotModal Component
 * 
 * This component displays a modal for selecting available time slots. 
 * Users can select a date and time, add it to the list of selected slots, 
 * and save all the selected slots.
 */

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({ open, onClose, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for selected date
  const [selectedTime, setSelectedTime] = useState<string>(''); // State for selected time
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // State to store multiple slots

  /**
   * Handles the confirmation of a selected date and time, adding it to the selected slots list.
   */
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const formattedSlot = `${format(selectedDate, 'EEEE, MMMM d, yyyy')} at ${selectedTime}`;
      setSelectedSlots((prev) => [...prev, formattedSlot]); // Add new slot to the list
      setSelectedDate(null); // Reset date selection
      setSelectedTime(''); // Reset time selection
    }
  };

  /**
   * Handles saving the selected slots, passing them to the parent component.
   */
  const handleSave = () => {
    onSelect(selectedSlots); // Pass all selected slots to the parent
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogTitle>Select Available Time Slot</DialogTitle> {/* Modal title */}
        <div className="p-6">
          <label className="block mb-2">
            Date:
            <input
              type="date"
              onChange={(e) => setSelectedDate(new Date(e.target.value))} // Update selected date
              className="border rounded p-2 mb-4 w-full"
            />
          </label>
          <label className="block mb-2">
            Time:
            <input
              type="time"
              onChange={(e) => setSelectedTime(e.target.value)} // Update selected time
              className="border rounded p-2 mb-4 w-full"
            />
          </label>
          <div className="flex justify-end">
            <Button onClick={handleConfirm} className="mr-2">Add Slot</Button> {/* Add slot button */}
            <Button onClick={handleSave} className="mr-2">Save All</Button> {/* Save all slots button */}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button> {/* Cancel button */}
            </DialogClose>
          </div>
          <div className="mt-4">
            <h3 className="font-medium">Selected Slots:</h3>
            <ul>
              {selectedSlots.map((slot, index) => (
                <li key={index}>{slot}</li> // Display selected slots
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotModal;
