
interface BookingProgressIndicatorProps {
  currentStep: number;
}

const BookingProgressIndicator = ({ currentStep }: BookingProgressIndicatorProps) => {
  const steps = [
    { number: 1, title: 'Ubicación' },
    { number: 2, title: 'Barbero' },
    { number: 3, title: 'Horario' },
    { number: 4, title: 'Datos' },
    { number: 5, title: 'Confirmar' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.number === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : step.number < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 ${
                step.number < currentStep ? 'bg-green-500' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2 space-x-1 md:space-x-4 lg:space-x-8">
        {steps.map((step) => (
          <span key={step.number} className="text-xs md:text-sm text-muted-foreground text-center">
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BookingProgressIndicator;
