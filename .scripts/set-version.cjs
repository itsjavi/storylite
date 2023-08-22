const fs = require('fs')
const path = require('path')
const semver = require('semver')

// Read the root package.json
const CWD = process.cwd()
const rootPackagePath = path.resolve(path.join(CWD, 'package.json'))
const rootPackageContent = fs.readFileSync(rootPackagePath, 'utf-8')
const rootPackage = JSON.parse(rootPackageContent)

// Get the version from the command line argument
const desiredVersion = process.argv[2]

// Check if the desired version is a valid semver
if (!semver.valid(desiredVersion)) {
  console.error('Invalid version format. Please provide a valid semver version.')
  process.exit(1)
}

// Set the desired version in the package.json
rootPackage.version = desiredVersion

// Write the updated package.json back to the file
fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n')

console.log(`Version updated to: ${desiredVersion}`)
