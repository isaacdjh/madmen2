
import { useState } from 'react';
import { toast } from 'sonner';
import { createOrGetClient, createAppointment } from '@/lib/supabase-helpers';
import { supabase } from '@/integrations/supabase/client';

export const useClientBooking = (onBack: () => void) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferredBarber: '',
    barber: '',
    location: '',
    date: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45, duration: 30 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25, duration: 20 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65, duration: 45 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35, duration: 30 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40, duration: 40 }
  ];

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  const handleSlotSelect = (barber: string, date: string, time: string, location: string) => {
    console.log('Slot seleccionado:', { barber, date, time, location });
    
    setFormData(prev => ({
      ...prev,
      barber,
      date,
      time,
      location
    }));
    setStep(4);
  };

  const sendConfirmationEmail = async (appointmentData: any, appointmentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-appointment-confirmation', {
        body: {
          clientName: appointmentData.name,
          clientEmail: appointmentData.email,
          service: services.find(s => s.id === appointmentData.service)?.name || appointmentData.service,
          barber: appointmentData.barber,
          location: appointmentData.location,
          date: appointmentData.date,
          time: appointmentData.time,
          price: services.find(s => s.id === appointmentData.service)?.price || 0,
          appointmentId: appointmentId
        }
      });

      if (error) {
        console.error('Error enviando email de confirmación:', error);
        // No bloqueamos el proceso si falla el email
        toast.warning('Cita creada exitosamente, pero no se pudo enviar el email de confirmación');
      } else {
        console.log('Email de confirmación enviado exitosamente');
      }
    } catch (error) {
      console.error('Error enviando email de confirmación:', error);
      // No bloqueamos el proceso si falla el email
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.service || 
        !formData.barber || !formData.date || !formData.time || !formData.location) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creando cita con datos:', formData);
      
      const client = await createOrGetClient(formData.name, formData.phone, formData.email);
      const selectedService = services.find(s => s.id === formData.service);
      
      const appointmentData = {
        client_id: client.id,
        location: formData.location,
        service: formData.service,
        barber: formData.barber,
        appointment_date: formData.date,
        appointment_time: formData.time,
        price: selectedService?.price,
        status: 'confirmada' as const
      };
      
      console.log('Datos de la cita a crear:', appointmentData);
      
      const newAppointment = await createAppointment(appointmentData);
      
      console.log('Cita creada exitosamente:', newAppointment);

      // Enviar email de confirmación
      await sendConfirmationEmail(formData, newAppointment.id);

      toast.success('¡Cita reservada con éxito! Te hemos enviado un email de confirmación.');
      
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        preferredBarber: '',
        barber: '',
        location: '',
        date: '',
        time: ''
      });
      setStep(1);
      onBack();
      
    } catch (error) {
      console.error('Error al crear cita:', error);
      toast.error('Error al reservar la cita. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    isSubmitting,
    services,
    locations,
    handleSlotSelect,
    handleSubmit
  };
};
