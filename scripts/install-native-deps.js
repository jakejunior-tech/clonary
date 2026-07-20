const { execSync } = require("child_process");
const { platform } = process;

const pkgMap = {
  "linux-x64": "lightningcss-linux-x64-gnu",
  "linux-arm64": "lightningcss-linux-arm64-gnu",
  "darwin-arm64": "lightningcss-darwin-arm64",
  "darwin-x64": "lightningcss-darwin-x64",
  "win32-x64": "lightningcss-win32-x64-msvc",
};

const key = `${platform}-${process.arch}`;
const pkg = pkgMap[key];
if (!pkg) process.exit(0);

try {
  require.resolve(pkg);
} catch {
  try {
    execSync(`npm install ${pkg}@1.32.0 --no-save --force`, {
      cwd: __dirname + "/..",
      stdio: "inherit",
    });
  } catch {}
}
