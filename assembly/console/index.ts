import { Buffer } from "../buffer";

import {writeFileSync} from "../fs";

export class console {
  static log(value: string): void {
    let utf8Data = Buffer.wrap(String.UTF8.encode(value));
    writeFileSync("/dev/stdout", utf8Data);
  }
}
