import * as core from '@actions/core'
import * as gh from '@actions/github'
import {findIssueNumber, buildNewDescription} from './helpers'

async function run(): Promise<void> {
  try {
    if (gh.context.actor === 'dependabot[bot]') {
      core.info('Skipping for dependabot pull requests')
    }

    if (!gh.context.payload.pull_request) {
      throw Error('This action is applicable only to PRs')
    }
    const token = core.getInput('token')
    if (!token) {
      throw Error('Missing github token')
    }
    const owner = gh.context.repo.owner
    const repo = gh.context.repo.repo
    const prNumber = gh.context.payload.pull_request.number
    const commitMessage = await getCommitMessages(token, owner, repo, prNumber)
    const prDescription = gh.context.payload.pull_request.body
    const issue = findIssueNumber(commitMessage)
    if (!issue) {
      core.info('Missing issue in last commit. Skiping connecting')
      return
    }
    const newDescription = buildNewDescription(issue, prDescription)
    const response = await gh.getOctokit(token).rest.pulls.update({
      owner: gh.context.repo.owner,
      repo: gh.context.repo.repo,
      pull_number: gh.context.payload.pull_request.number,
      body: newDescription
    })
    if (response.status >= 300) {
      throw Error(
        `Something went wrong. Can not update PR. Resposne code: ${response.status}`
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function getCommitMessages(
  token: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<string> {
  core.debug('-> Get commit message')
  const query = `
  query commitMessages($owner: String!, $repo: String!, $prNumber: Int!, $numberOfCommits: Int = 100) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $prNumber) {
        commits(last: $numberOfCommits) {
          edges {
            node {
              commit {
                message
              }
            }
          }
        }
      }
    }
  }
  `
  const params = {
    owner,
    repo,
    prNumber
  }
  core.debug(`Query params: ${JSON.stringify(params)}`)
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const response: any = await gh.getOctokit(token).graphql(query, params)

  core.debug(`Response: ${JSON.stringify(response)}`)
  const messages: string[] = response.repository.pullRequest.commits.edges.map(
    function (edge: EdgeItem): string {
      return edge.node.commit.message
    }
  )
  core.debug('-< Get commit message')
  if (messages.length === 0) {
    throw Error('Missing commits in PR')
  } else {
    return messages[messages.length - 1]
  }
}

interface EdgeItem {
  node: {
    commit: {
      message: string
    }
  }
}

run()
