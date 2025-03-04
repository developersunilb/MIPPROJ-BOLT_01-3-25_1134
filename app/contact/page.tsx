"use client";

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Phone, Mail, MessageSquare } from 'lucide-react';
//import { useToast } from '../../hooks/use-toast';
import { useToast } from "../../components/ui/use-toast";

/**
 * ContactPage component renders a contact form and contact information
 * for users to get in touch with the sales team.
 */
export default function ContactPage() {
  const { toast } = useToast();
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  // State to manage form submission status
  const [submitting, setSubmitting] = useState(false);

  /**
   * Handles form submission.
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      if (toast) {
        toast({
          title: 'Message Sent',
          description: 'Thank you for your message. Our team will get back to you shortly.',
          variant: 'default'
        });
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
      
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Contact Our Sales Team
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get in touch with us to discuss your enterprise needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            <div className="mt-8 space-y-6">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-primary" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Sales Direct Line</h3>
                  <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-primary" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="mt-1 text-gray-600">sales@mockmaster.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                  <p className="mt-1 text-gray-600">Available 9 AM - 5 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <Input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1"
                  rows={4}
                  required
                  disabled={submitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
