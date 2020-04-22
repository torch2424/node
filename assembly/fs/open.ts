import {
  errno,
  fd,
  fdflags,
  lookupflags,
  oflags,
  path_open,
  rights
} from "bindings/wasi";

import {
  Path,
  mem64,
  mem128,
  mem256
} from "./shared";

export function openSync(path: string, flags: string = "r", mode: string = "0o666"): u32 {

  // Implementation from the MIT liscenced as-wasi.
  // TODO: dirfdForPath is hardcoded to 3 in as-wasi
  let dirfd = 3;
  let fd_lookup_flags = lookupflags.SYMLINK_FOLLOW;
  let fd_oflags: u16 = 0;
  let fd_rights: u64 = 0;
  if (flags == "r") {
    fd_rights =
      rights.FD_READ | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
      rights.FD_READDIR;
  } else if (flags == "r+") {
    fd_rights =
      rights.FD_WRITE |
      rights.FD_READ  | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
      rights.PATH_CREATE_FILE;
  } else if (flags == "w") {
    fd_oflags = oflags.CREAT | oflags.TRUNC;
    fd_rights =
      rights.FD_WRITE | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
      rights.PATH_CREATE_FILE;
  } else if (flags == "wx") {
    fd_oflags = oflags.CREAT | oflags.TRUNC | oflags.EXCL;
    fd_rights =
      rights.FD_WRITE | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
      rights.PATH_CREATE_FILE;
  } else if (flags == "w+") {
    fd_oflags = oflags.CREAT | oflags.TRUNC;
    fd_rights =
      rights.FD_WRITE |
      rights.FD_READ  | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
      rights.PATH_CREATE_FILE;
  } else if (flags == "xw+") {
    fd_oflags = oflags.CREAT | oflags.TRUNC | oflags.EXCL;
    fd_rights =
      rights.FD_WRITE |
      rights.FD_READ  | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
      rights.PATH_CREATE_FILE;
  } else {
    throw new Error("Unrecognized flags when trying to open file.");
  }
  let fd_rights_inherited = fd_rights;
  let fd_flags: fdflags = 0;
  let path_utf8_buf = String.UTF8.encode(path);
  let path_utf8_len: usize = path_utf8_buf.byteLength;
  let path_utf8 = changetype<usize>(path_utf8_buf);
  // @ts-ignore: cast
  let fd_buf = changetype<ArrayBufferView>(mem64).dataStart;
  let res = path_open(
    dirfd as fd,
    fd_lookup_flags,
    path_utf8, path_utf8_len,
    fd_oflags,
    fd_rights,
    fd_rights_inherited,
    fd_flags,
    fd_buf
  );
  if (res !== errno.SUCCESS) {
    throw new Error("Could not open the file!");
  }
  let fd = load<u32>(fd_buf);
  return fd;
}
