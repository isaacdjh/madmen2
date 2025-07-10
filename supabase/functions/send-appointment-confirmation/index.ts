
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  clientName: string;
  clientEmail: string;
  service: string;
  barber: string;
  location: string;
  date: string;
  time: string;
  price: number;
  appointmentId: string;
}

const getLocationDetails = (locationId: string) => {
  const locations = {
    'cristobal-bordiu': {
      name: 'Mad Men Cristóbal Bordiú',
      address: 'Calle Cristóbal Bordiú, 29, 28003 Madrid',
      phone: '+34 914 41 23 45'
    },
    'general-pardinas': {
      name: 'Mad Men General Pardiñas',
      address: 'Calle General Pardiñas, 56, 28001 Madrid',
      phone: '+34 915 67 89 01'
    }
  };
  return locations[locationId as keyof typeof locations] || locations['cristobal-bordiu'];
};

const getBarberName = (barberId: string) => {
  const barbers = {
    '98ccb6df-6112-45a5-b4ff-32c3245c7a32': 'Luis'
  };
  return barbers[barberId as keyof typeof barbers] || 'Barbero';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Función para codificar texto UTF-8 a base64 de forma segura
const encodeToBase64 = (text: string): string => {
  // Convertir string a UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  
  // Convertir bytes a string binario
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  // Codificar a base64
  return btoa(binary);
};

const generateCalendarLinks = (appointment: AppointmentEmailRequest, locationDetails: any, barberName: string) => {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora después
  
  const formatForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const title = `Cita en Mad Men - ${appointment.service}`;
  const description = `Cita en Mad Men con ${barberName}. Servicio: ${appointment.service}. Precio: ${appointment.price}€`;
  const location = `${locationDetails.name}, ${locationDetails.address}`;

  // Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatForCalendar(startDate)}/${formatForCalendar(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // iCal (Apple Calendar) - contenido sin caracteres especiales problemáticos
  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mad Men//ES
BEGIN:VEVENT
UID:${appointment.appointmentId}@madmenbarberia.com
DTSTAMP:${formatForCalendar(new Date())}
DTSTART:${formatForCalendar(startDate)}
DTEND:${formatForCalendar(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  return { googleUrl, icalContent };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Inicio del proceso de envío de email ===");
    
    const appointment: AppointmentEmailRequest = await req.json();
    console.log("Datos de la cita recibidos:", JSON.stringify(appointment, null, 2));
    
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("API Key disponible:", apiKey ? "SÍ" : "NO");
    console.log("Longitud de API Key:", apiKey ? apiKey.length : 0);
    
    const locationDetails = getLocationDetails(appointment.location);
    const barberName = getBarberName(appointment.barber);
    const { googleUrl, icalContent } = generateCalendarLinks(appointment, locationDetails, barberName);
    const formattedDate = formatDate(appointment.date);

    // URL de cancelación con el dominio correcto
    const cancelUrl = `https://7c7f3e19-545f-4dc1-b55b-6d7eb4ffbe30.lovableproject.com/cancel/${appointment.appointmentId}`;

    console.log("=== Preparando envío de email ===");
    console.log("De:", "Mad Men Barbershop <noreply@madmenbarberia.com>");
    console.log("Para:", appointment.clientEmail);
    console.log("Asunto:", "✂️ Tu cita está confirmada - Mad Men Barbershop");
    console.log("Barbero:", barberName);
    console.log("URL de cancelación:", cancelUrl);

    const emailResponse = await resend.emails.send({
      from: "Mad Men Barbershop <noreply@madmenbarberia.com>",
      to: [appointment.clientEmail],
      subject: "✂️ Tu cita está confirmada - Mad Men Barbershop",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cita Confirmada - Mad Men Barbershop</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              color: #2c2c2c;
              background-color: #f8f9fa;
            }
            
            .email-container {
              max-width: 650px;
              margin: 0 auto;
              background: #ffffff;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              border-radius: 16px;
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: url('https://7c7f3e19-545f-4dc1-b55b-6d7eb4ffbe30.lovableproject.com/lovable-uploads/4427d6e6-852a-4295-9f0f-6668b98f86e9.png');
              background-size: cover;
              background-position: center;
              opacity: 0.3;
              z-index: 1;
            }
            
            .header-content {
              position: relative;
              z-index: 2;
            }
            
            .logo {
              font-family: 'Playfair Display', serif;
              font-size: 32px;
              font-weight: 700;
              color: #d4af37;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .tagline {
              color: #ffffff;
              font-size: 16px;
              font-weight: 300;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            
            .confirmation-badge {
              background: linear-gradient(135deg, #d4af37, #f4e76f);
              color: #1a1a1a;
              padding: 12px 24px;
              border-radius: 50px;
              font-weight: 600;
              font-size: 18px;
              margin: 30px auto 0;
              display: inline-block;
              box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
            }
            
            .main-content {
              padding: 40px 30px;
            }
            
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 20px;
              text-align: center;
            }
            
            .intro-text {
              font-size: 16px;
              color: #666;
              text-align: center;
              margin-bottom: 40px;
              line-height: 1.8;
            }
            
            .appointment-card {
              background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
              border: 2px solid #e9ecef;
              border-radius: 16px;
              padding: 30px;
              margin-bottom: 30px;
              box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            }
            
            .appointment-title {
              font-size: 20px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 25px;
              text-align: center;
              position: relative;
            }
            
            .appointment-title::after {
              content: '';
              width: 60px;
              height: 3px;
              background: linear-gradient(90deg, #d4af37, #f4e76f);
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              border-radius: 2px;
            }
            
            .appointment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .appointment-item {
              display: flex;
              align-items: center;
              padding: 15px;
              background: rgba(212, 175, 55, 0.05);
              border-radius: 12px;
              border-left: 4px solid #d4af37;
            }
            
            .appointment-icon {
              font-size: 20px;
              margin-right: 12px;
              width: 24px;
              text-align: center;
            }
            
            .appointment-label {
              font-weight: 600;
              color: #1a1a1a;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .appointment-value {
              color: #333;
              font-size: 16px;
              margin-top: 2px;
            }
            
            .price-highlight {
              grid-column: 1 / -1;
              background: linear-gradient(135deg, #d4af37, #f4e76f);
              color: #1a1a1a;
              text-align: center;
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 8px 16px rgba(212, 175, 55, 0.2);
            }
            
            .price-highlight .appointment-value {
              font-size: 28px;
              font-weight: 700;
              color: #1a1a1a;
            }
            
            .location-section {
              background: #f8f9fa;
              border-radius: 16px;
              padding: 25px;
              margin: 30px 0;
              border-left: 6px solid #d4af37;
            }
            
            .location-title {
              font-size: 18px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
            }
            
            .location-icon {
              margin-right: 10px;
              font-size: 20px;
              color: #d4af37;
            }
            
            .location-details {
              color: #555;
              line-height: 1.8;
            }
            
            .location-details strong {
              color: #1a1a1a;
              display: block;
              margin-bottom: 5px;
            }
            
            .actions-section {
              text-align: center;
              margin: 40px 0;
            }
            
            .actions-title {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 20px;
            }
            
            .button-group {
              display: flex;
              justify-content: center;
              gap: 15px;
              flex-wrap: wrap;
              margin-bottom: 30px;
            }
            
            .btn {
              display: inline-block;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .btn-calendar {
              background: linear-gradient(135deg, #4285f4, #34a853);
              color: white;
            }
            
            .btn-calendar:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(66, 133, 244, 0.3);
            }
            
            .btn-apple {
              background: linear-gradient(135deg, #1a1a1a, #333);
              color: white;
            }
            
            .btn-apple:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(26, 26, 26, 0.3);
            }
            
            .btn-cancel {
              background: linear-gradient(135deg, #dc3545, #c82333);
              color: white;
              margin-top: 15px;
            }
            
            .btn-cancel:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
            }
            
            .reminder-section {
              background: linear-gradient(135deg, #fff3cd, #ffeaa7);
              border-left: 6px solid #ffc107;
              padding: 25px;
              border-radius: 12px;
              margin: 30px 0;
            }
            
            .reminder-title {
              font-size: 16px;
              font-weight: 700;
              color: #856404;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
            }
            
            .reminder-text {
              color: #856404;
              font-size: 14px;
              line-height: 1.6;
            }
            
            .footer {
              background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
              color: #ffffff;
              padding: 40px 30px;
              text-align: center;
            }
            
            .footer-logo {
              font-family: 'Playfair Display', serif;
              font-size: 24px;
              font-weight: 700;
              color: #d4af37;
              margin-bottom: 15px;
            }
            
            .footer-tagline {
              font-size: 14px;
              color: #cccccc;
              margin-bottom: 20px;
              font-style: italic;
            }
            
            .footer-contact {
              font-size: 14px;
              color: #ffffff;
              line-height: 1.8;
            }
            
            .footer-contact a {
              color: #d4af37;
              text-decoration: none;
            }
            
            .social-links {
              margin-top: 20px;
            }
            
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              padding: 8px;
              background: rgba(212, 175, 55, 0.1);
              border-radius: 50%;
              color: #d4af37;
              text-decoration: none;
              font-size: 16px;
              transition: all 0.3s ease;
            }
            
            .social-links a:hover {
              background: #d4af37;
              color: #1a1a1a;
              transform: translateY(-2px);
            }
            
            @media (max-width: 600px) {
              .email-container {
                margin: 10px;
                border-radius: 12px;
              }
              
              .header {
                padding: 30px 20px;
              }
              
              .main-content {
                padding: 30px 20px;
              }
              
              .appointment-grid {
                grid-template-columns: 1fr;
                gap: 15px;
              }
              
              .button-group {
                flex-direction: column;
                align-items: center;
              }
              
              .btn {
                width: 100%;
                max-width: 280px;
              }
              
              .logo {
                font-size: 28px;
              }
              
              .greeting {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header Section -->
            <div class="header">
              <div class="header-content">
                <div class="logo">MAD MEN</div>
                <div class="tagline">Barbershop Tradicional</div>
                <div class="confirmation-badge">✂️ CITA CONFIRMADA</div>
              </div>
            </div>
            
            <!-- Main Content -->
            <div class="main-content">
              <h1 class="greeting">¡Hola ${appointment.clientName}!</h1>
              <p class="intro-text">
                Tu cita ha sido confirmada exitosamente. Nos complace recibirte en Mad Men Barbershop, 
                donde la tradición y el estilo se encuentran para ofrecerte la mejor experiencia.
              </p>
              
              <!-- Appointment Details Card -->
              <div class="appointment-card">
                <h2 class="appointment-title">Detalles de tu Cita</h2>
                <div class="appointment-grid">
                  <div class="appointment-item">
                    <div class="appointment-icon">📅</div>
                    <div>
                      <div class="appointment-label">Fecha</div>
                      <div class="appointment-value">${formattedDate}</div>
                    </div>
                  </div>
                  
                  <div class="appointment-item">
                    <div class="appointment-icon">🕐</div>
                    <div>
                      <div class="appointment-label">Hora</div>
                      <div class="appointment-value">${appointment.time}</div>
                    </div>
                  </div>
                  
                  <div class="appointment-item">
                    <div class="appointment-icon">✂️</div>
                    <div>
                      <div class="appointment-label">Servicio</div>
                      <div class="appointment-value">${appointment.service}</div>
                    </div>
                  </div>
                  
                  <div class="appointment-item">
                    <div class="appointment-icon">👨‍💼</div>
                    <div>
                      <div class="appointment-label">Barbero</div>
                      <div class="appointment-value">${barberName}</div>
                    </div>
                  </div>
                  
                  <div class="appointment-item price-highlight">
                    <div>
                      <div class="appointment-label">Precio del Servicio</div>
                      <div class="appointment-value">${appointment.price}€</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Location Section -->
              <div class="location-section">
                <h3 class="location-title">
                  <span class="location-icon">📍</span>
                  Ubicación
                </h3>
                <div class="location-details">
                  <strong>${locationDetails.name}</strong>
                  ${locationDetails.address}<br>
                  📞 ${locationDetails.phone}
                </div>
              </div>
              
              <!-- Actions Section -->
              <div class="actions-section">
                <h3 class="actions-title">Agregar a tu Calendario</h3>
                <div class="button-group">
                  <a href="${googleUrl}" target="_blank" class="btn btn-calendar">
                    📅 Google Calendar
                  </a>
                  <a href="data:text/calendar;charset=utf-8;base64,${encodeToBase64(icalContent)}" download="cita-madmen-${appointment.appointmentId}.ics" class="btn btn-apple">
                    🍎 Apple Calendar
                  </a>
                </div>
                
                <a href="${cancelUrl}" class="btn btn-cancel">
                  ❌ Cancelar Cita
                </a>
              </div>
              
              <!-- Reminder Section -->
              <div class="reminder-section">
                <h4 class="reminder-title">⏰ Recordatorio Importante</h4>
                <div class="reminder-text">
                  Te recomendamos llegar <strong>10 minutos antes</strong> de tu cita para una experiencia más relajada. 
                  Si necesitas cancelar o reprogramar, por favor hazlo con al menos <strong>2 horas de anticipación</strong>.
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-logo">MAD MEN</div>
              <div class="footer-tagline">"El arte de ser un caballero"</div>
              <div class="footer-contact">
                📞 ${locationDetails.phone}<br>
                ✉️ <a href="mailto:info@madmenbarberia.com">info@madmenbarberia.com</a><br>
                🌐 <a href="https://madmenbarberia.com">www.madmenbarberia.com</a>
              </div>
              <div class="social-links">
                <a href="#" title="Instagram">📷</a>
                <a href="#" title="Facebook">📘</a>
                <a href="#" title="WhatsApp">💬</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("=== Respuesta de Resend ===");
    console.log("Estado:", emailResponse.error ? "ERROR" : "ÉXITO");
    console.log("Datos completos:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("Error específico:", emailResponse.error);
      throw new Error(`Error de Resend: ${emailResponse.error.message || 'Error desconocido'}`);
    }

    console.log("Email enviado exitosamente. ID:", emailResponse.data?.id);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("=== ERROR EN EL ENVÍO DE EMAIL ===");
    console.error("Tipo de error:", typeof error);
    console.error("Mensaje de error:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("Error completo:", JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Revisa los logs para más información"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
