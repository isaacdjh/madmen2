import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoMadmen from '@/assets/logo-madmen-white.png';

const Reservas = () => {
  const locations = [
    {
      name: 'Salamanca',
      address: 'C/ General Pardiñas 101, Madrid',
      bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/108540?utm_source=instagram&utm_medium=bio&utm_campaign=reservas&utm_content=salamanca',
      mapsUrl: 'https://maps.app.goo.gl/e1Nkf9u7DgWZfwwD7?g_st=ic',
      whatsappUrl: 'https://wa.me/34623158565?text=Hola%20Mad%20Men%2C%20quiero%20reservar%20en%20Barrio%20Salamanca.%20',
    },
    {
      name: 'Retiro',
      address: 'C/ Alcalde Sainz de Baranda 53, Madrid',
      bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/160842?utm_source=instagram&utm_medium=bio&utm_campaign=reservas&utm_content=retiro',
      mapsUrl: 'https://maps.app.goo.gl/jQhXey9yk1HcBrub6?g_st=ic',
      whatsappUrl: 'https://wa.me/34623158565?text=Hola%20Mad%20Men%2C%20quiero%20reservar%20en%20Barrio%20Retiro.%20',
    },
    {
      name: 'Ríos Rosas',
      address: 'C/ Cristóbal Bordiú 29, Madrid',
      bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/101632?utm_source=instagram&utm_medium=bio&utm_campaign=reservas&utm_content=rios_rosas',
      mapsUrl: 'https://maps.app.goo.gl/1Y2CqEsgfz3LryE77?g_st=ic',
      whatsappUrl: 'https://wa.me/34623158565?text=Hola%20Mad%20Men%2C%20quiero%20reservar%20en%20R%C3%ADos%20Rosas.%20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoMadmen} 
            alt="Mad Men Barbería Tradicional" 
            className="w-48 md:w-56 h-auto"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide mb-3">
            Mad Men Barbería Tradicional
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light">
            Elige tu sede y reserva tu cita en segundos.
          </p>
        </div>

        {/* Location Blocks */}
        <div className="space-y-6">
          {locations.map((location, index) => (
            <div 
              key={index}
              className="bg-[#252525] border border-[#333] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#4a4a4a]"
            >
              {/* Location Name */}
              <h2 className="text-xl md:text-2xl font-light text-white text-center mb-2">
                {location.name}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm text-center mb-6">
                {location.address}
              </p>

              {/* Main Booking Button */}
              <a 
                href={location.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button 
                  className="w-full bg-[#5c6b4a] hover:bg-[#4d5a3d] text-white rounded-full py-6 text-base md:text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                >
                  Reservar
                </Button>
              </a>

              {/* Secondary Buttons */}
              <div className="flex gap-3 mt-4">
                <a 
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    variant="outline"
                    className="w-full border-[#444] bg-transparent text-gray-300 hover:bg-[#333] hover:text-white rounded-full py-3 text-sm font-light transition-all duration-300"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                </a>
                <a 
                  href={location.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    variant="outline"
                    className="w-full border-[#444] bg-transparent text-gray-300 hover:bg-[#333] hover:text-white rounded-full py-3 text-sm font-light transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <p className="text-center text-gray-500 text-xs md:text-sm mt-12 md:mt-16 font-light">
          Si tienes dudas con tu reserva, escríbenos por WhatsApp y te ayudamos.
        </p>
      </div>
    </div>
  );
};

export default Reservas;
