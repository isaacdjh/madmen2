export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Limpiar el número de espacios, guiones, paréntesis
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Si empieza con +34, mantenerlo
  if (cleaned.startsWith('+34')) {
    return cleaned;
  }
  
  // Si empieza con 34, agregar +
  if (cleaned.startsWith('34') && cleaned.length === 11) {
    return '+' + cleaned;
  }
  
  // Si es un número español de 9 dígitos, agregar +34
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    return '+34' + cleaned;
  }
  
  return cleaned;
};

export const normalizeEmail = (email: string): string => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

export interface BooksyClient {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  totalVisits?: number;
  lastVisit?: string;
  totalSpent?: number;
  notes?: string;
}

export const mapColumnHeaders = (headers: string[]) => {
  const normalizedHeaders = headers.map((h: any) => String(h).toLowerCase().trim());
  
  return {
    name: normalizedHeaders.findIndex(h => 
      h.includes('name') || h.includes('nombre') || h.includes('client') || 
      h.includes('customer') || h.includes('cliente')
    ),
    firstName: normalizedHeaders.findIndex(h => 
      h.includes('first') || h.includes('nombre') || h.includes('given')
    ),
    lastName: normalizedHeaders.findIndex(h => 
      h.includes('last') || h.includes('apellido') || h.includes('surname') || h.includes('family')
    ),
    email: normalizedHeaders.findIndex(h => 
      h.includes('email') || h.includes('correo') || h.includes('mail')
    ),
    phone: normalizedHeaders.findIndex(h => 
      h.includes('phone') || h.includes('teléfono') || h.includes('telefono') || 
      h.includes('mobile') || h.includes('móvil') || h.includes('movil') || h.includes('cel')
    ),
    totalVisits: normalizedHeaders.findIndex(h => 
      h.includes('visit') || h.includes('cita') || h.includes('appointment') || h.includes('bookings')
    ),
    lastVisit: normalizedHeaders.findIndex(h => 
      h.includes('last visit') || h.includes('última') || h.includes('recent') || h.includes('último')
    ),
    totalSpent: normalizedHeaders.findIndex(h => 
      h.includes('spent') || h.includes('total') || h.includes('amount') || h.includes('gastado') || h.includes('revenue')
    )
  };
};

export const extractClientData = (row: any[], columnMap: ReturnType<typeof mapColumnHeaders>): BooksyClient => {
  return {
    name: row[columnMap.name] ? String(row[columnMap.name]).trim() : '',
    firstName: row[columnMap.firstName] ? String(row[columnMap.firstName]).trim() : '',
    lastName: row[columnMap.lastName] ? String(row[columnMap.lastName]).trim() : '',
    email: row[columnMap.email] ? normalizeEmail(String(row[columnMap.email])) : '',
    phone: row[columnMap.phone] ? normalizePhoneNumber(String(row[columnMap.phone])) : '',
    totalVisits: row[columnMap.totalVisits] ? Number(row[columnMap.totalVisits]) || 0 : 0,
    lastVisit: row[columnMap.lastVisit] ? String(row[columnMap.lastVisit]) : '',
    totalSpent: row[columnMap.totalSpent] ? Number(row[columnMap.totalSpent]) || 0 : 0
  };
};

export const validateClientData = (clientData: BooksyClient, fullName: string, rowIndex: number) => {
  const errors: string[] = [];
  
  if (!fullName) {
    errors.push(`Fila ${rowIndex + 2}: Falta el nombre del cliente`);
  }

  if (!clientData.email && !clientData.phone) {
    errors.push(`Fila ${rowIndex + 2}: Falta email o teléfono para ${fullName}`);
  }

  return errors;
};

export const generateTempContact = (clientData: BooksyClient, actualIndex: number) => {
  const email = clientData.email || `temp.${Date.now()}.${actualIndex}@booksy.com`;
  const phone = clientData.phone || `+34${String(600000000 + Date.now() + actualIndex).slice(-9)}`;
  
  return { email, phone };
};