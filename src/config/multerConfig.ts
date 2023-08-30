import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { BadRequestError } from '../errors/BadRequestError';

export const storage = multer.memoryStorage();

export const zipFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'application/zip') {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only ZIP files are allowed.'));
  }
};
