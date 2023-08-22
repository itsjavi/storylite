const fs = require('fs')
const path = require('path')
const semver = require('semver')

// Read the root package.json to get the current version
const CWD = process.cwd()
const rootPackagePath = path.resolve(path.join(CWD, 'package.json'))
const rootPackageContent = fs.readFileSync(rootPackagePath, 'utf-8')
const rootPackage = JSON.parse(rootPackageContent)
const currentVersion = rootPackage.version || '0.0.0'

// Get the desired level from the command line argument (default to "patch")
const desiredLevel = process.argv[2] || 'patch'

if (desiredLevel === 'current') {
  console.log(currentVersion)
  process.exit(0)
}

// Calculate the next version based on the desired level
const nextVersion = semver.inc(currentVersion, desiredLevel)

if (!nextVersion) {
  console.error('Invalid version level specified. Please use "patch", "minor", or "major".')
  process.exit(1)
}

console.log(nextVersion)
