import express from 'express';
import 'express-async-errors';
import { appConfig } from './src/config/appConfig';
import { gitToolRouter } from './src/routes/gitToolRouter';
import { errorHandler } from './src/middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/git-tool', gitToolRouter);

app.use(errorHandler);

app.listen(appConfig.port, appConfig.hostName, () => {
  console.log(`Application is running on ${appConfig.host}:${appConfig.port}`);
});
