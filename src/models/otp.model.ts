import { IOTP } from "src/utils/interfaces/otp.interface";
import { db } from "../database/index";


export class OTPModel{
  static tableName = 'otp_verification';

  public static db = () => db<IOTP>(OTPModel.tableName);

  public static async create(data: Partial<IOTP>): Promise<IOTP> {
    const [id] = await OTPModel.db().insert(data).returning('id');
    return { id, ...data } as IOTP;
  }

  public static async findByOTP(otp: string, userId: string, isUsed = false): Promise<IOTP | undefined> {
    return OTPModel.db()
    .where("otp", otp)
    .where("user_id", userId)
    .where("is_used", isUsed)
    .first();
  }

  public static async revokeOTP(otp: string): Promise<number> {
    return OTPModel.db().where('otp', otp).update({ is_used: true });
  }
}