import * as core from '@actions/core'
import { GithubEventInterceptor } from './types'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import { Octokit } from '@octokit/rest'
import { Inputs } from '../types'

export default abstract class AbstractInterceptor implements GithubEventInterceptor {
  protected payload?: WebhookPayload
  protected testRegex
  protected owner?: string
  protected repo?: string
  protected issue_number?: number
  protected comment_id?: number
  protected octokit

  public constructor() {
    try {
      const regex = core.getInput(Inputs.test_regex)
      if (!regex || !regex.trim()) throw `${Inputs.test_regex} is required`
      const match = regex.match(/\/(.+)\/(\w+)?/)
      if (!match || !match.length) throw `${Inputs.test_regex} is illegal, it should be like /regex/i`
      const pattern = match[1]
      const flags = match[2]
      this.testRegex = new RegExp(pattern, flags)
      const token = core.getInput(Inputs.token)
      this.octokit = new Octokit({ auth: `token ${token}` })
    } catch (e: any) {
      core.setFailed(e.message)
      throw e
    }
  }

  getIssue(): string {
    return `issue#${this.issue_number}`
  }

  getComment(): string {
    return this.getIssue() + `.comment#${this.comment_id}`
  }

  initPayload(payload: WebhookPayload): void {
    this.payload = payload
    this.owner = payload.repository?.owner.login
    this.repo = payload.repository?.name
    this.issue_number = payload.issue?.number
    this.comment_id = payload.comment?.id
  }

  abstract eventName: string

  abstract intercept(): Promise<void>
}
