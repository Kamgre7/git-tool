import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { BadRequestError } from '../errors/BadRequestError';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const zipFileFilter = (
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

export const zipUpload = multer({ storage, fileFilter: zipFileFilter });
