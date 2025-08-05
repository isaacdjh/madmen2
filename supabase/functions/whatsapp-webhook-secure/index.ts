import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  from: string;
  text: string;
  timestamp: string;
}

interface ConversationState {
  step: 'greeting' | 'location' | 'barber' | 'date' | 'time' | 'confirmation' | 'completed';
  location?: string;
  barber?: string;
  date?: string;
  time?: string;
  customerName?: string;
  customerPhone?: string;
}

// Store conversation states in memory (in production, use Redis or database)
const conversationStates = new Map<string, ConversationState>();

const locations = [
  { id: 'cristobal-bordiu', name: 'Cristóbal Bordiú', address: 'C/Cristóbal Bordiú 22, 28003 Madrid' },
  { id: 'salamanca', name: 'Salamanca', address: 'C/Jorge Juan 25, 28001 Madrid' }
];

const barbersByLocation = {
  'cristobal-bordiu': ['Carlos', 'Miguel', 'Roberto'],
  'salamanca': ['Antonio', 'David', 'Fernando']
};

const sendWhatsAppMessage = async (to: string, message: string): Promise<void> => {
  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
  
  if (!accessToken || !phoneNumberId) {
    console.error('Missing WhatsApp credentials in environment');
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
      const error = await response.text();
      console.error('WhatsApp API error:', error);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};

const getAvailableTimes = async (location: string, barber: string, date: string): Promise<string[]> => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('location', location)
      .eq('barber', barber)
      .eq('appointment_date', date)
      .eq('status', 'confirmada');

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    const bookedTimes = appointments?.map(app => app.appointment_time) || [];
    const allTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
    
    return allTimes.filter(time => !bookedTimes.includes(time));
  } catch (error) {
    console.error('Error fetching available times:', error);
    return [];
  }
};

