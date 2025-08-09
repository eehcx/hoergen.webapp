export function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}