import {
  fd_write
} from "bindings/wasi";

import { Buffer } from "../buffer";

import {
  Path,
  mem64,
  mem128,
  mem256
} from "./shared";
import { openSync } from "./open";

// TODO: Make the data a buffer, once we can wrap()
export function writeFileSync(path: Path, data: Uint8Array): void {

  // Implementation from the MIT liscenced as-wasi.
  let data_buf_len = data.length;
  let data_buf_out = changetype<usize>(new ArrayBuffer(data_buf_len));
  // @ts-ignore: cast
  let data_buf_in = changetype<ArrayBufferView>(data).dataStart;
  memory.copy(data_buf_out, data_buf_in, data_buf_len);
  // @ts-ignore: cast
  let iov = changetype<ArrayBufferView>(mem128).dataStart;
  store<u32>(iov, data_buf_out, 0);
  store<u32>(iov, data_buf_len, sizeof<usize>());

  // @ts-ignore: cast
  let written_ptr = changetype<ArrayBufferView>(mem64).dataStart;
  fd_write(openSync(path), iov, 1, written_ptr);
}
