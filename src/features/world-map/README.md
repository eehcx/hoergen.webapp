# 🌍 Globo Terrestre de Estaciones

## Descripción

El Globo Terrestre de Estaciones es una funcionalidad interactiva que permite a los usuarios explorar todas las estaciones de radio disponibles en la plataforma Hoergen, organizadas por país en un globo terráqueo 3D interactivo.

## Características

- **Globo Terrestre 3D**: Utiliza react-globe.gl para mostrar un globo terráqueo interactivo y realista
- **Puntos por País**: Cada país con estaciones se representa con un punto 3D en el globo
- **Tamaño Dinámico**: El tamaño del punto varía según la cantidad de estaciones en el país
- **Colores por Densidad**: Los puntos cambian de color según la cantidad de estaciones:
  - 🔵 Azul: 1-5 estaciones
  - 🟡 Amarillo: 6-10 estaciones
  - 🔴 Rojo: Más de 10 estaciones
- **Panel Lateral**: Muestra estadísticas globales y top países
- **Modal de Detalles**: Al hacer clic en un país, se muestra un modal con todas las estaciones
- **Navegación Directa**: Los usuarios pueden ir directamente a cualquier estación desde el globo

## Tecnologías Utilizadas

- **React Globe.gl**: Para la funcionalidad del globo terráqueo 3D
- **Three.js**: Motor 3D para renderizado del globo
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos y diseño responsivo
- **Lucide React**: Para iconos

## Estructura de Archivos

```
src/features/world-map/
├── index.tsx          # Componente principal del mapa
├── index.ts           # Exportaciones
├── world-map.css      # Estilos personalizados
└── README.md          # Esta documentación
```

## Uso

### Navegación

1. **Desde el Header**: El globo está disponible en la navegación principal con el enlace "🌍 Mapa"
2. **Desde la Página Principal**: Hay un banner destacado que lleva al globo terrestre
3. **URL Directa**: `/world-map`

### Interacción con el Globo

1. **Ver Puntos**: Los países con estaciones se muestran como puntos 3D en el globo
2. **Hacer Clic en un País**: Abre un modal con todas las estaciones de ese país
3. **Ver Estaciones**: En el modal se muestran todas las estaciones con información básica
4. **Ir a una Estación**: Hacer clic en cualquier estación lleva a su página de detalles
5. **Rotar el Globo**: Arrastra para rotar y hacer zoom en el globo terráqueo

### Panel Lateral

- **Estadísticas Globales**: Total de estaciones, países y promedio por país
- **Top Países**: Lista de los 5 países con más estaciones
- **Navegación Rápida**: Hacer clic en un país del top abre su modal de detalles

## API y Datos

### Servicios Utilizados

- `StationService`: Para obtener todas las estaciones
- `CountryService`: Para obtener información de países

### Estructura de Datos

```typescript
interface CountryStationData {
  countryId: string
  countryName: string
  countryIsoCode: string
  stationCount: number
  stations: ResponseStationDto[]
  coordinates: [number, number]
}
```

### Coordenadas de Países

El mapa incluye coordenadas predefinidas para más de 100 países, mapeando códigos ISO a coordenadas de latitud y longitud.

## Personalización

### Estilos CSS

Los estilos personalizados están en `world-map.css` e incluyen:

- Estilos para popups de Leaflet
- Animaciones para modales
- Efectos hover para marcadores
- Temas claro/oscuro
- Diseño responsivo

### Colores de Marcadores

Los colores se pueden personalizar modificando la lógica en el componente:

```typescript
fillColor={country.stationCount > 10 ? '#ef4444' : country.stationCount > 5 ? '#f59e0b' : '#3b82f6'}
```

## Responsividad

El mapa se adapta a diferentes tamaños de pantalla:

- **Desktop**: Mapa completo con panel lateral
- **Tablet**: Layout adaptativo
- **Mobile**: Mapa a pantalla completa con navegación optimizada

## Rendimiento

- **Lazy Loading**: Los datos se cargan solo cuando es necesario
- **Optimización de Marcadores**: Uso de `CircleMarker` para mejor rendimiento
- **Caché de Datos**: Los datos se mantienen en estado local durante la sesión

## Dependencias

```json
{
  "react-globe.gl": "^2.32.0",
  "three": "^0.158.0"
}
```

## Instalación

Las dependencias se instalan automáticamente con:

```bash
npm install react-globe.gl three
```

## Solución de Problemas

### El mapa no se muestra

1. Verificar que las dependencias estén instaladas
2. Comprobar que el CSS de Leaflet esté importado
3. Verificar que no haya errores en la consola del navegador

### Los marcadores no aparecen

1. Verificar que el servicio de estaciones esté funcionando
2. Comprobar que las coordenadas de países estén definidas
3. Verificar que las estaciones tengan `countryId` válidos

### Problemas de rendimiento

1. Reducir el zoom inicial del mapa
2. Limitar la cantidad de marcadores mostrados
3. Implementar clustering para muchos marcadores

## Futuras Mejoras

- [ ] Implementar clustering de marcadores para mejor rendimiento
- [ ] Agregar filtros por género de música
- [ ] Implementar búsqueda de países
- [ ] Agregar estadísticas por continente
- [ ] Implementar modo offline con datos cacheados
- [ ] Agregar animaciones de entrada para marcadores
- [ ] Implementar modo de pantalla completa
- [ ] Agregar exportación de datos del mapa
