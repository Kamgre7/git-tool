import {
  FileSchema,
  PostCommitBodySchema,
  PostCommitSchema,
} from '../postCommitSchema';

type BodyUnknown = {
  commitMsg: unknown;
  repo: unknown;
  owner: unknown;
  branch: unknown;
  path: unknown;
};

describe('Post commit schema', () => {
  let body: BodyUnknown = {
    commitMsg: '',
    repo: '',
    owner: '',
    branch: '',
    path: '',
  };

  let file: {
    fieldname: unknown;
    originalname: unknown;
    encoding: unknown;
    mimetype: unknown;
    buffer: unknown;
    size: unknown;
  };

  let postCommit: {
    body: typeof body;
    file: typeof file;
  };

  beforeEach(() => {
    body = {
      branch: 'main',
      commitMsg: 'commit msg',
      owner: 'Owner',
      path: 'testPath',
      repo: 'repo name',
    };

    file = {
      fieldname: 'file',
      originalname: 'note.ts',
      encoding: 'utf8',
      mimetype: 'application/octet-stream',
      size: 10,
      buffer: Buffer.from('file content', 'utf8'),
    };

    postCommit = {
      body,
      file,
    };
  });

  describe('Body schema', () => {
    it('Should return true if all values are strings', () => {
      const parseResult = PostCommitBodySchema.safeParse(body);
      expect(parseResult.success).toBe(true);
    });

    Object.keys(body).forEach((key) => {
      it(`Should return false if ${key} is not a string`, () => {
        body[key as keyof BodyUnknown] = null;
        const parseResult = PostCommitBodySchema.safeParse(body);

        expect(parseResult.success).toBe(false);
      });
    });
  });

  describe('File schema', () => {
    it('Should return true', () => {
      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(true);
    });

    it('Should return false if fieldname is not string or is empty', () => {
      file.fieldname = 1;

      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false if originalname is not string or is empty', () => {
      file.originalname = null;

      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false if encoding is not string or is empty', () => {
      file.encoding = null;

      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false if mimetype is not string or is empty', () => {
      file.mimetype = 10;

      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false if buffer is not Bufer type', () => {
      file.buffer = 'test';

      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false if size is not number', () => {
      file.size = 'test';

      const parseResult = FileSchema.safeParse(file);

      expect(parseResult.success).toBe(false);
    });
  });

  describe('Post commit schema', () => {
    it('Should return true when body and file are correct type', () => {
      const parseResult = PostCommitSchema.safeParse(postCommit);

      expect(parseResult.success).toBe(true);
    });

    it('Should return false when some values of body are not string', () => {
      postCommit.body.branch = null;

      const parseResult = PostCommitSchema.safeParse(postCommit);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false when values fieldname, originalname, encoding or mimetype is not string or is empty in file', () => {
      postCommit.file.encoding = null;

      const parseResult = PostCommitSchema.safeParse(postCommit);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false when file.buffer is not buffer type', () => {
      postCommit.file.buffer = null;

      const parseResult = PostCommitSchema.safeParse(postCommit);

      expect(parseResult.success).toBe(false);
    });

    it('Should return false when file.size is not number and size < 1', () => {
      postCommit.file.size = 0;

      const parseResult = PostCommitSchema.safeParse(postCommit);

      expect(parseResult.success).toBe(false);
    });
  });
});
