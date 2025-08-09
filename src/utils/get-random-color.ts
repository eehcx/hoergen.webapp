// Color palette for genre cards
const genreColors = [
    'from-blue-500/20 to-blue-600/20',
    'from-purple-500/20 to-purple-600/20',
    'from-red-500/20 to-red-600/20',
    'from-green-500/20 to-green-600/20',
    'from-orange-500/20 to-orange-600/20',
    'from-yellow-500/20 to-yellow-600/20',
    'from-pink-500/20 to-pink-600/20',
    'from-indigo-500/20 to-indigo-600/20',
    'from-cyan-500/20 to-cyan-600/20',
    'from-teal-500/20 to-teal-600/20'
]

// Function to get random color for a genre
export function getRandomColor (): string {
    const randomIndex = Math.floor(Math.random() * genreColors.length)
    return genreColors[randomIndex]
}