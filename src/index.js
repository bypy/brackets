module.exports = function check(str, bracketsConfig) {
  let regexpList = [];
  let stripped = str.slice();

  let open, closed;

  bracketsConfig.forEach((cfg) => {
    open = isNaN(Number(cfg[0])) ? `\\${cfg[0]}` : `${cfg[0]}`;
    closed = isNaN(Number(cfg[1])) ? `\\${cfg[1]}` : `${cfg[1]}`;

    regexpList.push(RegExp(`${open}${closed}`, "g"));
    if (cfg[0] === cfg[1]) {
      regexpList.push(RegExp(`${open}${open}`, "g"));
    }
    regexpList.push(RegExp(`^(${open}).*(${closed})$`));
  });

  while (true) {
    let lastLen = stripped.length;
    if (lastLen === 0) break;

    regexpList.forEach((r) => {
      if (r.global && r.test(stripped)) {
        stripped = stripped.replace(r, "");
      }
    });

    if (stripped.length < lastLen) continue;

    regexpList.forEach((r) => {
      let rangeBrackets = stripped.match(r);
      if (
        rangeBrackets &&
        rangeBrackets.length === 3 &&
        rangeBrackets[1] &&
        rangeBrackets[2]
      ) {
        stripped = stripped.slice(1, -1);
      }
    }); // forEach

    if (stripped.length < lastLen) continue;
    else break;
  } // while

  return stripped.length === 0;
}