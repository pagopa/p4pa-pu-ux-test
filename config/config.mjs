import { loadYamlFile } from 'load-yaml-file';
import dotenv from 'dotenv';

dotenv.config();

const secretPath = process.env.PU_SECRET_PATH;
const secrets = await loadYamlFile(secretPath);

export const userInfo = secrets['userInfo'];
export const enteInfo = secrets['ente'];
export const citizenInfo = secrets['citizenInfo'];
export const emailForCheckout = secrets['emailForCheckout'];