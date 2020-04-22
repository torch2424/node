import { Buffer } from "../buffer";

import {
  Path,
  mem64,
  mem128,
  mem256
} from "./shared";
import { openSync } from "./open";

export function readFileSync(path: Path): Buffer {

  // Implementation from the MIT liscenced as-wasi.
  let data: Array<u8> = new Array<u8>();
  let chunk_size: usize = 4096;

  let data_partial_len = chunk_size;
  let data_partial = changetype<usize>(new ArrayBuffer(data_partial_len));
  // @ts-ignore: cast
  let iov = changetype<ArrayBufferView>(mem128).dataStart;
  store<u32>(iov, data_partial, 0);
  store<u32>(iov, data_partial_len, sizeof<usize>());
  // @ts-ignore: cast
  let read_ptr = changetype<ArrayBufferView>(mem64).dataStart;
  let read: usize = 0;
  let rawfd = openSync(path);
  while (true) {
    if (fd_read(rawfd, iov, 1, read_ptr) !== errno.SUCCESS) {
      break;
    }
    read = load<usize>(read_ptr);
    if (read <= 0) {
      break;
    }
    for (let i: usize = 0; i < read; i++) {
      data.push(load<u8>(data_partial + i));
    }
  }

  if (read <= 0) {
    throw new Error("readFileSync should return null");
  }

  return Buffer.from(data);
}
