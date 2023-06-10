import { Op } from 'sequelize';
import AuthorModel from '../../database/models/author';
import { NotFoundError, ResourceConflictError } from '../lib/custom-errors/class-errors';
import logger from '../../commons/logger';

export type TAuthorPayload = {
  id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  authorUniqueReference: string;
  address?: string;
  contactNumber: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

type TAuthorUpdatePayload = {
  [key: string]: string | Date;
};

class AuthorService {
  private _model;
  constructor(model: typeof AuthorModel) {
    this._model = model;
  }

  public async createAuthor(payload: TAuthorPayload): Promise<AuthorModel | Error> {
    logger.info('service: initializing createAuthor....');
    try {
      const isExists = await this._model.findOne({
        where: {
          [Op.or]: [
            {
              emailAddress: {
                [Op.eq]: payload.emailAddress,
              },
            },
            {
              id: {
                [Op.eq]: payload.id,
              },
            },
          ],
        },
      });

      if (isExists) {
        throw new ResourceConflictError('Author already exists.');
      }

      const newAuthor = await this._model.create(payload);
      return newAuthor;
    } catch (error) {
      logger.error(error);
      throw error as Error;
    }
  }

  public async findOneAuthor(params: Record<string, unknown>): Promise<AuthorModel | Error> {
    logger.info('service: initializing findOneAuthor....');
    try {
      const authorData = await this._model.findOne({ where: params });
      if (!authorData) {
        throw new NotFoundError('Author does not exists');
      }
      return authorData;
    } catch (error) {
      logger.error(error);
      throw error as Error;
    }
  }

  public async getAllAuthors(params: Record<string, unknown>): Promise<{ rows: AuthorModel[]; count: number } | Error> {
    logger.info('service: initializing getAllAuthors....');
    try {
      const authors = await this._model.findAndCountAll({ where: params || {} });
      return authors;
    } catch (error) {
      logger.error(error);
      throw error as Error;
    }
  }

  public async updateAuthor(id: string, payload: TAuthorUpdatePayload): Promise<AuthorModel | Error> {
    logger.info('service: initializing updateAuthor....');
    try {
      const foundAuthor = (await this.findOneAuthor({ id })) as AuthorModel;
      if (foundAuthor instanceof Error) {
        throw foundAuthor;
      }
      const updatedAuthor = await foundAuthor.update(payload);
      return updatedAuthor;
    } catch (error) {
      logger.error(error);
      throw error as Error;
    }
  }

  public async deleteAuthor(id: string): Promise<AuthorModel | Error> {
    logger.info('service: initializing deleteAuthor....');
    try {
      const foundAuthor = (await this.findOneAuthor({ id })) as AuthorModel;
      if (foundAuthor instanceof Error) {
        throw foundAuthor;
      }
      await foundAuthor.destroy();
      return foundAuthor;
    } catch (error) {
      logger.error(error);
      throw error as Error;
    }
  }
}

export default AuthorService;
