// Formatea el tiempo transcurrido en mm:ss
export const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

// Trunca el nombre de la estación si es muy largo
export const truncateStationName = (name: string, maxLength: number = 45) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name
}