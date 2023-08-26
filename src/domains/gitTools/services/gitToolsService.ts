import { IGithubApiAdapter, githubApi } from '../adapters/githubApiAdapter';
import { FileInformation, RepoInformation } from '../schemas/postCommitSchema';

export type BlobTreeData = {
  path: string;
  mode: '100644';
  type: 'blob';
  sha: string;
};

export type SingleElementArray = [string];

export interface IGitToolsService {
  createCommit(
    repoInfo: RepoInformation,
    file: FileInformation
  ): Promise<string>;
  sendMultipleFiles(): Promise<void>;
  createBlob(owner: string, repo: string, buffer: Buffer): Promise<string>;
  baseTree(owner: string, repo: string, branch: string): Promise<string>;
  createTree(
    owner: string,
    repo: string,
    baseTree: string,
    blobsSha: string[],
    path: string
  ): Promise<string>;
  getRefs(
    owner: string,
    repo: string,
    branch: string
  ): Promise<SingleElementArray>;
  commit(
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

export class GitToolsService implements IGitToolsService {
  constructor(private readonly githubApi: IGithubApiAdapter) {}

  async createCommit(
    repoInfo: RepoInformation,
    file: FileInformation
  ): Promise<string> {
    const { branch, commitMsg, githubToken, owner, repo, path } = repoInfo;

    const blobSha = await this.createBlob(owner, repo, file.buffer);
    const baseTreeSha = await this.baseTree(owner, repo, branch);
    const treeSha = await this.createTree(
      owner,
      repo,
      baseTreeSha,
      [blobSha],
      path
    );
    const refsSha = await this.getRefs(owner, repo, branch);
    const commitSha = await this.commit(
      owner,
      repo,
      commitMsg,
      treeSha,
      refsSha
    );

    return await this.updateRefs(owner, repo, branch, commitSha);
  }

  async sendMultipleFiles(): Promise<void> {}

  async createBlob(
    owner: string,
    repo: string,
    buffer: Buffer
  ): Promise<string> {
    return await this.githubApi.createBlob(owner, repo, buffer);
  }

  async baseTree(owner: string, repo: string, branch: string): Promise<string> {
    return await this.githubApi.getBaseTree(owner, repo, branch);
  }

  async createTree(
    owner: string,
    repo: string,
    baseTree: string,
    blobsSha: string[],
    path: string
  ): Promise<string> {
    const blobs = this.createBlobTreeObject(blobsSha, path);

    return await this.githubApi.createTree(owner, repo, baseTree, blobs);
  }

  async getRefs(
    owner: string,
    repo: string,
    branch: string
  ): Promise<SingleElementArray> {
    return await this.githubApi.getRefs(owner, repo, branch);
  }

  async commit(
    owner: string,
    repo: string,
    commitMsg: string,
    tree: string,
    parents: SingleElementArray
  ): Promise<string> {
    return await this.githubApi.createCommit(
      owner,
      repo,
      commitMsg,
      tree,
      parents
    );
  }

  async updateRefs(
    owner: string,
    repo: string,
    branch: string,
    commitSha: string
  ): Promise<string> {
    return await this.githubApi.updateRefs(owner, repo, branch, commitSha);
  }

  private createBlobTreeObject(
    shaArray: string[],
    path: string
  ): BlobTreeData[] {
    return shaArray.map((sha) => ({
      path,
      sha,
      type: 'blob',
      mode: '100644',
    }));
  }
}

export const gitToolsService = new GitToolsService(githubApi);
