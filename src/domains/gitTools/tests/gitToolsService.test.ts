import AdmZip from 'adm-zip';
import { IZipHandler, ZipHandler } from '../../zipHandler/zipHandler';
import { IGithubApiAdapter } from '../adapters/githubApiAdapter';
import { GitToolsService, IGitToolsService } from '../services/gitToolsService';
import { FileInformation, RepoInformation } from '../schemas/postCommitSchema';

describe('Git-tools service', () => {
  const shaValues = {
    createBlob: '638eff25696b982124deeb1f3dfcceabfdc81a93',
    getBaseTree: '0d43a3b20104b4baa402c09a6c9c6c3298390e4a',
    createTree: 'a69117177bb067933189072b2b8799c63f388f32',
    getRefs: '3c408bafa55eda6b1c51de5df0fc36304f37414c',
    createCommit: '544aa83c4d4a784c4c8490d6548c248b0e57d0ac',
    updateRefs: '544aa83c4d4a784c4c8490d6548c248b0e57d0ac',
  };

  let githubApiAdapterMock: IGithubApiAdapter;
  let zipHandler: IZipHandler;
  let gitToolsService: IGitToolsService;

  let firstFilename: string;
  let firstFileContentBuffer: Buffer;

  let secondFilename: string;
  let secondFileContentBuffer: Buffer;

  let zipFile: AdmZip;
  let zipFileBuffer: Buffer;

  let repoInfo: RepoInformation;
  let fileInfo: FileInformation;

  beforeEach(() => {
    firstFilename = 'file1.txt';
    firstFileContentBuffer = Buffer.from('Content of file1.txt');

    secondFilename = 'random2.txt';
    secondFileContentBuffer = Buffer.from('Content of random2.txt');

    repoInfo = {
      branch: 'main',
      commitMsg: 'commit msg',
      owner: 'Owner',
      path: 'testPath',
      repo: 'repo name',
    };

    fileInfo = {
      fieldname: 'file',
      originalname: firstFilename,
      encoding: 'utf8',
      mimetype: 'application/octet-stream',
      size: 10,
      buffer: firstFileContentBuffer,
    };

    zipFile = new AdmZip();
    zipFile.addFile(firstFilename, firstFileContentBuffer);
    zipFile.addFile(secondFilename, secondFileContentBuffer);

    zipFileBuffer = zipFile.toBuffer();

    githubApiAdapterMock = {
      createBlob: jest.fn().mockResolvedValue(shaValues.createBlob),
      getBaseTree: jest.fn().mockResolvedValue(shaValues.getBaseTree),
      createTree: jest.fn().mockResolvedValue(shaValues.createTree),
      getRefs: jest.fn().mockResolvedValue(shaValues.getRefs),
      createCommit: jest.fn().mockResolvedValue(shaValues.createCommit),
      updateRefs: jest.fn().mockResolvedValue(shaValues.updateRefs),
    };

    zipHandler = new ZipHandler();
    gitToolsService = new GitToolsService(githubApiAdapterMock, zipHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should call all githubApiAdapter methods once', async () => {
    await gitToolsService.createCommit(repoInfo, fileInfo);

    expect(githubApiAdapterMock.createBlob).toBeCalledTimes(1);
    expect(githubApiAdapterMock.getBaseTree).toBeCalledTimes(1);
    expect(githubApiAdapterMock.createTree).toBeCalledTimes(1);
    expect(githubApiAdapterMock.getRefs).toBeCalledTimes(1);
    expect(githubApiAdapterMock.createCommit).toBeCalledTimes(1);
    expect(githubApiAdapterMock.updateRefs).toBeCalledTimes(1);
  });

  it('Should call createBlob method twice - two files in zip, other methods should be called 1 time', async () => {
    fileInfo.buffer = zipFileBuffer;
    await gitToolsService.createCommitFromZip(repoInfo, fileInfo);

    expect(githubApiAdapterMock.createBlob).toBeCalledTimes(2);
    expect(githubApiAdapterMock.getBaseTree).toBeCalledTimes(1);
    expect(githubApiAdapterMock.createTree).toBeCalledTimes(1);
    expect(githubApiAdapterMock.getRefs).toBeCalledTimes(1);
    expect(githubApiAdapterMock.createCommit).toBeCalledTimes(1);
    expect(githubApiAdapterMock.updateRefs).toBeCalledTimes(1);
  });
});
