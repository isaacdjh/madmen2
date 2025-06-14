
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
      address: 'Calle Cristóbal Bordiú, 42, 28003 Madrid',
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const generateCalendarLinks = (appointment: AppointmentEmailRequest, locationDetails: any) => {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora después
  
  const formatForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const title = `Cita en Mad Men - ${appointment.service}`;
  const description = `Cita en Mad Men con ${appointment.barber}. Servicio: ${appointment.service}. Precio: ${appointment.price}€`;
  const location = `${locationDetails.name}, ${locationDetails.address}`;

  // Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatForCalendar(startDate)}/${formatForCalendar(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // iCal (Apple Calendar)
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
    const appointment: AppointmentEmailRequest = await req.json();
    const locationDetails = getLocationDetails(appointment.location);
    const { googleUrl, icalContent } = generateCalendarLinks(appointment, locationDetails);
    const formattedDate = formatDate(appointment.date);

    const cancelUrl = `https://madmenbarberia.com/cancel-appointment/${appointment.appointmentId}`;

    const emailResponse = await resend.emails.send({
      from: "Mad Men Barbershop <onboarding@resend.dev>", // Temporal: usando dominio verificado de Resend
      to: [appointment.clientEmail],
      subject: "✅ Cita confirmada en Mad Men",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cita Confirmada - Mad Men</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Mad Men Barbershop</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Tu cita ha sido confirmada</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">¡Hola ${appointment.clientName}!</h2>
              <p style="font-size: 16px; margin-bottom: 25px;">Tu cita ha sido confirmada exitosamente. Aquí tienes todos los detalles:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1a1a1a;">📅 Fecha:</td>
                    <td style="padding: 8px 0;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1a1a1a;">🕐 Hora:</td>
                    <td style="padding: 8px 0;">${appointment.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1a1a1a;">✂️ Servicio:</td>
                    <td style="padding: 8px 0;">${appointment.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1a1a1a;">👨‍💼 Barbero:</td>
                    <td style="padding: 8px 0;">${appointment.barber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1a1a1a;">📍 Centro:</td>
                    <td style="padding: 8px 0;">${locationDetails.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1a1a1a;">💰 Precio:</td>
                    <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #d4af37;">${appointment.price}€</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin-bottom: 25px;">
                <h3 style="margin-top: 0; color: #1976D2;">📍 Ubicación</h3>
                <p style="margin: 5px 0;"><strong>${locationDetails.name}</strong></p>
                <p style="margin: 5px 0;">${locationDetails.address}</p>
                <p style="margin: 5px 0;">📞 ${locationDetails.phone}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <h3 style="color: #1a1a1a; margin-bottom: 15px;">📅 Agregar a tu Calendario</h3>
                <div style="display: inline-block; margin: 0 10px;">
                  <a href="${googleUrl}" target="_blank" style="display: inline-block; background: #4285f4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">📅 Google Calendar</a>
                </div>
                <div style="display: inline-block; margin: 0 10px;">
                  <a href="data:text/calendar;charset=utf8,${encodeURIComponent(icalContent)}" download="cita-madmen.ics" style="display: inline-block; background: #333; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">🍎 Apple Calendar</a>
                </div>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${cancelUrl}" style="display: inline-block; background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">❌ Cancelar Cita</a>
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 25px;">
                <h4 style="margin-top: 0; color: #856404;">⏰ Recordatorio</h4>
                <p style="margin: 5px 0; color: #856404;">Te recomendamos llegar 10 minutos antes de tu cita. Si necesitas cancelar o reprogramar, por favor hazlo con al menos 2 horas de anticipación.</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>¿Tienes alguna pregunta? Contáctanos:</p>
              <p>📞 ${locationDetails.phone} | ✉️ info@madmenbarberia.com</p>
              <p style="margin-top: 20px;">
                <strong>Mad Men Barbershop</strong><br>
                El arte de ser un caballero
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email de confirmación enviado:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error enviando email de confirmación:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
