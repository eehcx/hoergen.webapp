#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración de idiomas
const languages = {
  'fr': 'Français',
  'de': 'Deutsch', 
  'pt': 'Português',
  'it': 'Italiano'
};

// Mapeo de idiomas para Google Translate
const languageCodes = {
  'fr': 'fr',
  'de': 'de',
  'pt': 'pt',
  'it': 'it'
};

// Función para traducir texto usando Google Translate
async function translateText(text, targetLang) {
  try {
    // Nota: Para usar Google Translate API, necesitarías una clave API
    // Por ahora, usaremos traducciones manuales predefinidas
    
    const translations = {
      'fr': {
        // Common
        'Loading...': 'Chargement...',
        'Save': 'Enregistrer',
        'Cancel': 'Annuler',
        'Delete': 'Supprimer',
        'Edit': 'Modifier',
        'Create': 'Créer',
        'Update': 'Mettre à jour',
        'Search': 'Rechercher',
        'Filter': 'Filtrer',
        'Sort': 'Trier',
        'Actions': 'Actions',
        'Status': 'Statut',
        'Name': 'Nom',
        'Email': 'E-mail',
        'Password': 'Mot de passe',
        'Confirm Password': 'Confirmer le mot de passe',
        'Description': 'Description',
        'Title': 'Titre',
        'Type': 'Type',
        'Date': 'Date',
        'Time': 'Heure',
        'Duration': 'Durée',
        'Size': 'Taille',
        'Count': 'Compte',
        'Total': 'Total',
        'View': 'Voir',
        'Details': 'Détails',
        'Back': 'Retour',
        'Next': 'Suivant',
        'Previous': 'Précédent',
        'Submit': 'Soumettre',
        'Reset': 'Réinitialiser',
        'Close': 'Fermer',
        'Open': 'Ouvrir',
        'Yes': 'Oui',
        'No': 'Non',
        'OK': 'OK',
        'Error': 'Erreur',
        'Success': 'Succès',
        'Warning': 'Avertissement',
        'Info': 'Information',
        'Required': 'Requis',
        'Optional': 'Optionnel',
        'Enabled': 'Activé',
        'Disabled': 'Désactivé',
        'Active': 'Actif',
        'Inactive': 'Inactif',
        'Online': 'En ligne',
        'Offline': 'Hors ligne',
        'Public': 'Public',
        'Private': 'Privé',
        'Pending': 'En attente',
        'Approved': 'Approuvé',
        'Rejected': 'Rejeté',
        'Draft': 'Brouillon',
        'Published': 'Publié',
        'Archived': 'Archivé',
        'and': 'et'
      },
      'de': {
        // Common
        'Loading...': 'Lädt...',
        'Save': 'Speichern',
        'Cancel': 'Abbrechen',
        'Delete': 'Löschen',
        'Edit': 'Bearbeiten',
        'Create': 'Erstellen',
        'Update': 'Aktualisieren',
        'Search': 'Suchen',
        'Filter': 'Filter',
        'Sort': 'Sortieren',
        'Actions': 'Aktionen',
        'Status': 'Status',
        'Name': 'Name',
        'Email': 'E-Mail',
        'Password': 'Passwort',
        'Confirm Password': 'Passwort bestätigen',
        'Description': 'Beschreibung',
        'Title': 'Titel',
        'Type': 'Typ',
        'Date': 'Datum',
        'Time': 'Zeit',
        'Duration': 'Dauer',
        'Size': 'Größe',
        'Count': 'Anzahl',
        'Total': 'Gesamt',
        'View': 'Anzeigen',
        'Details': 'Details',
        'Back': 'Zurück',
        'Next': 'Weiter',
        'Previous': 'Zurück',
        'Submit': 'Absenden',
        'Reset': 'Zurücksetzen',
        'Close': 'Schließen',
        'Open': 'Öffnen',
        'Yes': 'Ja',
        'No': 'Nein',
        'OK': 'OK',
        'Error': 'Fehler',
        'Success': 'Erfolg',
        'Warning': 'Warnung',
        'Info': 'Information',
        'Required': 'Erforderlich',
        'Optional': 'Optional',
        'Enabled': 'Aktiviert',
        'Disabled': 'Deaktiviert',
        'Active': 'Aktiv',
        'Inactive': 'Inaktiv',
        'Online': 'Online',
        'Offline': 'Offline',
        'Public': 'Öffentlich',
        'Private': 'Privat',
        'Pending': 'Ausstehend',
        'Approved': 'Genehmigt',
        'Rejected': 'Abgelehnt',
        'Draft': 'Entwurf',
        'Published': 'Veröffentlicht',
        'Archived': 'Archiviert',
        'and': 'und'
      },
      'pt': {
        // Common
        'Loading...': 'Carregando...',
        'Save': 'Salvar',
        'Cancel': 'Cancelar',
        'Delete': 'Excluir',
        'Edit': 'Editar',
        'Create': 'Criar',
        'Update': 'Atualizar',
        'Search': 'Pesquisar',
        'Filter': 'Filtrar',
        'Sort': 'Ordenar',
        'Actions': 'Ações',
        'Status': 'Status',
        'Name': 'Nome',
        'Email': 'E-mail',
        'Password': 'Senha',
        'Confirm Password': 'Confirmar senha',
        'Description': 'Descrição',
        'Title': 'Título',
        'Type': 'Tipo',
        'Date': 'Data',
        'Time': 'Hora',
        'Duration': 'Duração',
        'Size': 'Tamanho',
        'Count': 'Contagem',
        'Total': 'Total',
        'View': 'Ver',
        'Details': 'Detalhes',
        'Back': 'Voltar',
        'Next': 'Próximo',
        'Previous': 'Anterior',
        'Submit': 'Enviar',
        'Reset': 'Redefinir',
        'Close': 'Fechar',
        'Open': 'Abrir',
        'Yes': 'Sim',
        'No': 'Não',
        'OK': 'OK',
        'Error': 'Erro',
        'Success': 'Sucesso',
        'Warning': 'Aviso',
        'Info': 'Informação',
        'Required': 'Obrigatório',
        'Optional': 'Opcional',
        'Enabled': 'Habilitado',
        'Disabled': 'Desabilitado',
        'Active': 'Ativo',
        'Inactive': 'Inativo',
        'Online': 'Online',
        'Offline': 'Offline',
        'Public': 'Público',
        'Private': 'Privado',
        'Pending': 'Pendente',
        'Approved': 'Aprovado',
        'Rejected': 'Rejeitado',
        'Draft': 'Rascunho',
        'Published': 'Publicado',
        'Archived': 'Arquivado',
        'and': 'e'
      },
      'it': {
        // Common
        'Loading...': 'Caricamento...',
        'Save': 'Salva',
        'Cancel': 'Annulla',
        'Delete': 'Elimina',
        'Edit': 'Modifica',
        'Create': 'Crea',
        'Update': 'Aggiorna',
        'Search': 'Cerca',
        'Filter': 'Filtra',
        'Sort': 'Ordina',
        'Actions': 'Azioni',
        'Status': 'Stato',
        'Name': 'Nome',
        'Email': 'E-mail',
        'Password': 'Password',
        'Confirm Password': 'Conferma password',
        'Description': 'Descrizione',
        'Title': 'Titolo',
        'Type': 'Tipo',
        'Date': 'Data',
        'Time': 'Ora',
        'Duration': 'Durata',
        'Size': 'Dimensione',
        'Count': 'Conteggio',
        'Total': 'Totale',
        'View': 'Visualizza',
        'Details': 'Dettagli',
        'Back': 'Indietro',
        'Next': 'Avanti',
        'Previous': 'Precedente',
        'Submit': 'Invia',
        'Reset': 'Ripristina',
        'Close': 'Chiudi',
        'Open': 'Apri',
        'Yes': 'Sì',
        'No': 'No',
        'OK': 'OK',
        'Error': 'Errore',
        'Success': 'Successo',
        'Warning': 'Avviso',
        'Info': 'Informazione',
        'Required': 'Richiesto',
        'Optional': 'Opzionale',
        'Enabled': 'Abilitato',
        'Disabled': 'Disabilitato',
        'Active': 'Attivo',
        'Inactive': 'Inattivo',
        'Online': 'Online',
        'Offline': 'Offline',
        'Public': 'Pubblico',
        'Private': 'Privato',
        'Pending': 'In attesa',
        'Approved': 'Approvato',
        'Rejected': 'Rifiutato',
        'Draft': 'Bozza',
        'Published': 'Pubblicato',
        'Archived': 'Archiviato',
        'and': 'e'
      }
    };

    // Buscar traducción en el diccionario
    if (translations[targetLang] && translations[targetLang][text]) {
      return translations[targetLang][text];
    }

    // Si no hay traducción, devolver el texto original
    return text;
  } catch (error) {
    console.error(`Error traduciendo "${text}" a ${targetLang}:`, error.message);
    return text;
  }
}

