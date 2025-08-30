import { useState, useCallback, useRef } from 'react'
import { RadioBrowserStation } from '@/core/types'
import { radioBrowserService } from '@/core/services'

// Definir regiones del mundo con sus coordenadas aproximadas
export const WORLD_REGIONS = {
  europe: {
    name: 'Europe',
    bounds: { lat: [35, 70], lng: [-10, 40] },
    priority: 1,
    countries: ['Germany', 'United Kingdom', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Portugal', 'Ireland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Slovakia', 'Slovenia', 'Croatia', 'Serbia', 'Bosnia and Herzegovina', 'Montenegro', 'Albania', 'North Macedonia', 'Kosovo', 'Latvia', 'Lithuania', 'Estonia', 'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Moldova', 'Ukraine', 'Belarus', 'Russia', 'Andorra', 'Monaco', 'San Marino', 'Vatican City', 'Liechtenstein', 'Faroe Islands', 'Greenland', 'Svalbard', 'Jan Mayen', 'Isle of Man', 'Jersey', 'Guernsey', 'Gibraltar', 'Ceuta', 'Melilla', 'Azores', 'Madeira', 'Canary Islands', 'Balearic Islands', 'Corsica', 'Sardinia', 'Sicily', 'Crete', 'Rhodes', 'Cyprus North', 'Northern Ireland', 'Scotland', 'Wales', 'England', 'Brittany', 'Normandy', 'Alsace', 'Lorraine', 'Burgundy', 'Provence', 'Languedoc', 'Aquitaine', 'Gascony', 'Brittany', 'Normandy', 'Alsace', 'Lorraine', 'Burgundy', 'Provence', 'Languedoc', 'Aquitaine', 'Gascony', 'Hungary', 'Czechia', 'Slovakia', 'Slovenia', 'Croatia', 'Serbia', 'Bosnia', 'Montenegro', 'Albania', 'Macedonia', 'Kosovo', 'Latvia', 'Lithuania', 'Estonia', 'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Moldova', 'Ukraine', 'Belarus', 'Russia', 'Andorra', 'Monaco', 'San Marino', 'Vatican', 'Liechtenstein', 'Faroe', 'Greenland', 'Svalbard', 'Jan Mayen', 'Isle of Man', 'Jersey', 'Guernsey', 'Gibraltar', 'Ceuta', 'Melilla', 'Azores', 'Madeira', 'Canary', 'Balearic', 'Corsica', 'Sardinia', 'Sicily', 'Crete', 'Rhodes', 'Northern Cyprus', 'Northern Ireland', 'Scotland', 'Wales', 'England', 'Brittany', 'Normandy', 'Alsace', 'Lorraine', 'Burgundy', 'Provence', 'Languedoc', 'Aquitaine', 'Gascony']
  },
  northAmerica: {
    name: 'North America',
    bounds: { lat: [15, 70], lng: [-170, -50] },
    priority: 2,
    countries: ['United States', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Bahamas', 'Barbados', 'Trinidad and Tobago', 'Grenada', 'Saint Vincent and the Grenadines', 'Saint Lucia', 'Dominica', 'Antigua and Barbuda', 'Saint Kitts and Nevis', 'Aruba', 'Curaçao', 'Bonaire', 'Sint Maarten', 'Saba', 'Sint Eustatius', 'Saint Martin', 'Saint Barthélemy', 'Guadeloupe', 'Martinique', 'Saint Pierre and Miquelon', 'Bermuda', 'Turks and Caicos Islands', 'Cayman Islands', 'British Virgin Islands', 'US Virgin Islands', 'Anguilla', 'Montserrat', 'Saint Kitts and Nevis', 'Dominica', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Grenada', 'Barbados', 'Trinidad and Tobago', 'Guyana', 'Suriname', 'French Guiana', 'Falkland Islands', 'South Georgia', 'South Sandwich Islands', 'Bouvet Island', 'Heard Island', 'McDonald Islands', 'French Southern Territories', 'British Indian Ocean Territory', 'Pitcairn Islands', 'Easter Island', 'Juan Fernández Islands', 'Galápagos Islands', 'Cocos Islands', 'Christmas Island', 'Norfolk Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'USA', 'America', 'Canadian', 'Mexican', 'Guatemalan', 'Belizean', 'Salvadoran', 'Honduran', 'Nicaraguan', 'Costa Rican', 'Panamanian', 'Cuban', 'Jamaican', 'Haitian', 'Dominican', 'Puerto Rican', 'Bahamian', 'Barbadian', 'Trinidadian', 'Tobagonian', 'Grenadian', 'Vincentian', 'Saint Lucian', 'Dominican', 'Antiguan', 'Kittitian', 'Nevisian', 'Aruban', 'Curaçaoan', 'Bonairean', 'Sint Maartener', 'Saban', 'Sint Eustatian', 'Saint Martiner', 'Saint Barthélemyan', 'Guadeloupean', 'Martinican', 'Saint Pierrean', 'Miquelonian', 'Bermudian', 'Turks and Caicos Islander', 'Caymanian', 'British Virgin Islander', 'US Virgin Islander', 'Anguillan', 'Montserratian', 'Saint Kittitian', 'Nevisian', 'Dominican', 'Saint Lucian', 'Vincentian', 'Grenadian', 'Barbadian', 'Trinidadian', 'Tobagonian', 'Guyanese', 'Surinamese', 'French Guianan', 'Falkland Islander', 'South Georgian', 'South Sandwich Islander', 'Bouvet Islander', 'Heard Islander', 'McDonald Islander', 'French Southern Territorian', 'British Indian Ocean Territorian', 'Pitcairn Islander', 'Easter Islander', 'Juan Fernández Islander', 'Galápagos Islander', 'Cocos Islander', 'Christmas Islander', 'Norfolk Islander', 'Lord Howe Islander', 'Macquarie Islander', 'Kerguelen Islander', 'Crozet Islander', 'Amsterdam Islander', 'Saint Paul Islander', 'Tristan da Cunhan', 'Gough Islander', 'Ascension Islander', 'Saint Helenan', 'Tristan da Cunhan', 'Gough Islander', 'Ascension Islander', 'Saint Helenan']
  },
  southAmerica: {
    name: 'South America',
    bounds: { lat: [-55, 15], lng: [-90, -35] },
    priority: 3,
    countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana', 'Falkland Islands', 'South Georgia', 'South Sandwich Islands', 'Bouvet Island', 'Heard Island', 'McDonald Islands', 'French Southern Territories', 'British Indian Ocean Territory', 'Pitcairn Islands', 'Easter Island', 'Juan Fernández Islands', 'Galápagos Islands', 'Cocos Islands', 'Christmas Island', 'Norfolk Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena']
  },
  asia: {
    name: 'Asia',
    bounds: { lat: [10, 80], lng: [40, 180] },
    priority: 4,
    countries: ['China', 'Japan', 'India', 'South Korea', 'Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Philippines', 'Singapore', 'Taiwan', 'Hong Kong', 'Myanmar', 'Cambodia', 'Laos', 'Brunei', 'East Timor', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Afghanistan', 'Pakistan', 'Iran', 'Iraq', 'Syria', 'Lebanon', 'Jordan', 'Israel', 'Palestine', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain', 'Kuwait', 'Armenia', 'Azerbaijan', 'Georgia', 'Abkhazia', 'South Ossetia', 'Artsakh', 'Transnistria', 'Northern Cyprus', 'Palestine', 'Israel', 'Lebanon', 'Syria', 'Iraq', 'Iran', 'Afghanistan', 'Pakistan', 'India', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia', 'Singapore', 'Brunei', 'Philippines', 'Indonesia', 'East Timor', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'New Caledonia', 'Fiji', 'Tonga', 'Samoa', 'American Samoa', 'Cook Islands', 'Niue', 'Tokelau', 'Wallis and Futuna', 'French Polynesia', 'Pitcairn Islands', 'Easter Island', 'Juan Fernández Islands', 'Galápagos Islands', 'Cocos Islands', 'Christmas Island', 'Norfolk Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena']
  },
  africa: {
    name: 'Africa',
    bounds: { lat: [-35, 35], lng: [-20, 50] },
    priority: 5,
    countries: ['South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco', 'Ghana', 'Ethiopia', 'Uganda', 'Tanzania', 'Algeria', 'Sudan', 'South Sudan', 'Libya', 'Tunisia', 'Chad', 'Niger', 'Mali', 'Burkina Faso', 'Senegal', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Togo', 'Benin', 'Cameroon', 'Central African Republic', 'Gabon', 'Republic of the Congo', 'Democratic Republic of the Congo', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Mayotte', 'Réunion', 'Cape Verde', 'São Tomé and Príncipe', 'Equatorial Guinea', 'Eritrea', 'Djibouti', 'Somalia', 'Somaliland', 'Puntland', 'Galmudug', 'Hirshabelle', 'South West State', 'Jubaland', 'Khatumo', 'Maakhir', 'Awdalland', 'Northland', 'Bari', 'Nugal', 'Mudug', 'Galguduud', 'Hiran', 'Middle Shabelle', 'Lower Shabelle', 'Lower Juba', 'Middle Juba', 'Gedo', 'Bakool', 'Bay', 'Banaadir', 'Woqooyi Galbeed', 'Togdheer', 'Sool', 'Sanaag', 'Bari', 'Nugal', 'Mudug', 'Galguduud', 'Hiran', 'Middle Shabelle', 'Lower Shabelle', 'Lower Juba', 'Middle Juba', 'Gedo', 'Bakool', 'Bay', 'Banaadir']
  },
  oceania: {
    name: 'Oceania',
    bounds: { lat: [-50, -10], lng: [110, 180] },
    priority: 6,
    countries: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'New Caledonia', 'French Polynesia', 'Samoa', 'American Samoa', 'Tonga', 'Tuvalu', 'Kiribati', 'Nauru', 'Palau', 'Micronesia', 'Marshall Islands', 'Cook Islands', 'Niue', 'Tokelau', 'Wallis and Futuna', 'Norfolk Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Bouvet Island', 'Heard Island', 'McDonald Islands', 'French Southern Territories', 'British Indian Ocean Territory', 'Pitcairn Islands', 'Easter Island', 'Juan Fernández Islands', 'Galápagos Islands', 'Cocos Islands', 'Christmas Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena']
  }
}

export interface RegionData {
  name: string
  stations: RadioBrowserStation[]
  isLoaded: boolean
  isLoading: boolean
  lastLoaded: number
}

export function useRegionBasedLoading() {
  const [regions, setRegions] = useState<Record<string, RegionData>>({})
  const [currentViewRegion, setCurrentViewRegion] = useState<string>('europe')
  const [isLoadingRegion, setIsLoadingRegion] = useState(false)
  const [totalRegionsLoaded, setTotalRegionsLoaded] = useState(0)
  const [isFullyLoaded, setIsFullyLoaded] = useState(false)
  const loadingQueue = useRef<string[]>([])
  const isProcessingQueue = useRef(false)

  // Función para determinar en qué región está el usuario basado en las coordenadas del globo
  const getRegionFromCoordinates = useCallback((lat: number, lng: number): string => {
    for (const [regionKey, region] of Object.entries(WORLD_REGIONS)) {
      const { bounds } = region
      if (lat >= bounds.lat[0] && lat <= bounds.lat[1] && 
          lng >= bounds.lng[0] && lng <= bounds.lng[1]) {
        return regionKey
      }
    }
    return 'europe' // Fallback a Europa
  }, [])

  // Función para cargar estaciones de una región específica usando Radio Browser
  const loadRegionStations = useCallback(async (regionKey: string): Promise<RadioBrowserStation[]> => {
    const region = WORLD_REGIONS[regionKey as keyof typeof WORLD_REGIONS]
    if (!region) return []

    try {
      const stations: RadioBrowserStation[] = []
      const radioBrowser = radioBrowserService
      
      // Cargar estaciones usando múltiples estrategias para más cobertura
      try {
                // Estrategia 1: Top stations generales (máximo posible)
        const popularStations = await radioBrowser.getTopStations(10000)
        console.log(`📡 Radio Browser devolvió ${popularStations.length} estaciones populares`)
        
        // Estrategia 2: Buscar por TODOS los países del mundo (no solo la región)
        const countrySpecificStations: RadioBrowserStation[] = []
        const worldCountries = [
          // Europa
          'Germany', 'United Kingdom', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Portugal', 'Ireland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Slovakia', 'Slovenia', 'Croatia', 'Serbia', 'Bosnia', 'Montenegro', 'Albania', 'Macedonia', 'Kosovo', 'Latvia', 'Lithuania', 'Estonia', 'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Moldova', 'Ukraine', 'Belarus', 'Russia', 'Andorra', 'Monaco', 'San Marino', 'Vatican', 'Liechtenstein', 'Faroe', 'Greenland', 'Svalbard', 'Jan Mayen', 'Isle of Man', 'Jersey', 'Guernsey', 'Gibraltar', 'Ceuta', 'Melilla', 'Azores', 'Madeira', 'Canary', 'Balearic', 'Corsica', 'Sardinia', 'Sicily', 'Crete', 'Rhodes', 'Northern Cyprus', 'Northern Ireland', 'Scotland', 'Wales', 'England', 'Brittany', 'Normandy', 'Alsace', 'Lorraine', 'Burgundy', 'Provence', 'Languedoc', 'Aquitaine', 'Gascony',
          // Norteamérica
          'United States', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Bahamas', 'Barbados', 'Trinidad', 'Tobago', 'Grenada', 'Saint Vincent', 'Saint Lucia', 'Dominica', 'Antigua', 'Saint Kitts', 'Nevis', 'Aruba', 'Curaçao', 'Bonaire', 'Sint Maarten', 'Saba', 'Sint Eustatius', 'Saint Martin', 'Saint Barthélemy', 'Guadeloupe', 'Martinique', 'Saint Pierre', 'Miquelon', 'Bermuda', 'Turks', 'Caicos', 'Cayman', 'British Virgin', 'US Virgin', 'Anguilla', 'Montserrat',
          // Sudamérica
          'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana', 'Falkland', 'South Georgia', 'South Sandwich', 'Bouvet', 'Heard', 'McDonald', 'French Southern', 'British Indian Ocean', 'Pitcairn', 'Easter Island', 'Juan Fernández', 'Galápagos', 'Cocos', 'Christmas', 'Norfolk', 'Lord Howe', 'Macquarie', 'Kerguelen', 'Crozet', 'Amsterdam', 'Saint Paul', 'Tristan da Cunha', 'Gough', 'Ascension', 'Saint Helena',
          // Asia
          'China', 'Japan', 'India', 'South Korea', 'Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Philippines', 'Singapore', 'Taiwan', 'Hong Kong', 'Myanmar', 'Cambodia', 'Laos', 'Brunei', 'East Timor', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Afghanistan', 'Pakistan', 'Iran', 'Iraq', 'Syria', 'Lebanon', 'Jordan', 'Israel', 'Palestine', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain', 'Kuwait', 'Armenia', 'Azerbaijan', 'Georgia', 'Abkhazia', 'South Ossetia', 'Artsakh', 'Transnistria', 'Northern Cyprus',
          // África
          'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco', 'Ghana', 'Ethiopia', 'Uganda', 'Tanzania', 'Algeria', 'Sudan', 'South Sudan', 'Libya', 'Tunisia', 'Chad', 'Niger', 'Mali', 'Burkina Faso', 'Senegal', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Togo', 'Benin', 'Cameroon', 'Central African Republic', 'Gabon', 'Republic of the Congo', 'Democratic Republic of the Congo', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Mayotte', 'Réunion', 'Cape Verde', 'São Tomé', 'Equatorial Guinea', 'Eritrea', 'Djibouti', 'Somalia', 'Somaliland', 'Puntland', 'Galmudug', 'Hirshabelle', 'South West State', 'Jubaland', 'Khatumo', 'Maakhir', 'Awdalland', 'Northland', 'Bari', 'Nugal', 'Mudug', 'Galguduud', 'Hiran', 'Middle Shabelle', 'Lower Shabelle', 'Lower Juba', 'Middle Juba', 'Gedo', 'Bakool', 'Bay', 'Banaadir', 'Woqooyi Galbeed', 'Togdheer', 'Sool', 'Sanaag',
          // Oceanía
          'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'New Caledonia', 'French Polynesia', 'Samoa', 'American Samoa', 'Tonga', 'Tuvalu', 'Kiribati', 'Nauru', 'Palau', 'Micronesia', 'Marshall Islands', 'Cook Islands', 'Niue', 'Tokelau', 'Wallis and Futuna', 'Norfolk Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena', 'Bouvet Island', 'Heard Island', 'McDonald Islands', 'French Southern Territories', 'British Indian Ocean Territory', 'Pitcairn Islands', 'Easter Island', 'Juan Fernández Islands', 'Galápagos Islands', 'Cocos Islands', 'Christmas Island', 'Lord Howe Island', 'Macquarie Island', 'Kerguelen Islands', 'Crozet Islands', 'Amsterdam Island', 'Saint Paul Island', 'Tristan da Cunha', 'Gough Island', 'Ascension Island', 'Saint Helena'
        ]
        
        // Buscar por países en paralelo para mayor velocidad
        const countryPromises = worldCountries.map(async (country) => {
          try {
            const countryStations = await radioBrowser.searchStations(`country:"${country}"`, 30)
            console.log(`🇺🇸 Encontradas ${countryStations.length} estaciones para ${country}`)
            return countryStations
          } catch (error) {
            console.warn(`Error buscando estaciones para ${country}:`, error)
            return []
          }
        })
        
        const countryResults = await Promise.all(countryPromises)
        countryResults.forEach(stations => countrySpecificStations.push(...stations))
        
        // Estrategia 3: Buscar por códigos ISO comunes (en paralelo)
        const isoStations: RadioBrowserStation[] = []
        const commonISOs = ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'CA', 'AU', 'JP', 'CN', 'IN', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR', 'GF', 'FK', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'KR', 'TW', 'HK', 'MM', 'KH', 'LA', 'BN', 'TL', 'PG', 'SB', 'VU', 'NC', 'PF', 'WS', 'AS', 'TO', 'TV', 'KI', 'NR', 'PW', 'FM', 'MH', 'CK', 'NU', 'TK', 'WF', 'ZA', 'NG', 'EG', 'KE', 'MA', 'GH', 'ET', 'UG', 'TZ', 'DZ', 'SD', 'SS', 'LY', 'TN', 'TD', 'NE', 'ML', 'BF', 'SN', 'GN', 'GW', 'SL', 'LR', 'CI', 'TG', 'BJ', 'CM', 'CF', 'GA', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'BW', 'NA', 'LS', 'SZ', 'MG', 'MU', 'SC', 'KM', 'YT', 'RE', 'CV', 'ST', 'GQ', 'ER', 'DJ', 'SO', 'RU', 'UA', 'BY', 'MD', 'AM', 'AZ', 'GE', 'KZ', 'UZ', 'KG', 'TJ', 'TM', 'AF', 'PK', 'IR', 'IQ', 'SY', 'LB', 'JO', 'IL', 'PS', 'SA', 'YE', 'OM', 'AE', 'QA', 'BH', 'KW', 'HU', 'NZ', 'PL', 'CZ', 'SK', 'HR', 'SI', 'ME', 'BA', 'MK', 'AL', 'RO', 'BG', 'GR', 'PT', 'IE', 'DK', 'SE', 'NO', 'FI', 'IS', 'LU', 'MT', 'CY', 'MD', 'UA', 'BY', 'RU', 'AD', 'MC', 'SM', 'VA', 'LI', 'FO', 'GL', 'SJ', 'IM', 'JE', 'GG', 'GI', 'ES-CE', 'ES-ML', 'ES-AZ', 'ES-MD', 'ES-CN', 'ES-IC', 'ES-BI', 'ES-SC', 'ES-GC', 'ES-TF', 'ES-LO', 'ES-PM', 'ES-FO', 'ES-CA', 'ES-IB', 'ES-ME', 'ES-CU', 'ES-AB', 'ES-AS', 'ES-EX', 'ES-BA', 'ES-JA', 'ES-MA', 'ES-AL', 'ES-CR', 'ES-CO', 'ES-GR', 'ES-HU', 'ES-JA', 'ES-MA', 'ES-MU', 'ES-PO', 'ES-SA', 'ES-SE', 'ES-TO', 'ES-ZA']
        
        const isoPromises = commonISOs.map(async (iso) => {
          try {
            const isoStationsResult = await radioBrowser.searchStations(`countrycode:"${iso}"`, 30)
            console.log(`🏳️ Encontradas ${isoStationsResult.length} estaciones para ISO ${iso}`)
            return isoStationsResult
          } catch (error) {
            console.warn(`Error buscando estaciones para ISO ${iso}:`, error)
            return []
          }
        })
        
        const isoResults = await Promise.all(isoPromises)
        isoResults.forEach(stations => isoStations.push(...stations))
        
        // Combinar todas las estrategias
        const allStations = [...popularStations, ...countrySpecificStations, ...isoStations]
        console.log(`🔄 Total de estaciones a procesar: ${allStations.length}`)
        
        // NO filtrar por región - usar todas las estaciones para mayor cobertura
        const regionStations = allStations
        console.log(`🌍 Usando todas las ${regionStations.length} estaciones para región ${region.name} (sin filtro de región)`)
        
        // Filtro de calidad MUY permisivo para capturar más estaciones
        const qualityStations = regionStations.filter(station => 
          station.name && 
          station.name.trim() !== '' && 
          station.country && 
          station.url_resolved &&
          station.name.length >= 1 && // Reducido a 1 carácter
          !station.name.toLowerCase().includes('test') &&
          !station.name.toLowerCase().includes('error') &&
          !station.name.toLowerCase().includes('null') &&
          !station.name.toLowerCase().includes('undefined')
          // Solo filtros básicos para máxima cobertura
        )
        
        console.log(`✅ ${qualityStations.length} estaciones pasaron el filtro de calidad`)
        
        stations.push(...qualityStations)
        
      } catch (error) {
        console.warn(`Error cargando estaciones para ${regionKey}:`, error)
      }

      // Eliminar duplicados
      const uniqueStations = stations.reduce((unique, station) => {
        const isDuplicate = unique.some(s => s.stationuuid === station.stationuuid)
        if (!isDuplicate) {
          unique.push(station)
        }
        return unique
      }, [] as RadioBrowserStation[])

      // Límite más flexible: 15-25 estaciones por país para mejor distribución
      const stationsByCountry = new Map<string, RadioBrowserStation[]>()
      
      uniqueStations.forEach(station => {
        if (station.country) {
          if (!stationsByCountry.has(station.country)) {
            stationsByCountry.set(station.country, [])
          }
          const countryStations = stationsByCountry.get(station.country)!
          // Límite variable: países pequeños 25, países grandes 15
          const maxStations = countryStations.length < 10 ? 25 : 15
          if (countryStations.length < maxStations) {
            countryStations.push(station)
          }
        }
      })

      // Convertir de vuelta a array
      const limitedStations = Array.from(stationsByCountry.values()).flat()
      
      // Log de países encontrados
      const countriesFound = Array.from(stationsByCountry.keys())
      console.log(`✅ Cargadas ${limitedStations.length} estaciones para ${region.name} (${countriesFound.length} países)`)
      console.log(`🌍 Países encontrados: ${countriesFound.slice(0, 15).join(', ')}${countriesFound.length > 15 ? '...' : ''}`)
      
      return limitedStations

    } catch (error) {
      console.error(`Error loading stations for region ${regionKey}:`, error)
      return []
    }
  }, [])

    // Función para procesar la cola de carga
  const processLoadingQueue = useCallback(async () => {
    console.log('🔄 Procesando cola de carga...', {
      isProcessing: isProcessingQueue.current,
      queueLength: loadingQueue.current.length
    })
    
    if (isProcessingQueue.current || loadingQueue.current.length === 0) {
      console.log('⏸️ No procesando cola:', {
        isProcessing: isProcessingQueue.current,
        queueEmpty: loadingQueue.current.length === 0
      })
      return
    }

    isProcessingQueue.current = true
    setIsLoadingRegion(true)

    while (loadingQueue.current.length > 0) {
      const regionKey = loadingQueue.current.shift()!
      console.log(`🌍 Procesando región: ${regionKey}`)

      if (!regions[regionKey]?.isLoaded) {
        console.log(`📡 Cargando estaciones para ${regionKey}...`)
        
        setRegions(prev => ({
          ...prev,
          [regionKey]: {
            ...prev[regionKey],
            isLoading: true
          }
        }))

        try {
          const stations = await loadRegionStations(regionKey)
          console.log(`✅ Cargadas ${stations.length} estaciones para ${regionKey}`)

          setRegions(prev => ({
            ...prev,
            [regionKey]: {
              name: WORLD_REGIONS[regionKey as keyof typeof WORLD_REGIONS].name,
              stations,
              isLoaded: true,
              isLoading: false,
              lastLoaded: Date.now()
            }
          }))
          
          // Contar regiones cargadas
          setTotalRegionsLoaded(prev => {
            const newTotal = prev + 1
            if (newTotal === Object.keys(WORLD_REGIONS).length) {
              setIsFullyLoaded(true)
              console.log('🎉 Todas las regiones han sido cargadas completamente')
            }
            return newTotal
          })
        } catch (error) {
          console.error(`❌ Error cargando región ${regionKey}:`, error)
          setRegions(prev => ({
            ...prev,
            [regionKey]: {
              name: WORLD_REGIONS[regionKey as keyof typeof WORLD_REGIONS].name,
              stations: [],
              isLoaded: true, // Marcar como cargada aunque haya fallado
              isLoading: false,
              lastLoaded: Date.now()
            }
          }))
        }
      } else {
        console.log(`✅ Región ${regionKey} ya está cargada`)
      }
    }

    console.log('🏁 Cola de carga procesada completamente')
    setIsLoadingRegion(false)
    isProcessingQueue.current = false
  }, [regions, loadRegionStations])

  // Función para cambiar la región visible y cargar si es necesario
  const changeViewRegion = useCallback(async (regionKey: string) => {
    if (regionKey === currentViewRegion) return

    setCurrentViewRegion(regionKey)
    
    // Si la región no está cargada, agregarla a la cola
    if (!regions[regionKey]?.isLoaded && !loadingQueue.current.includes(regionKey)) {
      loadingQueue.current.push(regionKey)
      processLoadingQueue()
    }
  }, [currentViewRegion, regions, processLoadingQueue])

  // Función para obtener todas las estaciones cargadas
  const getAllLoadedStations = useCallback((): RadioBrowserStation[] => {
    return Object.values(regions)
      .filter(region => region.isLoaded)
      .flatMap(region => region.stations)
  }, [regions])

  // Función para obtener estaciones de una región específica
  const getRegionStations = useCallback((regionKey: string): RadioBrowserStation[] => {
    return regions[regionKey]?.stations || []
  }, [regions])

  // Función para verificar si una región está cargando
  const isRegionLoading = useCallback((regionKey: string): boolean => {
    return regions[regionKey]?.isLoading || false
  }, [regions])

  // Función para verificar si una región está cargada
  const isRegionLoaded = useCallback((regionKey: string): boolean => {
    return regions[regionKey]?.isLoaded || false
  }, [regions])

  // Cargar todas las estaciones de Radio Browser de una vez
  const initializeDefaultRegion = useCallback(async () => {
    console.log('🌍 Inicializando carga de todas las estaciones de Radio Browser...')
    
    // Cargar todas las regiones de una vez
    const allRegions = Object.keys(WORLD_REGIONS)
    loadingQueue.current.push(...allRegions)
    console.log('📋 Agregadas todas las regiones a la cola de carga:', allRegions)
    processLoadingQueue()
  }, [processLoadingQueue])

  return {
    regions,
    currentViewRegion,
    isLoadingRegion,
    changeViewRegion,
    getAllLoadedStations,
    getRegionStations,
    isRegionLoading,
    isRegionLoaded,
    initializeDefaultRegion,
    getRegionFromCoordinates,
    totalRegionsLoaded,
    isFullyLoaded
  }
}
