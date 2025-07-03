const COLORS = [
  "#FF6B6B", // rojo coral vibrante
  "#F79E44", // naranja cálido sobrio
  "#F2D43D", // amarillo mostaza moderno
  "#6DD47E", // verde menta suave
  "#38B6FF", // azul brillante balanceado
  "#A389F4", // violeta lavanda editorial
  "#F472B6", // rosa fucsia pálido
  "#7DD3FC", // azul cielo lavado
  "#E879F9", // lila brillante
  "#5EEAD4", // turquesa neutro
  "#F97316", // naranja sunset
  "#C084FC", // púrpura suave
  "#4ADE80", // verde brillante natural
  "#60A5FA", // azul limpio
  "#FCA5A5", // rosa viejo sobrio
  "#A3E635", // verde lima editorial
  "#FACC15", // amarillo vibrante controlado
  "#FBBF24", // dorado saturado medio
  "#3B82F6", // azul accesible
  "#F87171"  // rojo pastel
];

// Simple hash function (puedes mejorarla si quieres)
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export function getUserColor(userIdOrName: string): string {
  const hash = hashString(userIdOrName)
  return COLORS[hash % COLORS.length]
}
