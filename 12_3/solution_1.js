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
  for await (const line of rl) {
    const compartment1 = line.slice(0, line.length / 2);
    const compartment2 = line.slice(line.length / 2, line.length);

    const filteredArray = compartment1.split("").filter(function (n) {
      return compartment2.split("").indexOf(n) !== -1;
    });

    const sharedSet = new Set(filteredArray);

    sum += Array.from(sharedSet).reduce((prev, curr) => {
      return prev + charToPriority[curr];
    }, 0);
  }

  console.log(sum);
}

processLineByLine();
