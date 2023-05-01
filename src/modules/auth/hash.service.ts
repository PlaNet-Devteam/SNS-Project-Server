import Debug from 'debug';
import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { basename } from 'path';

Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

@Injectable()
export class HashService {
  /**
   * validate hash
   * @param originalString
   * @param encrypted
   * @returns boolean
   */
  public async validate(
    originalString: string,
    encrypted: string,
  ): Promise<boolean> {
    return await compare(originalString, encrypted);
  }

  /**
   * perform hash
   * @param originalString
   * @returns hashed string
   */
  public async hashString(originalString: string): Promise<string> {
    return hash(originalString, await this._gen_salt());
  }

  private async _gen_salt() {
    return await genSalt(Number(process.env.BCRYPT_ROUND));
  }
}
