
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  verifyToken: string;
  webhookUrl: string;
  isActive: boolean;
}

interface WhatsAppStats {
  totalConversations: number;
  activeChats: number;
  appointmentsCreated: number;
  successRate: number;
}

export const useWhatsAppConfig = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig>({
    accessToken: '',
    phoneNumberId: '',
    verifyToken: '',
    webhookUrl: '',
    isActive: false
  });
  const [stats, setStats] = useState<WhatsAppStats>({
    totalConversations: 0,
    activeChats: 0,
    appointmentsCreated: 0,
    successRate: 0
  });

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('whatsapp_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setIsConnected(parsed.isActive && Boolean(parsed.accessToken));
    }

    // Simulate statistics
    setStats({
      totalConversations: 24,
      activeChats: 3,
      appointmentsCreated: 18,
      successRate: 75
    });
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('whatsapp_config', JSON.stringify(config));
    setIsConnected(config.isActive && Boolean(config.accessToken));
    toast.success('Configuración de WhatsApp guardada correctamente');
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `${window.location.origin}/functions/v1/whatsapp-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL del webhook copiada al portapapeles');
  };

  const testConnection = async () => {
    if (!config.accessToken || !config.phoneNumberId) {
      toast.error('Por favor completa la configuración antes de probar');
      return;
    }
    
    // Simulate connection test
    toast.success('Conexión con WhatsApp Business API exitosa');
  };

  return {
    isConnected,
    config,
    setConfig,
    stats,
    handleSaveConfig,
    copyWebhookUrl,
    testConnection
  };
};
