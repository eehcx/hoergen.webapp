export function withImageProxy(url?: string): string | undefined {
    if (!url) return undefined

    // Solo proxy si es externa (no SVG base64, ni assets locales)
    if (url.startsWith('http')) {
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&fit=cover`
    }

    return url
}