// Función para traducir un objeto completo
async function translateObject(obj, targetLang) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

// Función principal
async function main() {
  console.log('🌍 Iniciando traducción de archivos de idioma...\n');
  
  // Leer el archivo fuente (inglés)
  const sourcePath = path.join(__dirname, '..', 'src', 'lib', 'i18n', 'locales', 'en.json');
  
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Archivo fuente en.json no encontrado');
    process.exit(1);
  }
  
  const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  
  // Traducir cada idioma
  for (const [langCode, langName] of Object.entries(languages)) {
    console.log(`🔄 Traduciendo ${langName} (${langCode})...`);
    
    try {
      const translated = await translateObject(sourceContent, langCode);
      
      // Guardar archivo traducido
      const outputPath = path.join(__dirname, '..', 'src', 'lib', 'i18n', 'locales', `${langCode}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf8');
      
      console.log(`✅ ${langName} traducido y guardado en: ${langCode}.json`);
    } catch (error) {
      console.error(`❌ Error traduciendo ${langName}:`, error.message);
    }
  }
  
  console.log('\n✨ ¡Traducción completada!');
  console.log('\n📝 Nota: Este script incluye traducciones básicas predefinidas.');
  console.log('   Para traducciones completas y precisas, considera usar:');
  console.log('   - Google Translate API (requiere clave API)');
  console.log('   - DeepL API');
  console.log('   - Microsoft Translator API');
  console.log('   - O servicios de traducción profesional');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { translateText, translateObject };
