
interface BookingProgressIndicatorProps {
  currentStep: number;
}

const BookingProgressIndicator = ({ currentStep }: BookingProgressIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNum === currentStep 
                ? 'bg-barbershop-gold text-white' 
                : stepNum < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                stepNum < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2 space-x-20">
        <span className="text-sm text-gray-600">Datos</span>
        <span className="text-sm text-gray-600">Horario</span>
        <span className="text-sm text-gray-600">Confirmar</span>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;
