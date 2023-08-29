import { z } from 'zod';

export const GithubTokenSchema = z.string().nonempty();
