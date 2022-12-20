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

  let count = 0;
  for await (const line of rl) {
    const [first, second] = line.split(",");
    const [firstStart, firstEnd] = first.split("-").map((val) => parseInt(val));
    const [secondStart, secondEnd] = second
      .split("-")
      .map((val) => parseInt(val));

    if (
      (firstStart >= secondStart && firstStart <= secondEnd) ||
      (firstEnd >= secondStart && firstEnd <= secondEnd) ||
      (secondStart >= firstStart && secondStart <= firstEnd) ||
      (secondEnd >= firstStart && secondEnd <= firstEnd)
    )
      count++;
  }

  console.log(count);
}

processLineByLine();
