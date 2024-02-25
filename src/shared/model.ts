import { db } from "src/database";

export type DateType = {
  created_at: Date;
  updated_at: Date;
};

type ResponseType<Result> = Promise<Result & DateType>;

export class BaseModel {
  static tableName: string;

  private static get table() {
    if (!this.tableName) {
      throw new Error("You must set a table name!");
    }
    return db(this.tableName);
  }

  public static async all<Result>(): Promise<Result[]> {
    return this.table;
  }

  public static async insert<Payload, Result>(data: Payload): ResponseType<Result> {
    const [result] = await this.table.insert(data).returning('*');
    return result;
  }

  public static async update<Payload, Result>(id: string, data: Payload): ResponseType<Result> {
    const [result] = await this.table.where({ id }).update(data).returning('*');
    return result;
  }

  public static async delete(id: string): Promise<number> {
    return this.table.where({ id }).del();
  }

  public static async findById<Result>(id: string): ResponseType<Result> {
    return this.table.where('id', id).first();
  }

  public static async findBy<Payload, Result>(data: Payload): ResponseType<Result | null> {
    return this.table.where(data as string).first();
  }

  /** Paginate the table
   * 
   */
  public static async paginate<Result>(page: number, limit: number): Promise<Result[]> {
    return this.table.limit(limit).offset((page - 1) * limit);
  }

}
