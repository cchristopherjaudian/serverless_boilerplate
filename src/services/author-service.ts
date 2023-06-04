import AuthorModel from '../../database/models/author';

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

class AuthorService {
  private _model;
  constructor(model: typeof AuthorModel) {
    this._model = model;
  }

  public async createAuthor(payload: TAuthorPayload): Promise<AuthorModel> {
    try {
      const newAuthor = await this._model.create(payload);
      return newAuthor;
    } catch (error) {
      throw error;
    }
  }

  public async findOneAuthor(params: Record<string, unknown>): Promise<AuthorModel | undefined> {
    try {
      const foundAuthor = await this._model.findOne({ where: params });
      return foundAuthor || undefined;
    } catch (error) {
      throw error;
    }
  }

  public async getAllAuthors(params: Record<string, unknown>) {
    try {
      const authors = await this._model.findAndCountAll({ where: params || {} });
      return authors || undefined;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthorService;
