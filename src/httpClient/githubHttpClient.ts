import { Octokit } from 'octokit';
import { GithubTokenSchema } from './githubHttpClientSchema';

export const githubHttpClient = new Octokit({
  auth: GithubTokenSchema.parse(process.env.GITHUB_TOKEN),
});
