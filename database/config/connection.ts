import { Options, Sequelize } from 'sequelize';
import config from './db-config.json';
import APP_REFERENCES from '../../commons/constants/app-references';

type TDatabase = {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  dialect?: string;
  storage?: string;
};

const configEnv: TDatabase = config[process.env.NODE_ENV! as keyof typeof config];

let sequelize: Sequelize;
if (process.env.NODE_ENV === APP_REFERENCES.ENVIRONMENTS.TEST) {
  sequelize = new Sequelize(configEnv.dialect! + configEnv.storage);
}

if (process.env.NODE_ENV === APP_REFERENCES.ENVIRONMENTS.DEV) {
  sequelize = new Sequelize(configEnv.database!, configEnv.username!, configEnv.password, configEnv as Options);
}

if (process.env.NODE_ENV === APP_REFERENCES.ENVIRONMENTS.PROD) {
  sequelize = new Sequelize(configEnv.database!, configEnv.username!, configEnv.password, configEnv as Options);
}

export { sequelize };
