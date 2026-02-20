
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Users, Send, Mail, FileSpreadsheet, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import { useAuth } from '@/hooks/useAuth';

const Amigos = () => {
  const { isAdmin } = useAuth();
  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Estado para envío masivo
  const [emailList, setEmailList] = useState<Array<{ email: string; name: string }>>([]);
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResults, setBulkResults] = useState<{ sent: number; failed: number } | null>(null);

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referrerName || !friendEmail) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-referral-email', {
        body: {
          referrerName,
          referrerEmail,
          friendEmail,
          friendName: friendName || 'Amigo'
        }
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('¡Invitación enviada con éxito!');
    } catch (error) {
      console.error('Error enviando invitación:', error);
      toast.error('Error al enviar la invitación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = await readXlsxFile(file);
      const emails: Array<{ email: string; name: string }> = [];
      
      if (rows.length > 1) {
        const headers = rows[0].map(h => String(h || '').toLowerCase());
        const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('correo'));
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('nombre'));
        
        for (let i = 1; i < rows.length; i++) {
          const email = emailIdx >= 0 ? String(rows[i][emailIdx] || '') : '';
          const name = nameIdx >= 0 ? String(rows[i][nameIdx] || '') : '';
          
          if (email && email.includes('@')) {
            emails.push({ email: email.trim(), name: name.trim() || 'Cliente' });
          }
        }
      }

      setEmailList(emails);
      toast.success(`${emails.length} emails cargados correctamente`);
    } catch (error) {
      console.error('Error procesando Excel:', error);
      toast.error('Error al procesar el archivo Excel');
    }
  };

  const handleBulkSend = async () => {
    if (emailList.length === 0) {
      toast.error('No hay emails para enviar');
      return;
    }

    setIsSendingBulk(true);
    setBulkProgress(0);
    setBulkResults(null);

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emailList.length; i++) {
      const { email, name } = emailList[i];
      
      try {
        const { error } = await supabase.functions.invoke('send-referral-promo', {
          body: {
            clientEmail: email,
            clientName: name
          }
        });

        if (error) {
          failed++;
          console.error(`Error enviando a ${email}:`, error);
        } else {
          sent++;
        }
      } catch (error) {
        failed++;
        console.error(`Error enviando a ${email}:`, error);
      }

      setBulkProgress(Math.round(((i + 1) / emailList.length) * 100));
      
      // Pequeña pausa para no saturar el servicio
      if (i < emailList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    setBulkResults({ sent, failed });
    setIsSendingBulk(false);
    toast.success(`Campaña completada: ${sent} enviados, ${failed} fallidos`);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Invitación Enviada!</h2>
            <p className="text-muted-foreground mb-6">
              Hemos enviado un email a tu amigo invitándolo a Mad Men. 
              Cuando reserve y venga, ¡ambos recibiréis vuestro premio!
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Invitar a otro amigo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Programa de Referidos | Mad Men Barbería Madrid</title>
        <meta name="description" content="Trae a un amigo a Mad Men y ambos ganáis. Limpieza facial gratis para tu amigo y cera STMNT o facial para ti." />
      </Helmet>

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="text-center mb-10">
            <Gift className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Programa Trae a un Amigo</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              En Mad Men premiamos la lealtad. Invita a un amigo y ambos ganáis.
            </p>
          </div>

          {/* Beneficios */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Para tu Amigo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-primary">Limpieza Facial GRATIS</p>
                <p className="text-muted-foreground">En su primer servicio con nosotros</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Para Ti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-primary">¡Elige tu premio!</p>
                <p className="text-muted-foreground">Cera STMNT gratis o Limpieza Facial</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="invite" className="w-full">
            <TabsList className={`grid w-full ${isAdmin() ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <TabsTrigger value="invite">Invitar a un Amigo</TabsTrigger>
              {isAdmin() && <TabsTrigger value="campaign">Campaña Masiva</TabsTrigger>}
            </TabsList>

            <TabsContent value="invite">
              <Card>
                <CardHeader>
                  <CardTitle>Envía una Invitación</CardTitle>
                  <CardDescription>
                    Rellena el formulario y enviaremos un email a tu amigo con la oferta especial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReferral} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="referrerName">Tu Nombre *</Label>
                        <Input
                          id="referrerName"
                          placeholder="Tu nombre completo"
                          value={referrerName}
                          onChange={(e) => setReferrerName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referrerEmail">Tu Email (opcional)</Label>
                        <Input
                          id="referrerEmail"
                          type="email"
                          placeholder="tu@email.com"
                          value={referrerEmail}
                          onChange={(e) => setReferrerEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-4">Datos de tu Amigo</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="friendName">Nombre del Amigo</Label>
                          <Input
                            id="friendName"
                            placeholder="Nombre de tu amigo"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="friendEmail">Email del Amigo *</Label>
                          <Input
                            id="friendEmail"
                            type="email"
                            placeholder="amigo@email.com"
                            value={friendEmail}
                            onChange={(e) => setFriendEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Invitación
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin() && (
              <TabsContent value="campaign">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Campaña de Email Masiva
                    </CardTitle>
                    <CardDescription>
                      Sube un Excel con emails de clientes para enviar la promoción de referidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <FileSpreadsheet className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Formato del Excel:</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Columna "Email" o "email" con los correos</li>
                          <li>• Columna "Name" o "Nombre" (opcional) para personalizar</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="excel-upload">Subir Excel de Clientes</Label>
                        <Input
                          id="excel-upload"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          className="mt-2"
                        />
                      </div>

                      {emailList.length > 0 && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="font-medium">{emailList.length} emails cargados</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Primeros 5: {emailList.slice(0, 5).map(e => e.email).join(', ')}
                            {emailList.length > 5 && '...'}
                          </p>
                        </div>
                      )}

                      {isSendingBulk && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Enviando emails...</span>
                            <span>{bulkProgress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${bulkProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {bulkResults && (
                        <Alert className={bulkResults.failed > 0 ? 'border-yellow-500' : 'border-green-500'}>
                          <CheckCircle className="w-4 h-4" />
                          <AlertDescription>
                            <strong>Resultados:</strong> {bulkResults.sent} enviados correctamente
                            {bulkResults.failed > 0 && `, ${bulkResults.failed} fallidos`}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        onClick={handleBulkSend} 
                        className="w-full"
                        disabled={emailList.length === 0 || isSendingBulk}
                      >
                        {isSendingBulk ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Enviar Campaña a {emailList.length} Clientes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* Instrucciones */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Invita a tu amigo usando el formulario de arriba o dale tu nombre</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Tu amigo reserva en nuestra web y escribe tu nombre en las notas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Cuando tu amigo venga, recibe su limpieza facial gratis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <span>En tu próxima visita, ¡reclama tu cera STMNT o facial!</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Amigos;
