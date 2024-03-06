/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../database/index';
import { Knex } from 'knex';

export function createKnexInstance<T extends { [key: string]: any }>(tableName: string): Knex.QueryBuilder<T> {
  return db<T>(tableName);
}

export class BaseModel {
  static tableName: string;

  protected static get db() {
    if (!this.tableName) {
      throw new Error('You must set a table name!');
    }
    return createKnexInstance<any>(this.tableName);
  }
}