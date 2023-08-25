import { Router } from 'express';
import { gitToolsController } from '../domains/gitTools/controllers/gitToolsController';
import { upload } from '../config/multerConfig';
import { requestValidator } from '../middlewares/requestValidator';
import { PostCommitSchema } from '../domains/gitTools/schemas/postCommitSchema';

export const gitToolRouter = Router();

gitToolRouter
  .route('/commit')
  .post(
    upload.single('file'),
    requestValidator(PostCommitSchema),
    gitToolsController.postCommit
  );

gitToolRouter.route('/commit/zip').post(gitToolsController.postMultipleCommits);
