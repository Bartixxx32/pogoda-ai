const fs = require("fs")
const path = require("path")

// Create directories if they don't exist
const iconsDir = path.join(__dirname, "../public/icons")
const maskableDir = path.join(__dirname, "../public/icons/maskable")

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

if (!fs.existsSync(maskableDir)) {
  fs.mkdirSync(maskableDir, { recursive: true })
}

// Define icon sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Generate placeholder files for regular icons
sizes.forEach((size) => {
  console.log(`Generating regular icon ${size}x${size}...`)
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`)

  // In a real project, you would use a tool like Sharp to convert SVG to PNG
  // For this example, we'll just create placeholder files
  fs.writeFileSync(iconPath, `This would be a ${size}x${size} regular icon`)

  console.log(`Created ${iconPath}`)
})

// Generate placeholder files for maskable icons
sizes.forEach((size) => {
  console.log(`Generating maskable icon ${size}x${size}...`)
  const iconPath = path.join(maskableDir, `maskable-${size}x${size}.png`)

  // In a real project, you would use a tool like Sharp to convert SVG to PNG
  // For this example, we'll just create placeholder files
  fs.writeFileSync(iconPath, `This would be a ${size}x${size} maskable icon`)

  console.log(`Created ${iconPath}`)
})

console.log("Icon generation complete!")

