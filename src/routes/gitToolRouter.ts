import { Router } from 'express';
import { gitToolsController } from '../domains/gitTools/controllers/gitToolsController';
import { storage, zipFileFilter } from '../config/multerConfig';
import { requestValidator } from '../middlewares/requestValidator';
import { PostCommitSchema } from '../domains/gitTools/schemas/postCommitSchema';
import multer from 'multer';

export const gitToolRouter = Router();

gitToolRouter
  .route('/commit')
  .post(
    multer({ storage }).single('file'),
    requestValidator(PostCommitSchema),
    gitToolsController.postCommit
  );

gitToolRouter
  .route('/commit/zip')
  .post(
    multer({ storage, fileFilter: zipFileFilter }).single('file'),
    requestValidator(PostCommitSchema),
    gitToolsController.postCommitFromZip
  );
