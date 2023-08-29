import { AppError } from '../../../errors/AppError';
import { BadRequestError } from '../../../errors/BadRequestError';
import { Octokit, RequestError } from 'octokit';
import { BlobTreeData, SingleElementArray } from '../services/gitToolsService';
import { githubHttpClient } from '../../../httpClient/githubHttpClient';

export interface IGithubApiAdapter {
  createBlob(owner: string, repo: string, buffer: Buffer): Promise<string>;
  getBaseTree(owner: string, repo: string, branch: string): Promise<string>;
  createTree(
    owner: string,
    repo: string,
    baseTree: string,
    blobsShaArray: BlobTreeData[]
  ): Promise<string>;
  getRefs(
    owner: string,
    repo: string,
    branch: string
  ): Promise<SingleElementArray>;
  createCommit(
    owner: string,
    repo: string,
    commitMsg: string,
    tree: string,
    parents: SingleElementArray
  ): Promise<string>;
  updateRefs(
    owner: string,
    repo: string,
    branch: string,
    commitSha: string
  ): Promise<string>;
}

export class GithubApiAdapter implements IGithubApiAdapter {
  constructor(private readonly githubHttpClient: Octokit) {}

  async createBlob(
    owner: string,
    repo: string,
    buffer: Buffer
  ): Promise<string> {
    try {
      const { data } = await this.githubHttpClient.request(
        'POST /repos/{owner}/{repo}/git/blobs',
        {
          owner,
          repo,
          content: buffer.toString(),
          encoding: 'utf-8',
          headers: {
            'X-GitHub-Api-Version': process.env.GITHUB_API_VERSION,
          },
        }
      );

      return data.sha;
    } catch (error) {
      throw this.mapToAppError(error);
    }
  }

  async getBaseTree(
    owner: string,
    repo: string,
    branch: string
  ): Promise<string> {
    try {
      const { data } = await this.githubHttpClient.request(
        'GET /repos/{owner}/{repo}/git/trees/{branch}',
        {
          owner,
          repo,
          branch,
          headers: {
            'X-GitHub-Api-Version': process.env.GITHUB_API_VERSION,
          },
        }
      );

      return data.sha;
    } catch (error) {
      throw this.mapToAppError(error);
    }
  }

  async createTree(
    owner: string,
    repo: string,
    baseTree: string,
    blobsShaArray: BlobTreeData[]
  ): Promise<string> {
    try {
      const { data } = await this.githubHttpClient.request(
        'POST /repos/{owner}/{repo}/git/trees',
        {
          owner,
          repo,
          base_tree: baseTree,
          tree: blobsShaArray,
          headers: {
            'X-GitHub-Api-Version': process.env.GITHUB_API_VERSION,
          },
        }
      );

      return data.sha;
    } catch (error) {
      throw this.mapToAppError(error);
    }
  }

  async getRefs(
    owner: string,
    repo: string,
    branch: string
  ): Promise<SingleElementArray> {
    try {
      const { data } = await this.githubHttpClient.request(
        'GET /repos/{owner}/{repo}/git/refs/heads/{branch}',
        {
          owner,
          repo,
          branch,
        }
      );

      return [data.object.sha];
    } catch (error) {
      throw this.mapToAppError(error);
    }
  }

  async createCommit(
    owner: string,
    repo: string,
    message: string,
    tree: string,
    parents: SingleElementArray
  ): Promise<string> {
    try {
      const { data } = await this.githubHttpClient.request(
        'POST /repos/{owner}/{repo}/git/commits',
        {
          owner,
          repo,
          tree,
          message,
          parents,
          headers: {
            'X-GitHub-Api-Version': process.env.GITHUB_API_VERSION,
          },
        }
      );
      return data.sha;
    } catch (error) {
      throw this.mapToAppError(error);
    }
  }

  async updateRefs(
    owner: string,
    repo: string,
    branch: string,
    sha: string
  ): Promise<string> {
    try {
      const { data } = await this.githubHttpClient.request(
        'PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}',
        {
          owner,
          repo,
          branch,
          sha,
          headers: {
            'X-GitHub-Api-Version': process.env.GITHUB_API_VERSION,
          },
        }
      );

      return data.sha;
    } catch (error) {
      throw this.mapToAppError(error);
    }
  }

  private mapToAppError(error: unknown): AppError {
    return error instanceof RequestError
      ? new BadRequestError(error.message, error.status)
      : new AppError('Something went wrong', 500);
  }
}

export const githubApi = new GithubApiAdapter(githubHttpClient);
