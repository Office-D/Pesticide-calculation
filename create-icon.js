// Create simple base64 encoded SVG icon
const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24'>
  <rect width='24' height='24' fill='#27ae60' rx='4' ry='4'/>
  <path fill='white' d='M7,16h10V14H7V16z M7,13h10v-2H7V13z M7,7v3h10V7H7z'/>
  <circle cx='17' cy='17' r='5' fill='#e8f5e9'/>
  <text x='17' y='19.5' font-family='sans-serif' font-size='7' fill='#27ae60' text-anchor='middle'>×</text>
</svg>`;

// Convert SVG to Base64
const base64SVG = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = 192;
canvas.height = 192;
const ctx = canvas.getContext('2d');

// Draw image and save as PNG
const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, 192, 192);
  const pngUrl = canvas.toDataURL('image/png');
  
  // Output info for debugging
  console.log('Icon created');
};
img.src = base64SVG;

// Cannot save directly in browser context without user interaction,
// but in a Node.js environment, we could use fs to save the PNG file

