import { db } from '../database/index';

export class BaseModel {
  static tableName: string;

  public static get table() {
    if (!this.tableName) {
      throw new Error('You must set a table name!');
    }
    return db(this.tableName);
  }

}