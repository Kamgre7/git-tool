import { IGithubApiAdapter, githubApi } from '../adapters/githubApiAdapter';
import { FileInformation, RepoInformation } from '../schemas/postCommitSchema';

export type BlobTreeData = {
  path: string;
  mode: '100644';
  type: 'blob';
  sha: string;
};

export type SingleElementArray = [string];

export type BlobShaWithFilename = {
  sha: string;
  filename: string;
};

export interface IGitToolsService {
  createCommit(
    repoInfo: RepoInformation,
    file: FileInformation
  ): Promise<string>;
  sendMultipleFiles(): Promise<void>;
}

export class GitToolsService implements IGitToolsService {
  constructor(private readonly githubApi: IGithubApiAdapter) {}

  async createCommit(
    repoInfo: RepoInformation,
    file: FileInformation
  ): Promise<string> {
    const { branch, commitMsg, githubToken, owner, repo, path } = repoInfo;

    const blobSha = await this.githubApi.createBlob(owner, repo, file.buffer);

    const baseTreeSha = await this.githubApi.getBaseTree(owner, repo, branch);

    const blobs = this.createBlobTreeObject(
      [{ sha: blobSha, filename: file.originalname }],
      path
    );

    const treeSha = await this.githubApi.createTree(
      owner,
      repo,
      baseTreeSha,
      blobs
    );

    const refsSha = await this.githubApi.getRefs(owner, repo, branch);
    const commitSha = await this.githubApi.createCommit(
      owner,
      repo,
      commitMsg,
      treeSha,
      refsSha
    );

    return await this.githubApi.updateRefs(owner, repo, branch, commitSha);
  }

  async sendMultipleFiles(): Promise<void> {}

  private createBlobTreeObject(
    dataArray: BlobShaWithFilename[],
    path: string
  ): BlobTreeData[] {
    return dataArray.map(({ sha, filename }) => ({
      path: path === '' ? filename : `${path}/${filename}`,
      sha,
      type: 'blob',
      mode: '100644',
    }));
  }
}

export const gitToolsService = new GitToolsService(githubApi);
