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

  const elves = [];

  let calorieCount = 0;
  for await (const line of rl) {
    const parsedInt = parseInt(line);

    if (isNaN(parsedInt)) {
      elves.push({ elf: elves.length, calories: calorieCount });
      calorieCount = 0;
    } else {
      calorieCount += parsedInt;
    }
  }

  elves.push({ elf: elves.length, calories: calorieCount });

  const sortedElves = elves.sort(function (a, b) {
    return b.calories - a.calories;
  });

  console.log(sortedElves[0].calories);

  const top3Calories = [0, 1, 2].reduce((prev, curr) => {
    return prev + sortedElves[curr].calories;
  }, 0);

  console.log(top3Calories);
}

processLineByLine();
