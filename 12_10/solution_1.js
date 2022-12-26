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

  const cycles = [1];
  for await (const line of rl) {
    const [command, valueStr] = line.split(" ");
    const value = parseInt(valueStr);
    const prevCycleVal = cycles[cycles.length - 1];

    switch (command) {
      case "noop":
        cycles.push(prevCycleVal);
        break;
      case "addx":
        cycles.push(prevCycleVal);
        cycles.push(prevCycleVal + value);
        break;
      default:
        throw new Error(`Unrecognized command ${command}`);
    }
  }

  let sum = 0;
  for (let i = 20; i < 221; i += 40) {
    console.log(i, i * cycles[i - 1]);
    sum += i * cycles[i - 1];
  }

  console.log(sum);
}

processLineByLine();
