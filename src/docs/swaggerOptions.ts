import YAML from "yamljs";
import path from 'path';

const apiDocsPath = path.join(__dirname, 'api-docs.yaml');

export const swaggerDocs = YAML.load(apiDocsPath);
