const fs = require("fs");
const readline = require("readline");

const args = process.argv.slice(2);
const [inputFile] = args;

async function processLineByLine() {
  const fileStream = fs.createReadStream(inputFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const charToPriority = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .reduce((prev, curr, index) => {
      return { ...prev, [curr]: index + 1 };
    }, {});

  let sum = 0;
  let elfGroup = [];
  for await (const line of rl) {
    elfGroup.push(line);

    if (elfGroup.length === 3) {
      console.log(elfGroup);

      const filteredArray = elfGroup[0].split("").filter(function (n) {
        return (
          elfGroup[1].split("").indexOf(n) !== -1 &&
          elfGroup[2].split("").indexOf(n) !== -1
        );
      });

      const sharedSet = new Set(filteredArray);

      console.log({ sharedSet });

      sum += Array.from(sharedSet).reduce((prev, curr) => {
        return prev + charToPriority[curr];
      }, 0);

      elfGroup = [];
    }
  }

  console.log(sum);
}

processLineByLine();
