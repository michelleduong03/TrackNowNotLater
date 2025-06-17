export function generatePastelColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = Math.floor((360 / numColors) * i);
    colors.push(`hsl(${hue}, 50%, 80%)`); 
  }
  
  return colors;
}
