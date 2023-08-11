function getAddMessage() {
  return `docs(changeset): add new entries`
}

function getVersionMessage(releasePlan) {
  const releasePlanTxt = String(releasePlan)
  const parts = releasePlanTxt.split('@')
  const versionParts = parts[parts.length - 1].split('\n')
  const version = versionParts[0] ?? 'new version'
  return `chore: release v${version}`
}

module.exports = { getAddMessage, getVersionMessage }
