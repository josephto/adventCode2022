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

  let row = [];
  for (let i = 0; i < 240; i++) {
    const pos = i % 40;
    if (pos === 0) {
      console.log(row.join(""));
      row = [];
    }

    const x = cycles[i];

    if (x - 1 <= pos && x + 1 >= pos) {
      row.push("#");
    } else {
      row.push(".");
    }
  }

  console.log(row.join(""));
}

processLineByLine();
