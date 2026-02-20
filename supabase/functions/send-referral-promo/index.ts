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

interface PromoEmailRequest {
  clientEmail: string;
  clientName: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const clientEmail: string = body.clientEmail ?? '';
    const clientName: string = body.clientName ?? '';

    if (!clientEmail || typeof clientEmail !== 'string') {
      throw new Error("Email es requerido");
    }
    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      throw new Error("Formato de email inválido");
    }
    if (clientName.length > 200) {
      throw new Error("Nombre demasiado largo");
    }

    const safeClientName = escapeHtml(clientName.slice(0, 200));
    const safeClientEmail = clientEmail.slice(0, 320);

    const emailHtml = `
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
    .content { padding: 40px 30px; }
    .highlight { background: #2a2a2a; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .prize { display: flex; align-items: center; margin: 15px 0; padding: 15px; background: #333; border-radius: 8px; }
    .prize-icon { font-size: 30px; margin-right: 15px; }
    .prize-text h4 { color: #4a7c23; margin: 0 0 5px; }
    .prize-text p { color: #aaa; margin: 0; font-size: 14px; }
    .steps { margin: 30px 0; }
    .step { display: flex; align-items: flex-start; margin: 15px 0; }
    .step-number { background: #4a7c23; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
    .step-content { color: #ccc; }
    .cta-button { display: inline-block; background: #4a7c23; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; }
    .footer { padding: 30px; text-align: center; border-top: 1px solid #333; }
    .footer p { color: #888; font-size: 12px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#x2702; MAD MEN BARBER&Iacute;A</h1>
      <p style="color: #a3d977; margin-top: 10px;">&iquest;Quieres una cera STMNT gratis?</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Hola ${safeClientName},</p>
      
      <p style="color: #cccccc; line-height: 1.6;">
        En Mad Men Madrid sabemos que <strong style="color: #4a7c23;">la lealtad se premia</strong>. 
        Por eso, queremos que tu pr&oacute;xima visita te salga con regalo.
      </p>

      <div class="highlight">
        <h3 style="color: #ffffff; margin-top: 0;">&iquest;C&oacute;mo funciona?</h3>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <strong>Trae a un amigo o familiar</strong> que no nos conozca todav&iacute;a
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              Tu invitado recibir&aacute; una <strong style="color: #4a7c23;">Limpieza Facial de cortes&iacute;a</strong> en su primer servicio
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <strong>&iexcl;Y t&uacute; eliges tu premio!</strong>
            </div>
          </div>
        </div>

        <div class="prize">
          <div class="prize-icon">&#x1F9F4;</div>
          <div class="prize-text">
            <h4>Cera STMNT</h4>
            <p>Para mantener el estilo en casa (Valor: 23&euro;)</p>
          </div>
        </div>
        
        <div class="prize">
          <div class="prize-icon">&#x2728;</div>
          <div class="prize-text">
            <h4>Limpieza Facial Profesional</h4>
            <p>Para renovar tu look (Valor: 15&euro;)</p>
          </div>
        </div>
      </div>

      <h3 style="color: #ffffff;">&iquest;C&oacute;mo participar?</h3>
      <p style="color: #cccccc; line-height: 1.8;">
        Dile a tu amigo que, al reservar en nuestra web, escriba <strong style="color: #4a7c23;">tu nombre en el apartado de &quot;Notas&quot;</strong>. &iexcl;As&iacute; de f&aacute;cil!
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://madmen2.lovable.app/amigos" class="cta-button">INVITAR A UN AMIGO</a>
      </div>

      <p style="color: #888; font-size: 13px; text-align: center;">
        O tambi&eacute;n puedes enviar directamente el email de tu amigo desde nuestra p&aacute;gina de referidos
      </p>
    </div>

    <div class="footer">
      <p><strong>Mad Men Barber&iacute;a Madrid</strong></p>
      <p>V&aacute;lido en: C/ General Pardiñas, 101 | C/ Alcalde Sainz de Baranda, 53</p>
      <p style="color: #4a7c23;">@madmenmadrid</p>
      <p style="margin-top: 15px; font-size: 11px; color: #666;">
        Si no deseas recibir m&aacute;s emails promocionales, responde a este correo con &quot;BAJA&quot;
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const response = await resend.emails.send({
      from: "Mad Men Barbershop <noreply@madmenbarberia.com>",
      to: [safeClientEmail],
      subject: "¿Quieres una cera STMNT gratis? Trae a un colega a Mad Men 💈",
      html: emailHtml,
    });

    console.log("Email promocional enviado a:", safeClientEmail);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error en send-referral-promo:", error.message);
    return new Response(
      JSON.stringify({ error: "Error al enviar el email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
