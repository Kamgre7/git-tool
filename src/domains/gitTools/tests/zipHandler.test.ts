import AdmZip from 'adm-zip';
import { IZipHandler, ZipHandler } from '../../zipHandler/zipHandler';

describe('Zip handler', () => {
  let firstFilename: string;
  let firstFileContentBuffer: Buffer;

  let secondFilename: string;
  let secondFileContentBuffer: Buffer;

  let zipHandler: IZipHandler;
  let zipFile: AdmZip;
  let zipFileBuffer: Buffer;

  beforeAll(() => {
    firstFilename = 'file1.txt';
    firstFileContentBuffer = Buffer.from('Content of file1.txt');

    secondFilename = 'random2.txt';
    secondFileContentBuffer = Buffer.from('Content of random2.txt');

    zipHandler = new ZipHandler();
    zipFile = new AdmZip();

    zipFile.addFile(firstFilename, firstFileContentBuffer);
    zipFile.addFile(secondFilename, secondFileContentBuffer);

    zipFileBuffer = zipFile.toBuffer();
  });

  it('Should return array of added files to zip', () => {
    const arrayWithFileInformation =
      zipHandler.getFilesInformation(zipFileBuffer);

    expect(arrayWithFileInformation).toStrictEqual([
      { originalName: firstFilename, buffer: firstFileContentBuffer },
      { originalName: secondFilename, buffer: secondFileContentBuffer },
    ]);
  });
});
