import express, { Application } from 'express';
import { config } from './config';
import { connect } from './database'
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from './docs/swaggerOptions';
import { morganMiddleware } from './middleware/morganMiddleware';
import { errorHandler } from './middleware/error-handlers';
import routes from './routes';

export const app: Application = express();
connect()

// Parse request body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json({ type: 'application/json' }));

app.use(morganMiddleware);
app.use('/api', routes);

// add custom error handler middleware as the last middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