const processWhatsAppMessage = async (message: WhatsAppMessage): Promise<void> => {
  const phoneNumber = message.from;
  const text = message.text.toLowerCase().trim();
  
  let state = conversationStates.get(phoneNumber) || { step: 'greeting' };
  
  console.log(`Processing message from ${phoneNumber}: ${text}, current step: ${state.step}`);

  try {
    switch (state.step) {
      case 'greeting':
        if (text.includes('hola') || text.includes('reserva') || text.includes('cita')) {
          await sendWhatsAppMessage(phoneNumber, 
            '¡Hola! Bienvenido a Mad Men Barbería 💈\n\n' +
            'Te ayudo a reservar tu cita. ¿En qué ubicación prefieres?\n\n' +
            '1️⃣ Cristóbal Bordiú (Chamberí)\n' +
            '2️⃣ Salamanca (Jorge Juan)\n\n' +
            'Responde con 1 o 2');
          state.step = 'location';
        } else {
          await sendWhatsAppMessage(phoneNumber, 
            '¡Hola! Para reservar una cita, escribe "reserva" o "cita" 📱');
        }
        break;

      case 'location':
        if (text === '1' || text.includes('bordiu') || text.includes('chamberi')) {
          state.location = 'cristobal-bordiu';
          await sendWhatsAppMessage(phoneNumber, 
            '📍 Perfecto! Cristóbal Bordiú seleccionado.\n\n' +
            '¿Con qué barbero prefieres?\n\n' +
            '1️⃣ Carlos\n2️⃣ Miguel\n3️⃣ Roberto\n\n' +
            'Responde con el número o nombre');
          state.step = 'barber';
        } else if (text === '2' || text.includes('salamanca') || text.includes('jorge')) {
          state.location = 'salamanca';
          await sendWhatsAppMessage(phoneNumber, 
            '📍 Perfecto! Salamanca seleccionado.\n\n' +
            '¿Con qué barbero prefieres?\n\n' +
            '1️⃣ Antonio\n2️⃣ David\n3️⃣ Fernando\n\n' +
            'Responde con el número o nombre');
          state.step = 'barber';
        } else {
          await sendWhatsAppMessage(phoneNumber, 
            'Por favor, elige una ubicación válida:\n1️⃣ Cristóbal Bordiú\n2️⃣ Salamanca');
        }
        break;

      case 'barber':
        const locationBarbers = barbersByLocation[state.location as keyof typeof barbersByLocation];
        let selectedBarber = '';
        
        if (text === '1') selectedBarber = locationBarbers[0];
        else if (text === '2') selectedBarber = locationBarbers[1];
        else if (text === '3') selectedBarber = locationBarbers[2];
        else {
          for (const barber of locationBarbers) {
            if (text.includes(barber.toLowerCase())) {
              selectedBarber = barber;
              break;
            }
          }
        }

        if (selectedBarber) {
          state.barber = selectedBarber;
          await sendWhatsAppMessage(phoneNumber, 
            `👨‍💼 Perfecto! ${selectedBarber} seleccionado.\n\n` +
            '📅 ¿Qué día prefieres? (formato DD/MM/YYYY)\n' +
            'Ejemplo: 25/12/2024');
          state.step = 'date';
        } else {
          const barberList = locationBarbers.map((b, i) => `${i + 1}️⃣ ${b}`).join('\n');
          await sendWhatsAppMessage(phoneNumber, 
            `Por favor, elige un barbero válido:\n${barberList}`);
        }
        break;

      case 'date':
        const dateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
        const dateMatch = text.match(dateRegex);
        
        if (dateMatch) {
          const [, day, month, year] = dateMatch;
          const selectedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          const requestedDate = new Date(selectedDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (requestedDate >= today) {
            state.date = selectedDate;
            const availableTimes = await getAvailableTimes(state.location!, state.barber!, selectedDate);
            
            if (availableTimes.length > 0) {
              const timesList = availableTimes.map((time, i) => `${i + 1}️⃣ ${time}`).join('\n');
              await sendWhatsAppMessage(phoneNumber, 
                `📅 Fecha ${day}/${month}/${year} disponible!\n\n` +
                `⏰ Horarios disponibles con ${state.barber}:\n\n${timesList}\n\n` +
                'Responde con el número del horario que prefieres');
              state.step = 'time';
            } else {
              await sendWhatsAppMessage(phoneNumber, 
                `❌ Lo siento, no hay horarios disponibles para ${day}/${month}/${year} con ${state.barber}.\n\n` +
                'Por favor, elige otra fecha.');
            }
          } else {
            await sendWhatsAppMessage(phoneNumber, 
              '❌ La fecha debe ser hoy o posterior. Por favor, elige otra fecha.');
          }
        } else {
          await sendWhatsAppMessage(phoneNumber, 
            '❌ Formato de fecha incorrecto. Usa DD/MM/YYYY\nEjemplo: 25/12/2024');
        }
        break;

      case 'time':
        const availableTimes = await getAvailableTimes(state.location!, state.barber!, state.date!);
        const timeIndex = parseInt(text) - 1;
        
        if (timeIndex >= 0 && timeIndex < availableTimes.length) {
          state.time = availableTimes[timeIndex];
          await sendWhatsAppMessage(phoneNumber, 
            '✅ ¡Perfecto! Últimos datos para confirmar tu cita:\n\n' +
            '👤 ¿Cuál es tu nombre completo?');
          state.step = 'confirmation';
        } else {
          const timesList = availableTimes.map((time, i) => `${i + 1}️⃣ ${time}`).join('\n');
          await sendWhatsAppMessage(phoneNumber, 
            `Por favor, elige un horario válido:\n${timesList}`);
        }
        break;

      case 'confirmation':
        if (!state.customerName) {
          state.customerName = text;
          state.customerPhone = phoneNumber;
          
          // Create appointment
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
              customer_name: state.customerName,
              customer_phone: state.customerPhone,
              appointment_date: state.date,
              appointment_time: state.time,
              location: state.location,
              barber: state.barber,
              service: 'Corte de pelo',
              status: 'confirmada'
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating appointment:', error);
            await sendWhatsAppMessage(phoneNumber, 
              '❌ Error al crear la cita. Por favor, intenta nuevamente.');
          } else {
            const locationName = locations.find(l => l.id === state.location)?.name;
            const [day, month, year] = state.date!.split('-').reverse();
            
            await sendWhatsAppMessage(phoneNumber, 
              `✅ ¡Cita confirmada!\n\n` +
              `👤 Cliente: ${state.customerName}\n` +
              `💈 Barbero: ${state.barber}\n` +
              `📍 Ubicación: ${locationName}\n` +
              `📅 Fecha: ${day}/${month}/${year}\n` +
              `⏰ Hora: ${state.time}\n\n` +
              `🎫 Número de cita: ${appointment.id}\n\n` +
              '¡Te esperamos en Mad Men Barbería! 💈\n\n' +
              'Para cancelar, responde CANCELAR seguido del número de cita.');
            
            state.step = 'completed';
          }
        }
        break;

      case 'completed':
        if (text.includes('cancelar')) {
          await sendWhatsAppMessage(phoneNumber, 
            'Para cancelar tu cita, llama al +34 916 832 731 o escribe "reserva" para hacer una nueva cita.');
        } else {
          await sendWhatsAppMessage(phoneNumber, 
            'Tu cita ya está confirmada. Para una nueva reserva, escribe "reserva".\n' +
            'Para cancelar, llama al +34 916 832 731');
        }
        break;
    }
    
    conversationStates.set(phoneNumber, state);
    
  } catch (error) {
    console.error('Error processing message:', error);
    await sendWhatsAppMessage(phoneNumber, 
      'Lo siento, ocurrió un error. Por favor, intenta nuevamente o llama al +34 916 832 731');
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log(`${req.method} ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    // Webhook verification
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    
    const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully!');
      return new Response(challenge, { 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      });
    } else {
      console.log('Webhook verification failed');
      return new Response('Verification failed', { 
        status: 403,
        headers: corsHeaders 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Webhook payload:', JSON.stringify(body, null, 2));

      if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const messages = change.value?.messages || [];
              
              for (const message of messages) {
                if (message.type === 'text') {
                  const whatsappMessage: WhatsAppMessage = {
                    from: message.from,
                    text: message.text.body,
                    timestamp: message.timestamp
                  };
                  
                  await processWhatsAppMessage(whatsappMessage);
                }
              }
            }
          }
        }
      }

      return new Response('OK', { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders 
      });
    }
  }

  return new Response('Method Not Allowed', { 
    status: 405,
    headers: corsHeaders 
  });
};

serve(handler);