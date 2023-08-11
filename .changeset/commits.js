function getAddMessage() {
  return `docs(changeset): add new entries`
}

function getVersionMessage(releasePlan, ...rest) {
  if (releasePlan.releases === undefined || !Array.isArray(releasePlan.releases)) {
    throw new Error('releasePlan.releases is not an array')
  }
  if (releasePlan.releases.length === 0) {
    throw new Error('Nothing to release: releasePlan.releases is empty')
  }

  const version = releasePlan.releases[0]?.newVersion

  if (version === undefined) {
    throw new Error('releasePlan.releases[0].newVersion is undefined')
  }

  const name = releasePlan.releases[0]?.name
  if (name === undefined) {
    throw new Error('releasePlan.releases[0].name is undefined')
  }

  return `chore: release ${name}@${version}`
}

module.exports = { getAddMessage, getVersionMessage }
