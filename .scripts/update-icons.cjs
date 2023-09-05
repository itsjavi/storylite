const fs = require('fs')
const https = require('https')
const path = require('path')

// Default lucide-react icons. Get more: https://lucide.dev/icons/
const defaultIcons = [
  'bookmark',
  'box',
  'box-select',
  'contrast',
  'expand',
  'external-link',
  'github',
  'grid-3x3',
  'minus-square',
  'monitor-smartphone',
  'moon',
  'plus-square',
  'sun',
  'x-circle',
  'zap',
]

const CWD = process.cwd()

defaultIcons.map(icon => {
  const svgPath = path.resolve(
    path.join(CWD, 'packages', 'storylite', 'assets', 'lucide', 'svg', `${icon}.svg`),
  )
  const file = fs.createWriteStream(svgPath)

  https.get(
    `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/${icon}.svg`,
    response => {
      response.pipe(file)

      file
        .on('finish', () => {
          file.close()
          console.log(`${icon} downloaded to: ${svgPath}`)
        })
        .on('error', err => {
          fs.unlink(svgPath)
          console.error(err.message)
          process.exit(1)
        })
    },
  )
})
