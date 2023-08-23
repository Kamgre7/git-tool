import { z } from 'zod';

export const PostCommitBodySchema = z.object({
  githubToken: z.string().nonempty(),
  commitMsg: z.string().nonempty(),
  repo: z.string().nonempty(),
  owner: z.string().nonempty(),
});

export const FileSchema = z.object({
  fieldname: z.string().nonempty(),
  originalname: z.string().nonempty(),
  encoding: z.string().nonempty(),
  mimetype: z.string().nonempty(),
  buffer: z.unknown().refine((value) => value instanceof Buffer),
  size: z.number().min(1),
});

export const PostCommitSchema = z.object({
  body: PostCommitBodySchema,
  file: FileSchema,
});
