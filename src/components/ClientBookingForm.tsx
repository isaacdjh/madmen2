
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getBarbersWithSchedules } from '@/lib/supabase-helpers';
import { useClientBooking } from '@/hooks/useClientBooking';
import BookingProgressIndicator from './client/booking/BookingProgressIndicator';
import PersonalDataStep from './client/booking/PersonalDataStep';
import ScheduleStep from './client/booking/ScheduleStep';
import ConfirmationStep from './client/booking/ConfirmationStep';

interface ClientBookingFormProps {
  onBack: () => void;
}

const ClientBookingForm = ({ onBack }: ClientBookingFormProps) => {
  const {
    step,
    setStep,
    formData,
    setFormData,
    isSubmitting,
    services,
    locations,
    handleSlotSelect,
    handleSubmit
  } = useClientBooking(onBack);

  const [availableBarbers, setAvailableBarbers] = useState<any[]>([]);

  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const [bordiu, pardinas] = await Promise.all([
          getBarbersWithSchedules('cristobal-bordiu'),
          getBarbersWithSchedules('general-pardinas')
        ]);
        
        const allBarbers = [...bordiu, ...pardinas].filter(barber => barber.status === 'active');
        setAvailableBarbers(allBarbers);
      } catch (error) {
        console.error('Error cargando barberos:', error);
      }
    };
    
    loadBarbers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-barbershop-dark hover:bg-barbershop-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-barbershop-dark">Reservar Cita</h1>
            <p className="text-gray-600">Completa los pasos para reservar tu cita</p>
          </div>
        </div>

        <BookingProgressIndicator currentStep={step} />

        {step === 1 && (
          <PersonalDataStep
            formData={formData}
            setFormData={setFormData}
            services={services}
            availableBarbers={availableBarbers}
            locations={locations}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <ScheduleStep
            formData={formData}
            availableBarbers={availableBarbers}
            onSlotSelect={handleSlotSelect}
            onPrevious={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <ConfirmationStep
            formData={formData}
            services={services}
            locations={locations}
            availableBarbers={availableBarbers}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onPrevious={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
};

export default ClientBookingForm;
