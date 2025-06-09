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

export async function GET(request: Request) {
  try {
    // Obtener el parámetro de filtro codigo_centro_gestor de la URL
    const { searchParams } = new URL(request.url);
    const codigoCentroGestorFilter = searchParams.get('codigo_centro_gestor');
    
    console.log('🔍 Verificando variables de entorno...');
    console.log('🎯 Filtro código centro gestor:', codigoCentroGestorFilter);
    
    // Verificar variables de entorno
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    
    if (!serviceEmail || !privateKey) {
      console.error('❌ Variables de entorno faltantes:');
      console.error('- GOOGLE_SERVICE_ACCOUNT_EMAIL:', !!serviceEmail);
      console.error('- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:', !!privateKey);
      
      return NextResponse.json({ 
        error: 'Variables de entorno no configuradas',
        details: {
          hasEmail: !!serviceEmail,
          hasPrivateKey: !!privateKey
        }
      }, { status: 500 });
    }

    console.log('✅ Variables de entorno encontradas');
    console.log('📧 Service Email:', serviceEmail);

    // Credenciales de la cuenta de servicio
    const serviceAccountAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('🔐 Autenticación configurada');

    const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });
    const spreadsheetId = '1K6j04r03XhAf1pRP1SiT7emaflF8Oz6WNCZDoxANFAE';

    console.log('📊 Obteniendo información del spreadsheet...');

    // Primero, obtén información sobre las hojas disponibles
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });
   
    // Obtén el nombre de la primera hoja
    const firstSheet = spreadsheetInfo.data.sheets?.[0];
    const sheetName = firstSheet?.properties?.title || 'Sheet1';
   
    console.log(`📋 Usando hoja: ${sheetName}`);
   
    // Obtén los datos de la hoja incluyendo encabezados
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('⚠️ No se encontraron datos en el spreadsheet');
      return NextResponse.json({ error: 'No se encontraron datos en el spreadsheet' }, { status: 404 });
    }

    console.log(`📈 Datos encontrados: ${rows.length} filas`);

    // La primera fila contiene los encabezados
    const headers = rows[0];
    const dataRows = rows.slice(1);

    console.log('📝 Headers encontrados:', headers);
    console.log(`📊 Filas de datos: ${dataRows.length}`);

    // Mapear los datos a la estructura de Proyecto
    const proyectos = dataRows.map((row, index) => {
      // Crear un objeto con los headers como keys y los valores de la fila
      const rowData: { [key: string]: string } = {};
      headers.forEach((header: string, i: number) => {
        rowData[header.trim()] = row[i] || '';
      });



      return {
        id: String(rowData.codigo_bpin_proyecto || (index + 1).toString()), // Asegurar string para serialización JSON
        nombre_del_proyecto: rowData.nombre_del_proyecto || '',
        objeto: rowData.objeto || '',
        valor: parseSpanishNumber(rowData.valor || '0'),
        codigo_del_centro_de_costos: rowData.codigo_del_centro_de_costos || '',
        nombre_del_centro_de_costos: rowData.nombre_del_centro_de_costos || '',
        elemento_pep_proyecto: rowData.elemento_pep_proyecto || '',
        codigo_pospre: rowData.codigo_pospre || '',
        nombre_pospre: rowData.nombre_pospre || '',
        codigo_dane: rowData.codigo_dane || '',
        nombre_codigo_dane: rowData.nombre_codigo_dane || '',
        rubro_atlas: rowData.rubro_atlas || null,
        codigo_del_fondo: rowData.codigo_del_fondo || null,
        nombre_del_fondo: rowData.nombre_del_fondo || null,
        observaciones: (() => {
          // Buscar la columna de observaciones - puede tener diferentes nombres
          const observKeys = Object.keys(rowData).filter(key => 
            key.toLowerCase().includes('observ')
          );
          
          if (observKeys.length > 0) {
            const key = observKeys[0];
            const rawValue = rowData[key] || '0';
            return parseSpanishNumber(rawValue);
          }
          
          return 0;
        })(),
        codigo_actividad_mga: rowData.codigo_actividad_mga || null,
        nombre_actividad_mga: rowData.nombre_actividad_mga || null,
        // Campos adicionales para el filtrado
        codigo_centro_gestor: rowData.codigo_centro_gestor || '',
        nombre_centro_gestor: rowData.nombre_centro_gestor || '',
      };
    });

    console.log(`✅ Proyectos procesados: ${proyectos.length}`);

    // Filtrar por código de centro gestor si se proporciona el parámetro
    let proyectosFiltrados = proyectos;
    if (codigoCentroGestorFilter) {
      proyectosFiltrados = proyectos.filter(proyecto => {
        const codigoCentroGestor = proyecto.codigo_centro_gestor.trim();
        const filtro = codigoCentroGestorFilter.trim();
        
        // Buscar coincidencia exacta por código (es más preciso)
        return codigoCentroGestor === filtro;
      });
      
      console.log(`🎯 Proyectos filtrados por código "${codigoCentroGestorFilter}": ${proyectosFiltrados.length}`);
      console.log(`📝 Proyectos encontrados:`, proyectosFiltrados.map(p => `${p.codigo_centro_gestor} - ${p.nombre_centro_gestor}`));
    }

    return NextResponse.json(proyectosFiltrados);
    
  } catch (error) {
    console.error('💥 Error detallado en la API:', error);
    console.error('📍 Stack trace:', (error as Error).stack);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener datos del spreadsheet',
        details: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      }, 
      { status: 500 }
    );
  }
} 