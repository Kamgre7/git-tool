import { Request, Response } from 'express';
import { IGitToolsService, gitToolsService } from '../services/gitToolsService';
import { FileSchema, PostCommitBodySchema } from '../schemas/postCommitSchema';

export interface IGitToolsController {
  postCommit(req: Request, res: Response): Promise<void>;
  postMultipleCommits(): Promise<void>;
}

export class GitToolsController implements IGitToolsController {
  constructor(private readonly gitToolsService: IGitToolsService) {}

  postCommit = async (req: Request, res: Response): Promise<void> => {
    const repositoryInformation = PostCommitBodySchema.parse(req.body);
    const file = FileSchema.parse(req.file);

    const result = await this.gitToolsService.createCommit(
      repositoryInformation,
      file
    );

    res.status(201).json({
      sha: result,
      message: 'Commit created successfully.',
    });
  };

  postMultipleCommits = async (): Promise<void> => {
    return await this.gitToolsService.sendMultipleFiles();
  };
}

export const gitToolsController = new GitToolsController(gitToolsService);
