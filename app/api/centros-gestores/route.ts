import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Obteniendo lista de centros gestores...');
    
    // Verificar variables de entorno
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    
    if (!serviceEmail || !privateKey) {
      return NextResponse.json({ 
        error: 'Variables de entorno no configuradas'
      }, { status: 500 });
    }

    // Credenciales de la cuenta de servicio
    const serviceAccountAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });
    const spreadsheetId = '1K6j04r03XhAf1pRP1SiT7emaflF8Oz6WNCZDoxANFAE';

    // Obtener información del spreadsheet
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });
   
    const firstSheet = spreadsheetInfo.data.sheets?.[0];
    const sheetName = firstSheet?.properties?.title || 'Sheet1';
   
    // Obtener datos
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No se encontraron datos' }, { status: 404 });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Encontrar los índices de las columnas
    const codigoCentroGestorIndex = headers.findIndex(header => 
      header.trim().toLowerCase() === 'codigo_centro_gestor'
    );
    const nombreCentroGestorIndex = headers.findIndex(header => 
      header.trim().toLowerCase() === 'nombre_centro_gestor'
    );

    if (codigoCentroGestorIndex === -1 || nombreCentroGestorIndex === -1) {
      return NextResponse.json({ 
        error: 'Columnas de centro gestor no encontradas',
        encontradas: {
          codigo: codigoCentroGestorIndex !== -1,
          nombre: nombreCentroGestorIndex !== -1
        }
      }, { status: 404 });
    }

    // Extraer todos los centros gestores únicos
    const centrosGestoresMap = new Map<string, string>();
    
    dataRows.forEach(row => {
      const codigo = row[codigoCentroGestorIndex]?.trim();
      const nombre = row[nombreCentroGestorIndex]?.trim();
      
      if (codigo && nombre && codigo !== '' && nombre !== '') {
        centrosGestoresMap.set(codigo, nombre);
      }
    });

    // Convertir Map a Array de objetos y ordenar por código
    const centrosGestoresArray = Array.from(centrosGestoresMap.entries())
      .map(([codigo, nombre]) => ({ codigo, nombre }))
      .sort((a, b) => a.codigo.localeCompare(b.codigo));

    console.log(`✅ Centros gestores encontrados: ${centrosGestoresArray.length}`);

    return NextResponse.json({
      centros_gestores: centrosGestoresArray,
      total: centrosGestoresArray.length
    });
    
  } catch (error) {
    console.error('💥 Error al obtener centros gestores:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener centros gestores',
        details: (error as Error).message
      }, 
      { status: 500 }
    );
  }
} 