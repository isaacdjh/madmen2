
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: string;
}

interface ConversationState {
  phone: string;
  step: 'greeting' | 'location' | 'barber' | 'date' | 'time' | 'confirmation';
  selectedLocation?: string;
  selectedBarber?: string;
  selectedDate?: string;
  selectedTime?: string;
  customerName?: string;
}

const conversationStates = new Map<string, ConversationState>();

const locations = [
  { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú', number: '1' },
  { id: 'general-pardinas', name: 'Mad Men General Pardiñas', number: '2' }
];

const barbersByLocation = {
  'cristobal-bordiu': [
    { id: 'luis-bracho', name: 'Luis Bracho', number: '1' },
    { id: 'jesus-hernandez', name: 'Jesús Hernández', number: '2' },
    { id: 'luis-alfredo', name: 'Luis Alfredo', number: '3' },
    { id: 'dionys-bracho', name: 'Dionys Bracho', number: '4' }
  ],
  'general-pardinas': [
    { id: 'isaac-hernandez', name: 'Isaac Hernández', number: '1' },
    { id: 'carlos-lopez', name: 'Carlos López', number: '2' },
    { id: 'luis-urbinez', name: 'Luis Urbiñez', number: '3' },
    { id: 'randy-valdespino', name: 'Randy Valdespino', number: '4' }
  ]
};

async function sendWhatsAppMessage(to: string, message: string) {
  if (!whatsappToken) {
    console.error('WhatsApp token not configured');
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      }),
    });

    if (!response.ok) {
      console.error('Error sending WhatsApp message:', await response.text());
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

async function getAvailableTimes(location: string, barber: string, date: string) {
  // Obtener citas existentes para ese día
  const { data: appointments } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('location', location)
    .eq('barber', barber)
    .eq('appointment_date', date)
    .eq('status', 'confirmada');

  // Obtener horarios bloqueados
  const { data: blockedSlots } = await supabase
    .from('blocked_slots')
    .select('blocked_time')
    .eq('barber_id', barber)
    .eq('blocked_date', date);

  const bookedTimes = appointments?.map(apt => apt.appointment_time) || [];
  const blockedTimes = blockedSlots?.map(slot => slot.blocked_time) || [];
  const unavailableTimes = [...bookedTimes, ...blockedTimes];

  // Horarios disponibles (9:00 AM a 7:00 PM)
  const allTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  return allTimes.filter(time => !unavailableTimes.includes(time));
}

async function processWhatsAppMessage(message: WhatsAppMessage) {
  const { from, body } = message;
  let state = conversationStates.get(from);

  if (!state) {
    // Nueva conversación
    state = {
      phone: from,
      step: 'greeting'
    };
    conversationStates.set(from, state);
  }

  const messageText = body.toLowerCase().trim();

  switch (state.step) {
    case 'greeting':
      if (messageText.includes('cita') || messageText.includes('reserva') || messageText === 'hola') {
        state.step = 'location';
        await sendWhatsAppMessage(from, 
          `¡Hola! 👋 Bienvenido a Mad Men Barbería.\n\n` +
          `¿En qué ubicación te gustaría reservar tu cita?\n\n` +
          `1️⃣ Mad Men General Pardiñas\n` +
          `2️⃣ Mad Men Cristóbal Bordiú\n\n` +
          `Responde con el número de tu elección.`
        );
      } else {
        await sendWhatsAppMessage(from, 
          `¡Hola! Para reservar una cita, escribe "cita" o "hola" 😊`
        );
      }
      break;

    case 'location':
      if (messageText === '1' || messageText.includes('general') || messageText.includes('pardiñas')) {
        state.selectedLocation = 'general-pardinas';
        state.step = 'barber';
        const barbers = barbersByLocation['general-pardinas'];
        let message = `Perfecto! Has elegido General Pardiñas 📍\n\n¿Tienes algún barbero de preferencia?\n\n`;
        barbers.forEach(barber => {
          message += `${barber.number}️⃣ ${barber.name}\n`;
        });
        message += `5️⃣ Cualquier barbero disponible\n\nResponde con el número de tu elección.`;
        await sendWhatsAppMessage(from, message);
      } else if (messageText === '2' || messageText.includes('cristobal') || messageText.includes('bordiu')) {
        state.selectedLocation = 'cristobal-bordiu';
        state.step = 'barber';
        const barbers = barbersByLocation['cristobal-bordiu'];
        let message = `Perfecto! Has elegido Cristóbal Bordiú 📍\n\n¿Tienes algún barbero de preferencia?\n\n`;
        barbers.forEach(barber => {
          message += `${barber.number}️⃣ ${barber.name}\n`;
        });
        message += `5️⃣ Cualquier barbero disponible\n\nResponde con el número de tu elección.`;
        await sendWhatsAppMessage(from, message);
      } else {
        await sendWhatsAppMessage(from, 
          `Por favor selecciona una ubicación válida:\n1️⃣ General Pardiñas\n2️⃣ Cristóbal Bordiú`
        );
      }
      break;

    case 'barber':
      const barbers = barbersByLocation[state.selectedLocation!];
      const selectedBarberIndex = parseInt(messageText) - 1;
      
      if (selectedBarberIndex >= 0 && selectedBarberIndex < barbers.length) {
        state.selectedBarber = barbers[selectedBarberIndex].id;
        state.step = 'date';
        await sendWhatsAppMessage(from, 
          `Excelente! Has elegido a ${barbers[selectedBarberIndex].name} 👨‍💼\n\n` +
          `¿Para qué fecha quieres la cita?\n` +
          `Por favor escribe la fecha en formato DD/MM/YYYY (ejemplo: 25/12/2024)`
        );
      } else if (messageText === '5' || messageText.includes('cualquier')) {
        state.selectedBarber = 'any';
        state.step = 'date';
        await sendWhatsAppMessage(from, 
          `Perfect! Te asignaremos el barbero disponible 👨‍💼\n\n` +
          `¿Para qué fecha quieres la cita?\n` +
          `Por favor escribe la fecha en formato DD/MM/YYYY (ejemplo: 25/12/2024)`
        );
      } else {
        await sendWhatsAppMessage(from, 
          `Por favor selecciona un número válido del 1 al 5.`
        );
      }
      break;

    case 'date':
      // Validar formato de fecha DD/MM/YYYY
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const dateMatch = messageText.match(dateRegex);
      
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        const selectedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const today = new Date().toISOString().split('T')[0];
        
        if (selectedDate >= today) {
          state.selectedDate = selectedDate;
          state.step = 'time';
          
          // Si seleccionó "cualquier barbero", encontrar uno disponible
          let barberToCheck = state.selectedBarber;
          if (state.selectedBarber === 'any') {
            const availableBarbers = barbersByLocation[state.selectedLocation!];
            // Por simplicidad, tomar el primero. En producción podrías revisar disponibilidad de cada uno
            barberToCheck = availableBarbers[0].id;
            state.selectedBarber = barberToCheck;
          }
          
          const availableTimes = await getAvailableTimes(state.selectedLocation!, barberToCheck, selectedDate);
          
          if (availableTimes.length > 0) {
            let message = `Fecha seleccionada: ${day}/${month}/${year} 📅\n\nHorarios disponibles:\n\n`;
            availableTimes.forEach((time, index) => {
              message += `${index + 1}️⃣ ${time}\n`;
            });
            message += `\nResponde con el número del horario que prefieras.`;
            await sendWhatsAppMessage(from, message);
          } else {
            await sendWhatsAppMessage(from, 
              `Lo siento, no hay horarios disponibles para esa fecha. ` +
              `Por favor elige otra fecha en formato DD/MM/YYYY.`
            );
            state.step = 'date';
          }
        } else {
          await sendWhatsAppMessage(from, 
            `La fecha debe ser hoy o en el futuro. Por favor elige una fecha válida en formato DD/MM/YYYY.`
          );
        }
      } else {
        await sendWhatsAppMessage(from, 
          `Por favor escribe la fecha en formato DD/MM/YYYY (ejemplo: 25/12/2024).`
        );
      }
      break;

    case 'time':
      const availableTimes = await getAvailableTimes(state.selectedLocation!, state.selectedBarber!, state.selectedDate!);
      const selectedTimeIndex = parseInt(messageText) - 1;
      
      if (selectedTimeIndex >= 0 && selectedTimeIndex < availableTimes.length) {
        state.selectedTime = availableTimes[selectedTimeIndex];
        state.step = 'confirmation';
        
        const locationName = locations.find(loc => loc.id === state.selectedLocation)?.name;
        const barberName = barbersByLocation[state.selectedLocation!].find(b => b.id === state.selectedBarber)?.name;
        
        await sendWhatsAppMessage(from, 
          `¡Perfecto! 🎉\n\n` +
          `Para confirmar tu cita, por favor dime tu nombre completo:\n\n` +
          `📍 Ubicación: ${locationName}\n` +
          `👨‍💼 Barbero: ${barberName}\n` +
          `📅 Fecha: ${state.selectedDate}\n` +
          `🕐 Hora: ${state.selectedTime}\n\n` +
          `Escribe tu nombre para confirmar la reserva.`
        );
      } else {
        await sendWhatsAppMessage(from, 
          `Por favor selecciona un número válido de los horarios disponibles.`
        );
      }
      break;

    case 'confirmation':
      if (messageText.length > 2) {
        state.customerName = body.trim();
        
        // Crear la cita en la base de datos
        try {
          const { data: client } = await supabase
            .rpc('find_or_create_client', {
              p_name: state.customerName,
              p_phone: state.phone,
              p_email: `${state.phone}@whatsapp.temp`
            });

          const { error } = await supabase
            .from('appointments')
            .insert({
              client_id: client,
              location: state.selectedLocation,
              service: 'classic-cut', // Servicio por defecto
              barber: state.selectedBarber,
              appointment_date: state.selectedDate,
              appointment_time: state.selectedTime,
              price: 45,
              status: 'confirmada',
              customer_name: state.customerName,
              customer_phone: state.phone,
              customer_email: `${state.phone}@whatsapp.temp`
            });

          if (!error) {
            const locationName = locations.find(loc => loc.id === state.selectedLocation)?.name;
            const barberName = barbersByLocation[state.selectedLocation!].find(b => b.id === state.selectedBarber)?.name;
            
            await sendWhatsAppMessage(from, 
              `¡Cita confirmada exitosamente! ✅\n\n` +
              `👤 Cliente: ${state.customerName}\n` +
              `📍 Ubicación: ${locationName}\n` +
              `👨‍💼 Barbero: ${barberName}\n` +
              `📅 Fecha: ${state.selectedDate}\n` +
              `🕐 Hora: ${state.selectedTime}\n` +
              `💰 Servicio: Corte Clásico (€45)\n\n` +
              `¡Te esperamos! Si necesitas cancelar o reprogramar, contáctanos con anticipación.\n\n` +
              `Gracias por elegir Mad Men Barbería! 💈`
            );
            
            // Limpiar estado de conversación
            conversationStates.delete(from);
          } else {
            await sendWhatsAppMessage(from, 
              `Hubo un error al crear tu cita. Por favor intenta nuevamente o contáctanos directamente.`
            );
          }
        } catch (error) {
          console.error('Error creating appointment:', error);
          await sendWhatsAppMessage(from, 
            `Hubo un error al procesar tu cita. Por favor intenta nuevamente.`
          );
        }
      } else {
        await sendWhatsAppMessage(from, 
          `Por favor proporciona tu nombre completo para confirmar la cita.`
        );
      }
      break;
  }

  // Actualizar estado
  conversationStates.set(from, state);
}

const handler = async (req: Request): Promise<Response> => {
  console.log('WhatsApp webhook called:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verificación de webhook (solo para GET)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully!');
      return new Response(challenge, { status: 200 });
    } else {
      console.log('Webhook verification failed');
      return new Response('Forbidden', { status: 403 });
    }
  }

  // Procesar mensajes entrantes (POST)
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Received webhook data:', JSON.stringify(body, null, 2));

      // Procesar mensajes de WhatsApp
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const messages = body.entry[0].changes[0].value.messages;
        
        for (const message of messages) {
          if (message.type === 'text') {
            const whatsappMessage: WhatsAppMessage = {
              from: message.from,
              body: message.text.body,
              timestamp: message.timestamp
            };
            
            await processWhatsAppMessage(whatsappMessage);
          }
        }
      }

      return new Response('OK', { 
        status: 200,
        headers: corsHeaders 
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders 
      });
    }
  }

  return new Response('Method not allowed', { 
    status: 405,
    headers: corsHeaders 
  });
};

serve(handler);
