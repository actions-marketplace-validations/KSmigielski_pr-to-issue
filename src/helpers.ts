export function findIssueNumber(message: string): string | undefined {
  const parts = message.split(' ')
  const regex = new RegExp(`^${issueRegex}$`, 'g')
  return parts.find(part => regex.test(part))
}

export function buildNewDescription(
  issue: string,
  descirption: string | undefined
): string {
  if (descirption && descirption !== '') {
    for (const keyword of closeKewords) {
      const regex = new RegExp(`${keyword} ${issueRegex}`, 'gi')
      if (regex.test(descirption)) {
        return descirption
      }
    }
    return `${descirption}\r\n\r\nResolve ${issue}`
  } else {
    return `Resolve ${issue}`
  }
}

const issueRegex = '(([\\w\\-]+/){2}|)#\\d+'

const closeKewords = [
  'close',
  'closes',
  'closed',
  'fix',
  'fixes',
  'fixed',
  'resolve',
  'resolves',
  'resolved'
]
