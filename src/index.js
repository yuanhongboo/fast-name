const cheerio = require("cheerio");
const { post, get } = require("./helper/request");
const { debug } = require("./helper/debug");
const { outputFileSync } = require("./helper/file");
const { createSpinner } = require("./helper/spin");
// const { getFirstName, getLastName } = require('./helper/util');

async function fetchCandidateNames() {
  // 发送生成名字请求
  const body = await post("https://www.qmsjmfb.com/", {
    xing: "袁", // FIXME 这里改为自己需要的姓氏
    xinglength: "all",
    minglength: "all",
    sex: "nv",
    dic: "gudai",
    num: 99,
  });
  // debug(body);
  const $ = cheerio.load(body, { ignoreWihtespace: true });
  const candidateNames = [];
  // 爬取备选名字
  $("ul.name_show > li").each(function () {
    candidateNames.push($(this).text());
  });
  debug(candidateNames.length);
  return candidateNames;
}

// async function scoreCandidateNames(names) {
//   if (!Array.isArray(names)) {
//     throw Error('names is null or empty!');
//   }
//   const scoredCandidateNames = [];
//   for (const name of names) {
//     const body = await post('https://xmcs.buyiju.com/', {
//       xs: getFirstName(name),
//       mz: getLastName(name),
//       action: 'test',
//     }, {
//       cookie: 'Hm_lvt_0282956784a69e8d921f9a8ae09c09ad=1627178281,1627178622; ASPSESSIONIDQWTSBADS=KCNOKPECPOONBDCOHCJIDEII; Hm_lpvt_0282956784a69e8d921f9a8ae09c09ad=1627191272'
//     });
//     // debug(body);
//     const $ = cheerio.load(body, { ignoreWihtespace: true });
//     // 爬取备选名字分数
//     debug($('h3').length)
//     const score = $('font[size="5"]').text();
//     scoredCandidateNames.push({
//       name,
//       score
//     });
//   }
//   debug(scoredCandidateNames);
//   return scoredCandidateNames;
// }

async function scoreCandidateNames(names) {
  if (!Array.isArray(names)) {
    throw Error("names is null or empty!");
  }
  const scoredCandidateNames = [];
  for (const name of names) {
    // 爬取备选名字分数
    const body = await get(
      `https://xingming.911cha.com/xm_${encodeURIComponent(name)}.html`
    );
    // debug(body);
    const $ = cheerio.load(body, { ignoreWihtespace: true });
    const score = $("div.xm_score + div.gclear span.red.f24").text();
    if (!$(".panel.noi.zisong .jx2").length && score && Number(score) >= 92) {
      scoredCandidateNames.push({
        name,
        score: Number(score),
      });
    }
  }
  debug(scoredCandidateNames);
  return scoredCandidateNames;
}

async function startup() {
  let spinner = null;
  try {
    // 爬取生成的名字
    spinner = createSpinner("Fetching candidate names...");
    const candidateNames = await fetchCandidateNames();
    spinner.succeed();
    // 匹配名字分数
    spinner = createSpinner("Calculating score...");
    const scoredNames = await scoreCandidateNames(candidateNames);
    debug(scoredNames);
    if (!scoredNames.length) {
      spinner.warn("Not found matched names!");
      spinner.fail();
      return;
    }
    spinner.succeed();
    // 输出文件
    spinner = createSpinner("Writing names to file...");
    outputFileSync(scoredNames);
    spinner.succeed();
  } catch (e) {
    spinner && spinner.fail(e.message);
    console.error(e);
  }
}

startup();
