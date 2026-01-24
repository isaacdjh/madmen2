import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PromoEmailRequest {
  clientEmail: string;
  clientName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientEmail, clientName }: PromoEmailRequest = await req.json();

    if (!clientEmail) {
      throw new Error("Email es requerido");
    }

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
      <h1>💈 MAD MEN BARBERÍA</h1>
      <p style="color: #a3d977; margin-top: 10px;">¿Quieres una cera STMNT gratis?</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Hola ${clientName},</p>
      
      <p style="color: #cccccc; line-height: 1.6;">
        En Mad Men Madrid sabemos que <strong style="color: #4a7c23;">la lealtad se premia</strong>. 
        Por eso, queremos que tu próxima visita te salga con regalo.
      </p>

      <div class="highlight">
        <h3 style="color: #ffffff; margin-top: 0;">¿Cómo funciona?</h3>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <strong>Trae a un amigo o familiar</strong> que no nos conozca todavía
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              Tu invitado recibirá una <strong style="color: #4a7c23;">Limpieza Facial de cortesía</strong> en su primer servicio
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <strong>¡Y tú eliges tu premio!</strong>
            </div>
          </div>
        </div>

        <div class="prize">
          <div class="prize-icon">🧴</div>
          <div class="prize-text">
            <h4>Cera STMNT</h4>
            <p>Para mantener el estilo en casa (Valor: 23€)</p>
          </div>
        </div>
        
        <div class="prize">
          <div class="prize-icon">✨</div>
          <div class="prize-text">
            <h4>Limpieza Facial Profesional</h4>
            <p>Para renovar tu look (Valor: 15€)</p>
          </div>
        </div>
      </div>

      <h3 style="color: #ffffff;">¿Cómo participar?</h3>
      <p style="color: #cccccc; line-height: 1.8;">
        Dile a tu amigo que, al reservar en nuestra web, escriba <strong style="color: #4a7c23;">tu nombre en el apartado de "Notas"</strong>. ¡Así de fácil!
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://madmen2.lovable.app/amigos" class="cta-button">INVITAR A UN AMIGO</a>
      </div>

      <p style="color: #888; font-size: 13px; text-align: center;">
        O también puedes enviar directamente el email de tu amigo desde nuestra página de referidos
      </p>
    </div>

    <div class="footer">
      <p><strong>Mad Men Barbería Madrid</strong></p>
      <p>C/ Cristóbal Bordiú, 55 (Salamanca) | C/ General Pardiñas, 56 (Retiro)</p>
      <p style="color: #4a7c23;">@madmenmadrid</p>
      <p style="margin-top: 15px; font-size: 11px; color: #666;">
        Si no deseas recibir más emails promocionales, responde a este correo con "BAJA"
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const response = await resend.emails.send({
      from: "Mad Men Barbería <noreply@madmenmadrid.com>",
      to: [clientEmail],
      subject: "¿Quieres una cera STMNT gratis? Trae a un colega a Mad Men 💈",
      html: emailHtml,
    });

    console.log("Email promocional enviado a:", clientEmail, response);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error en send-referral-promo:", error);
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
