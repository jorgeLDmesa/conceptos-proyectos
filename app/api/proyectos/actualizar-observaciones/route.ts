import { google } from 'googleapis';
import { NextResponse } from 'next/server';



// Función para parsear números en formato español
function parseSpanishNumber(valorString: string): number {
  if (!valorString || valorString === '') return 0;
  
  // Remover espacios y caracteres no numéricos excepto puntos y comas
  let cleanValue = valorString.replace(/[^\d.,]/g, '');
  
  // Si hay tanto puntos como comas, los puntos son separadores de miles
  if (cleanValue.includes('.') && cleanValue.includes(',')) {
    // Remover puntos (separadores de miles) y convertir coma a punto decimal
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  } 
  // Si solo hay comas, son separadores decimales
  else if (cleanValue.includes(',') && !cleanValue.includes('.')) {
    cleanValue = cleanValue.replace(',', '.');
  }
  // Si solo hay puntos, verificar si es separador de miles o decimal
  else if (cleanValue.includes('.') && !cleanValue.includes(',')) {
    // Si hay más de un punto, son separadores de miles
    const dotCount = (cleanValue.match(/\./g) || []).length;
    const lastDotPosition = cleanValue.lastIndexOf('.');
    const lengthAfterDot = cleanValue.length - lastDotPosition - 1;
    
    if (dotCount > 1) {
      // Múltiples puntos = separadores de miles, removerlos
      cleanValue = cleanValue.replace(/\./g, '');
    } else if (dotCount === 1) {
      // Un solo punto: si son exactamente 3 dígitos después o más de 3, es separador de miles
      // Si son 1-2 dígitos después, es decimal
      if (lengthAfterDot === 3 && cleanValue.length > 4) {
        // Formato como "1.000" o "25.000" = separador de miles
        cleanValue = cleanValue.replace('.', '');
      } else if (lengthAfterDot > 3) {
        // Más de 3 dígitos después del punto = separador de miles
        cleanValue = cleanValue.replace(/\./g, '');
      }
      // Si son 1-2 dígitos después del punto y el número es corto, mantener como decimal
    }
  }
  
  return parseFloat(cleanValue) || 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proyectoId, valorAAgregar } = body;

    if (!proyectoId || !valorAAgregar) {
      return NextResponse.json({ 
        error: 'Faltan parámetros: proyectoId y valorAAgregar son requeridos' 
      }, { status: 400 });
    }

    console.log('🔄 Actualizando observaciones para proyecto:', proyectoId);
    console.log('💰 Valor a agregar:', valorAAgregar);

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

    // Obtener todos los datos
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

    // Encontrar los índices de las columnas necesarias
    const codigoBpinIndex = headers.findIndex(header => 
      header.trim().toLowerCase() === 'codigo_bpin_proyecto'
    );
    
    const observacionesIndex = headers.findIndex(header => 
      header.trim().toLowerCase().includes('observ')
    );

    if (codigoBpinIndex === -1) {
      return NextResponse.json({ 
        error: 'Columna codigo_bpin_proyecto no encontrada' 
      }, { status: 404 });
    }

    if (observacionesIndex === -1) {
      return NextResponse.json({ 
        error: 'Columna de observaciones no encontrada' 
      }, { status: 404 });
    }

    // Buscar la fila del proyecto
    let filaEncontrada = -1;
    for (let i = 0; i < dataRows.length; i++) {
      const codigoBpin = dataRows[i][codigoBpinIndex]?.trim();
      if (codigoBpin === proyectoId) {
        filaEncontrada = i + 2; // +2 porque: +1 para el índice de la fila en sheets (1-based) y +1 para saltar headers
        break;
      }
    }

    if (filaEncontrada === -1) {
      return NextResponse.json({ 
        error: 'Proyecto no encontrado' 
      }, { status: 404 });
    }

    // Obtener el valor actual de observaciones
    const valorActualObservaciones = parseSpanishNumber(dataRows[filaEncontrada - 2][observacionesIndex] || '0');
    const nuevoValorObservaciones = valorActualObservaciones + valorAAgregar;

    // Actualizar la celda específica
    const columnaObservaciones = String.fromCharCode(65 + observacionesIndex); // A=65
    const rango = `${sheetName}!${columnaObservaciones}${filaEncontrada}`;

    console.log('📍 Actualizando celda:', rango);
    console.log('📊 Valor anterior:', valorActualObservaciones);
    console.log('📊 Valor nuevo (número puro):', nuevoValorObservaciones);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: rango,
      valueInputOption: 'USER_ENTERED', // Permite que Google Sheets interprete como número
      requestBody: {
        values: [[nuevoValorObservaciones]] // Enviar el número sin formato
      }
    });

    console.log('✅ Observaciones actualizadas exitosamente');

    return NextResponse.json({ 
      success: true,
      valorAnterior: valorActualObservaciones,
      valorNuevo: nuevoValorObservaciones,
      celda: rango
    });

  } catch (error) {
    console.error('💥 Error al actualizar observaciones:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al actualizar observaciones',
        details: (error as Error).message
      }, 
      { status: 500 }
    );
  }
} 