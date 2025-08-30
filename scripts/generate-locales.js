#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración de idiomas
const locales = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano'
};

// Función para traducir texto usando Google Translate API (requiere API key)
async function translateText(text, targetLang) {
  // Por ahora, retornamos el texto original
  // En producción, aquí usarías la API de Google Translate o similar
  return text;
}

// Función para generar archivo de idioma
async function generateLocaleFile(sourceLocale, targetLocale) {
  const sourcePath = path.join(__dirname, '../src/lib/i18n/locales', `${sourceLocale}.json`);
  const targetPath = path.join(__dirname, '../src/lib/i18n/locales', `${targetLocale}.json`);
  
  try {
    // Leer archivo fuente
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const sourceData = JSON.parse(sourceContent);
    
    // Crear estructura de traducción
    const targetData = {};
    
    // Función recursiva para procesar objetos anidados
    async function processObject(obj, targetObj) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          // Traducir texto
          targetObj[key] = await translateText(value, targetLocale);
        } else if (typeof value === 'object' && value !== null) {
          // Procesar objeto anidado
          targetObj[key] = {};
          await processObject(value, targetObj[key]);
        } else {
          // Mantener valor original para otros tipos
          targetObj[key] = value;
        }
      }
    }
    
    await processObject(sourceData, targetData);
    
    // Escribir archivo de destino
    const targetContent = JSON.stringify(targetData, null, 2);
    fs.writeFileSync(targetPath, targetContent, 'utf8');
    
    console.log(`✅ Generado: ${targetLocale}.json`);
  } catch (error) {
    console.error(`❌ Error generando ${targetLocale}.json:`, error.message);
  }
}

// Función principal
async function main() {
  console.log('🌍 Generando archivos de idioma...\n');
  
  const sourceLocale = 'en';
  
  for (const [code, name] of Object.entries(locales)) {
    if (code === sourceLocale) {
      console.log(`⏭️  Saltando ${name} (idioma fuente)`);
      continue;
    }
    
    console.log(`🔄 Generando ${name} (${code})...`);
    await generateLocaleFile(sourceLocale, code);
  }
  
  console.log('\n✨ ¡Generación completada!');
  console.log('\n📝 Nota: Los archivos generados contienen el texto original.');
  console.log('   Para traducciones reales, implementa la API de Google Translate o similar.');
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateLocaleFile, locales };
