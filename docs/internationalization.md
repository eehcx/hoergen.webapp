# Sistema de Internacionalización (i18n)

Este documento describe cómo usar el sistema de internacionalización implementado en la aplicación Hörgen.

## 🏗️ Arquitectura

El sistema de i18n está construido con los siguientes componentes:

- **Archivos de idioma**: Archivos JSON con traducciones organizadas por secciones
- **Hook de traducción**: `useStaticTranslation` para componentes React
- **Selector de idioma**: Componente para cambiar entre idiomas disponibles
- **Configuración automática**: Detección del idioma del navegador y persistencia en localStorage

## 🌍 Idiomas Soportados

- 🇺🇸 **English** (en) - Idioma por defecto
- 🇪🇸 **Español** (es)
- 🇫🇷 **Français** (fr)
- 🇩🇪 **Deutsch** (de)
- 🇵🇹 **Português** (pt)
- 🇮🇹 **Italiano** (it)

## 📁 Estructura de Archivos

```
src/lib/i18n/
├── index.ts                 # Configuración principal del sistema
├── config.ts               # Configuración avanzada
├── locales/
│   ├── en.json            # Inglés (idioma fuente)
│   ├── es.json            # Español
│   ├── fr.json            # Francés
│   ├── de.json            # Alemán
│   ├── pt.json            # Portugués
│   └── it.json            # Italiano
```

## 🚀 Uso Básico

### 1. Importar el Hook

```tsx
import { useStaticTranslation } from '@/hooks/useTranslation'
```

### 2. Usar en Componentes

```tsx
function MyComponent() {
  const { t, locale, changeLocale } = useStaticTranslation()
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
      <button onClick={() => changeLocale('es')}>
        Cambiar a Español
      </button>
    </div>
  )
}
```

### 3. Estructura de Claves

Las traducciones están organizadas en secciones lógicas:

```json
{
  "common": {
    "title": "Título",
    "description": "Descripción"
  },
  "auth": {
    "login": "Iniciar sesión",
    "signup": "Registrarse"
  },
  "navigation": {
    "home": "Inicio",
    "dashboard": "Panel de control"
  }
}
```

## 🔧 Funciones Disponibles

### `useStaticTranslation()`

Retorna un objeto con:

- **`t(key: string)`**: Función para traducir texto
- **`locale`**: Idioma actual
- **`changeLocale(locale: Locale)`**: Función para cambiar idioma
- **`locales`**: Objeto con todos los idiomas disponibles
- **`isReady`**: Boolean que indica si las traducciones están cargadas

### `getCurrentLocale()`

Obtiene el idioma actual (del localStorage o navegador).

### `changeLocale(locale: Locale)`

Cambia el idioma y recarga la página.

## 📝 Agregar Nuevas Traducciones

### 1. Agregar al Archivo en Inglés

```json
{
  "newSection": {
    "newKey": "New text in English"
  }
}
```

### 2. Agregar a Otros Idiomas

```json
{
  "newSection": {
    "newKey": "Nuevo texto en español"
  }
}
```

### 3. Usar en Componentes

```tsx
const { t } = useStaticTranslation()
return <p>{t('newSection.newKey')}</p>
```

## 🎯 Componentes de UI

### LanguageSelector

Selector compacto de idioma (solo icono):

```tsx
import { LanguageSelector } from '@/components/language-selector'

<LanguageSelector />
```

### LanguageSelectorWithText

Selector de idioma con texto visible:

```tsx
import { LanguageSelectorWithText } from '@/components/language-selector'

<LanguageSelectorWithText />
```

## 🔄 Generación Automática de Idiomas

Para generar automáticamente los archivos de idioma faltantes:

```bash
node scripts/generate-locales.cjs
```

**Nota**: Este script genera archivos con el texto original. Para traducciones reales, implementa la API de Google Translate o similar.

## 🌐 Configuración del Navegador

El sistema detecta automáticamente el idioma del navegador y lo usa como fallback si no hay un idioma guardado en localStorage.

## 💾 Persistencia

El idioma seleccionado se guarda en `localStorage` con la clave `hoergen-locale`.

## 🚨 Consideraciones

1. **Recarga de página**: Al cambiar idioma, la página se recarga para aplicar todos los cambios
2. **Fallback**: Si no se encuentra una traducción, se muestra la clave original
3. **Carga asíncrona**: Los archivos de idioma se cargan dinámicamente
4. **Tipado**: El sistema incluye tipos TypeScript para `Locale`

