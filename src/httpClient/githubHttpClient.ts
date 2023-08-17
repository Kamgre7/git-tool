import { Octokit } from 'octokit';

export const githubHttpClient = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
