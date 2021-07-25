const { writeFileSync } = require("fs-extra");
const { join } = require("path");
const dayjs = require("dayjs");

const OUTPUT_PATH = join(__dirname, "../../output/");

function getFilePath() {
  return join(OUTPUT_PATH, `${dayjs().format("YYYY-MM-DD HH:mm:ss")}.json`);
}

exports.outputFileSync = (content) => {
  writeFileSync(getFilePath(), JSON.stringify(content, -1, 2));
};
