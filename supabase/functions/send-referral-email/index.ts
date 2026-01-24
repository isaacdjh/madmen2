import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralEmailRequest {
  referrerName: string;
  referrerEmail?: string;
  friendEmail: string;
  friendName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referrerName, referrerEmail, friendEmail, friendName }: ReferralEmailRequest = await req.json();

    if (!referrerName || !friendEmail) {
      throw new Error("Faltan campos obligatorios");
    }

    // Email al amigo invitado
    const friendEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; }
    .header { background: linear-gradient(135deg, #2d5016 0%, #1a3009 100%); padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; color: #ffffff; }
    .header p { margin: 10px 0 0; color: #a3d977; font-size: 16px; }
    .content { padding: 40px 30px; }
    .gift-box { background: linear-gradient(135deg, #2d5016 0%, #1a3009 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0; }
    .gift-box h2 { color: #ffffff; margin: 0 0 10px; font-size: 24px; }
    .gift-box p { color: #a3d977; margin: 0; font-size: 18px; }
    .cta-button { display: inline-block; background: #4a7c23; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .cta-button:hover { background: #3d6a1c; }
    .note { background: #2a2a2a; border-left: 4px solid #4a7c23; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .note p { margin: 0; color: #cccccc; font-size: 14px; }
    .note strong { color: #a3d977; }
    .footer { padding: 30px; text-align: center; border-top: 1px solid #333; }
    .footer p { color: #888; font-size: 12px; margin: 5px 0; }
    .locations { display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap; gap: 20px; }
    .location { text-align: center; flex: 1; min-width: 200px; }
    .location h4 { color: #4a7c23; margin: 0 0 5px; }
    .location p { color: #888; font-size: 13px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💈 MAD MEN BARBERÍA</h1>
      <p>La Experiencia Premium de Madrid</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; margin-bottom: 10px;">Hola ${friendName},</p>
      
      <p style="color: #cccccc; line-height: 1.6;">
        Tu amigo <strong style="color: #4a7c23;">${referrerName}</strong> quiere que vivas la experiencia Mad Men.
      </p>

      <div class="gift-box">
        <h2>🎁 LIMPIEZA FACIAL GRATIS</h2>
        <p>En tu primer servicio con nosotros</p>
      </div>

      <p style="color: #cccccc; text-align: center;">
        Reserva tu cita ahora y disfruta de una limpieza facial de cortesía valorada en 15€
      </p>

      <div style="text-align: center;">
        <a href="https://madmen2.lovable.app" class="cta-button">RESERVAR AHORA</a>
      </div>

      <div class="note">
        <p><strong>Importante:</strong> Al reservar, escribe en el campo de notas: <strong>"Vengo de parte de ${referrerName}"</strong></p>
      </div>

      <div class="locations">
        <div class="location">
          <h4>Mad Men Salamanca</h4>
          <p>C/ Cristóbal Bordiú, 55</p>
          <p>Tel: 640 058 000</p>
        </div>
        <div class="location">
          <h4>Mad Men Retiro</h4>
          <p>C/ General Pardiñas, 56</p>
          <p>Tel: 623 158 565</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Mad Men Barbería Madrid</p>
      <p>La barbería premium donde el estilo clásico se encuentra con lo contemporáneo</p>
      <p style="color: #4a7c23;">@madmenmadrid</p>
    </div>
  </div>
</body>
</html>
    `;

    // Enviar email al amigo
    const friendResponse = await resend.emails.send({
      from: "Mad Men Barbershop <noreply@madmenbarberia.com>",
      to: [friendEmail],
      subject: `${referrerName} te invita a Mad Men Barbería 💈 ¡Limpieza facial GRATIS!`,
      html: friendEmailHtml,
    });

    console.log("Email enviado al amigo:", friendResponse);

    // Email de notificación al negocio
    const notificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .info { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info p { margin: 5px 0; }
    .label { font-weight: bold; color: #333; }
  </style>
</head>
<body>
  <h2>🎯 Nueva Invitación de Referido</h2>
  
  <div class="info">
    <p><span class="label">Cliente que invita:</span> ${referrerName}</p>
    <p><span class="label">Email del cliente:</span> ${referrerEmail || 'No proporcionado'}</p>
    <p><span class="label">Amigo invitado:</span> ${friendName}</p>
    <p><span class="label">Email del amigo:</span> ${friendEmail}</p>
    <p><span class="label">Fecha:</span> ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
  </div>

  <p><strong>Recordatorio:</strong></p>
  <ul>
    <li>El amigo recibirá una limpieza facial gratis en su primera visita</li>
    <li>${referrerName} debe recibir su premio (cera STMNT o facial) en su próxima visita</li>
  </ul>
</body>
</html>
    `;

    await resend.emails.send({
      from: "Mad Men Barbershop <noreply@madmenbarberia.com>",
      to: ["madmenmadrid@outlook.es"],
      subject: `Nuevo Referido: ${referrerName} invitó a ${friendName}`,
      html: notificationHtml,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Invitación enviada correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error en send-referral-email:", error);
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
