// Devuelve el emoji de la bandera a partir del código ISO 3166-1 alpha-2 (ej: 'US', 'MX', 'ES')
export function getFlagEmojiFromIsoCode(isoCode: string): string {
    if (!isoCode || isoCode.length !== 2) return ''
    // Asegura mayúsculas
    const codePoints = isoCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}
