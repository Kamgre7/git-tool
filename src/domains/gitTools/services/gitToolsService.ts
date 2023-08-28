import {
  IZipHandler,
  UnzipFileInfo,
  zipHandler,
} from '../../zipHandler/zipHandler';
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
  createCommitFromZip(
    repoInfo: RepoInformation,
    zipFile: FileInformation
  ): Promise<string>;
}

export class GitToolsService implements IGitToolsService {
  constructor(
    private readonly githubApi: IGithubApiAdapter,
    private readonly zipHandler: IZipHandler
  ) {}

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

  async createCommitFromZip(
    repoInfo: RepoInformation,
    zipFile: FileInformation
  ): Promise<string> {
    const { branch, commitMsg, githubToken, owner, repo, path } = repoInfo;
    const filesInfo = this.zipHandler.getFilesInformation(zipFile.buffer);

    const blobsSha = await this.getMultipleBlobsSha(owner, repo, filesInfo);
    const baseTreeSha = await this.githubApi.getBaseTree(owner, repo, branch);

    const blobs = this.createBlobTreeObject(blobsSha, path);

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

  private async getMultipleBlobsSha(
    owner: string,
    repo: string,
    filesInfo: UnzipFileInfo[]
  ): Promise<BlobShaWithFilename[]> {
    return await Promise.all(
      filesInfo.map(async (file) => {
        const sha = await this.githubApi.createBlob(owner, repo, file.buffer);

        return { sha, filename: file.originalName };
      })
    );
  }

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

export const gitToolsService = new GitToolsService(githubApi, zipHandler);
