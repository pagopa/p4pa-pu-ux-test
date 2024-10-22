import { loadYamlFile } from 'load-yaml-file';
import dotenv from 'dotenv';

dotenv.config();

const secretPath = process.env.PU_SECRET_PATH;
const allSecrets = await loadYamlFile(secretPath);

const secrets = process.env.PU_TARGET_ENV === 'dev' ? allSecrets['dev'] : allSecrets['uat'];

export const pageUrl = secrets['pageUrl'];
export const userInfo = secrets['userInfo'];
export const enteInfo = secrets['ente'];
export const citizenInfo = secrets['citizenInfo'];
export const checkoutInfo = secrets['checkout'];