import { z } from 'zod';

const isBuffer = (value: unknown): value is Buffer => value instanceof Buffer;

export const PostCommitBodySchema = z.object({
  githubToken: z.string().nonempty(),
  commitMsg: z.string().nonempty(),
  repo: z.string().nonempty(),
  owner: z.string().nonempty(),
  branch: z.string().nonempty(),
  path: z.string(),
});

export const FileSchema = z.object({
  fieldname: z.string().nonempty(),
  originalname: z.string().nonempty(),
  encoding: z.string().nonempty(),
  mimetype: z.string().nonempty(),
  buffer: z.unknown().refine(isBuffer),
  size: z.number().min(1),
});

export const PostCommitSchema = z.object({
  body: PostCommitBodySchema,
  file: FileSchema,
});

export type RepoInformation = z.infer<typeof PostCommitBodySchema>;
export type FileInformation = z.infer<typeof FileSchema>;
