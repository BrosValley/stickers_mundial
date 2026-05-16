const fs = require('fs')
const path = require('path')

const swPath = path.join(__dirname, '..', 'public', 'sw.js')
const version = `album-${Date.now()}`

let content = fs.readFileSync(swPath, 'utf8')
content = content.replace(/const CACHE = '[^']+'/, `const CACHE = '${version}'`)
fs.writeFileSync(swPath, content)

console.log(`✓ SW cache actualizado: ${version}`)
