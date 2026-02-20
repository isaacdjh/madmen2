import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const allowedOrigins = [
  'https://madmen2.lovable.app',
  'https://7c7f3e19-545f-4dc1-b55b-6d7eb4ffbe30.lovableproject.com',
  'https://id-preview--7c7f3e19-545f-4dc1-b55b-6d7eb4ffbe30.lovable.app',
  'http://localhost:5173',
];

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin || '') ? (origin || allowedOrigins[0]) : allowedOrigins[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
});

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char] || char));
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const referrerName: string = body.referrerName ?? '';
    const referrerEmail: string = body.referrerEmail ?? '';
    const friendEmail: string = body.friendEmail ?? '';
    const friendName: string = body.friendName ?? '';

    if (!referrerName || typeof referrerName !== 'string') {
      throw new Error("Nombre del cliente es requerido");
    }
    if (!friendEmail || !validateEmail(friendEmail)) {
      throw new Error("Email del amigo inválido o requerido");
    }
    if (referrerEmail && !validateEmail(referrerEmail)) {
      throw new Error("Email del cliente inválido");
    }
    if (referrerName.length > 200 || friendName.length > 200) {
      throw new Error("Nombre demasiado largo");
    }

    const safeReferrerName = escapeHtml(referrerName.slice(0, 200));
    const safeFriendName = escapeHtml(friendName.slice(0, 200));
    const safeFriendEmail = friendEmail.slice(0, 320);
    const safeReferrerEmail = referrerEmail.slice(0, 320);

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
    .note { background: #2a2a2a; border-left: 4px solid #4a7c23; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .note p { margin: 0; color: #cccccc; font-size: 14px; }
    .note strong { color: #a3d977; }
    .footer { padding: 30px; text-align: center; border-top: 1px solid #333; }
    .footer p { color: #888; font-size: 12px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#x2702; MAD MEN BARBER&Iacute;A</h1>
      <p>La Experiencia Premium de Madrid</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; margin-bottom: 10px;">Hola ${safeFriendName},</p>
      
      <p style="color: #cccccc; line-height: 1.6;">
        Tu amigo <strong style="color: #4a7c23;">${safeReferrerName}</strong> quiere que vivas la experiencia Mad Men.
      </p>

      <div class="gift-box">
        <h2>&#x1F381; LIMPIEZA FACIAL GRATIS</h2>
        <p>En tu primer servicio con nosotros</p>
      </div>

      <p style="color: #cccccc; text-align: center;">
        Reserva tu cita ahora y disfruta de una limpieza facial de cortes&iacute;a valorada en 15&euro;
      </p>

      <div style="text-align: center;">
        <a href="https://madmen2.lovable.app" class="cta-button">RESERVAR AHORA</a>
      </div>

      <div class="note">
        <p><strong>Importante:</strong> Al reservar, escribe en el campo de notas: <strong>&quot;Vengo de parte de ${safeReferrerName}&quot;</strong></p>
      </div>

      <p style="color: #888; font-size: 13px; text-align: center; margin-top: 20px;">
        V&aacute;lido &uacute;nicamente en nuestras ubicaciones:<br/>
        <strong>C/ General Pardiñas, 101</strong> y <strong>C/ Alcalde Sainz de Baranda, 53</strong>
      </p>
    </div>

    <div class="footer">
      <p>Mad Men Barber&iacute;a Madrid</p>
      <p>La barber&iacute;a premium donde el estilo cl&aacute;sico se encuentra con lo contempor&aacute;neo</p>
      <p style="color: #4a7c23;">@madmenmadrid</p>
    </div>
  </div>
</body>
</html>
    `;

    // Enviar email al amigo
    const friendResponse = await resend.emails.send({
      from: "Mad Men Barbershop <noreply@madmenbarberia.com>",
      to: [safeFriendEmail],
      subject: `${safeReferrerName} te invita a Mad Men Barbería 💈 ¡Limpieza facial GRATIS!`,
      html: friendEmailHtml,
    });

    console.log("Email enviado al amigo");

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
  <h2>&#x1F3AF; Nueva Invitaci&oacute;n de Referido</h2>
  
  <div class="info">
    <p><span class="label">Cliente que invita:</span> ${safeReferrerName}</p>
    <p><span class="label">Email del cliente:</span> ${safeReferrerEmail || 'No proporcionado'}</p>
    <p><span class="label">Amigo invitado:</span> ${safeFriendName}</p>
    <p><span class="label">Fecha:</span> ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
  </div>

  <p><strong>Recordatorio:</strong></p>
  <ul>
    <li>El amigo recibirá una limpieza facial gratis en su primera visita</li>
    <li>${safeReferrerName} debe recibir su premio (cera STMNT o facial) en su próxima visita</li>
  </ul>
</body>
</html>
    `;

    await resend.emails.send({
      from: "Mad Men Barbershop <noreply@madmenbarberia.com>",
      to: ["madmenmadrid@outlook.es"],
      subject: `Nuevo Referido: ${safeReferrerName} invitó a ${safeFriendName}`,
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
    console.error("Error en send-referral-email:", error.message);
    return new Response(
      JSON.stringify({ error: "Error al enviar la invitación" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