## 📚 Ejemplos Completos

### Página con Traducciones

```tsx
import { useStaticTranslation } from '@/hooks/useTranslation'
import { LanguageSelector } from '@/components/language-selector'

export default function HomePage() {
  const { t } = useStaticTranslation()
  
  return (
    <div>
      <header>
        <h1>{t('home.title')}</h1>
        <LanguageSelector />
      </header>
      
      <main>
        <section>
          <h2>{t('home.welcome')}</h2>
          <p>{t('home.description')}</p>
        </section>
        
        <section>
          <h2>{t('navigation.features')}</h2>
          <ul>
            <li>{t('features.radio')}</li>
            <li>{t('features.chat')}</li>
            <li>{t('features.events')}</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
```

### Formulario con Validaciones

```tsx
import { useStaticTranslation } from '@/hooks/useTranslation'

export default function ContactForm() {
  const { t } = useStaticTranslation()
  
  return (
    <form>
      <div>
        <label htmlFor="name">{t('common.name')}</label>
        <input 
          id="name" 
          type="text" 
          required 
          aria-describedby="name-error" 
        />
        <div id="name-error" className="error">
          {t('validation.required')}
        </div>
      </div>
      
      <div>
        <label htmlFor="email">{t('common.email')}</label>
        <input 
          id="email" 
          type="email" 
          required 
          aria-describedby="email-error" 
        />
        <div id="email-error" className="error">
          {t('validation.email')}
        </div>
      </div>
      
      <button type="submit">{t('common.submit')}</button>
    </form>
  )
}
```

### Integración en Header Existente

Para agregar el selector de idioma a un header existente:

```tsx
import { Header } from '@/components/layout/header'
import { LanguageSelector } from '@/components/language-selector'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function AppHeader() {
  return (
    <Header>
      <div className="flex-1">
        {/* Contenido del header */}
      </div>
      
      <div className="ml-auto flex items-center space-x-4">
        <LanguageSelector />
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </Header>
  )
}
```

### Integración en Sidebar

Para agregar el selector de idioma a un sidebar:

```tsx
import { LanguageSelectorWithText } from '@/components/language-selector'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        {/* Navegación existente */}
      </nav>
      
      <div className="mt-auto p-4">
        <LanguageSelectorWithText />
      </div>
    </aside>
  )
}
```

### Integración en Configuraciones

Para agregar el selector de idioma a la página de configuraciones:

```tsx
import { useStaticTranslation } from '@/hooks/useTranslation'
import { LanguageSelectorWithText } from '@/components/language-selector'

export default function SettingsPage() {
  const { t } = useStaticTranslation()
  
  return (
    <div className="settings-page">
      <h1>{t('settings.title')}</h1>
      
      <section>
        <h2>{t('settings.language')}</h2>
        <p>{t('settings.languageDescription')}</p>
        <LanguageSelectorWithText />
      </section>
      
      {/* Otras configuraciones */}
    </div>
  )
}
```

## 🔍 Debugging

Para debuggear traducciones:

1. Abre las herramientas de desarrollador
2. Ve a la consola
3. Usa `localStorage.getItem('hoergen-locale')` para ver el idioma actual
4. Verifica que las claves de traducción existan en el archivo JSON

## 🚀 Próximos Pasos

- [ ] Implementar API de traducción automática
- [ ] Agregar soporte para pluralización
- [ ] Implementar interpolación de variables
- [ ] Agregar soporte para formatos de fecha y número
- [ ] Crear herramienta de extracción de texto estático

## 🔧 Migración de Componentes Existentes

### Paso 1: Identificar Texto Estático

Busca en tu componente texto que esté hardcodeado:

```tsx
// ❌ Antes
<h1>Welcome to Hörgen</h1>
<p>Listen to your favorite radio stations</p>

// ✅ Después
const { t } = useStaticTranslation()
<h1>{t('home.welcome')}</h1>
<p>{t('home.description')}</p>
```

### Paso 2: Agregar Traducciones

Agrega las nuevas claves al archivo `en.json`:

```json
{
  "home": {
    "welcome": "Welcome to Hörgen",
    "description": "Listen to your favorite radio stations"
  }
}
```

### Paso 3: Actualizar Otros Idiomas

Agrega las traducciones a los otros archivos de idioma o ejecuta el script de generación.

### Paso 4: Probar

Cambia el idioma en la aplicación y verifica que las traducciones funcionen correctamente.
