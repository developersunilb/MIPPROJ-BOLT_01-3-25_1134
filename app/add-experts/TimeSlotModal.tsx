"use client";

import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'; // Updated import
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TimeSlotModalProps {
  open: boolean; // Changed from isOpen to open
  onClose: () => void;
  onSelect: (slots: string[]) => void; // Updated to accept multiple slots
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({ open, onClose, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // State to store multiple slots

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const formattedSlot = `${format(selectedDate, 'EEEE, MMMM d, yyyy')} at ${selectedTime}`;
      setSelectedSlots((prev) => [...prev, formattedSlot]); // Add new slot to the list
      setSelectedDate(null); // Reset date selection
      setSelectedTime(''); // Reset time selection
    }
  };

  const handleSave = () => {
    onSelect(selectedSlots); // Pass all selected slots to the parent
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogTitle>Select Available Time Slot</DialogTitle> {/* Added DialogTitle */}
        <div className="p-6">
          <label className="block mb-2">
            Date:
            <input
              type="date"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="border rounded p-2 mb-4 w-full"
            />
          </label>
          <label className="block mb-2">
            Time:
            <input
              type="time"
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border rounded p-2 mb-4 w-full"
            />
          </label>
          <div className="flex justify-end">
            <Button onClick={handleConfirm} className="mr-2">Add Slot</Button>
            <Button onClick={handleSave} className="mr-2">Save All</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
          <div className="mt-4">
            <h3 className="font-medium">Selected Slots:</h3>
            <ul>
              {selectedSlots.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotModal;
