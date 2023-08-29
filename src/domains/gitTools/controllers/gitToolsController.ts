import { Request, Response } from 'express';
import { IGitToolsService, gitToolsService } from '../services/gitToolsService';
import { FileSchema, PostCommitBodySchema } from '../schemas/postCommitSchema';

export interface IGitToolsController {
  postCommit(req: Request, res: Response): Promise<void>;
  postCommitFromZip(req: Request, res: Response): Promise<void>;
}

export class GitToolsController implements IGitToolsController {
  constructor(private readonly gitToolsService: IGitToolsService) {}

  postCommit = async (req: Request, res: Response): Promise<void> => {
    const repositoryInformation = PostCommitBodySchema.parse(req.body);
    const file = FileSchema.parse(req.file);

    const commitSha = await this.gitToolsService.createCommit(
      repositoryInformation,
      file
    );

    res.status(201).json({
      sha: commitSha,
      message: 'Commit created successfully.',
    });
  };

  postCommitFromZip = async (req: Request, res: Response): Promise<void> => {
    const repositoryInformation = PostCommitBodySchema.parse(req.body);
    const file = FileSchema.parse(req.file);

    const commitSha = await this.gitToolsService.createCommitFromZip(
      repositoryInformation,
      file
    );

    res.status(201).json({
      sha: commitSha,
      message: 'Commit created successfully.',
    });
  };
}

export const gitToolsController = new GitToolsController(gitToolsService);
