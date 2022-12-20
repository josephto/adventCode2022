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

  const print = (crateStacks) => {
    console.log("-------- STACKS -----------");
    crateStacks.map((row) => {
      console.log(row);
    });
  };

  const crateStacks = [];
  const initialLines = [];
  for await (const line of rl) {
    if (line.startsWith(" 1")) {
      //initialize
      initialLines.map((crateLine) => {
        const crates = crateLine.match(/.{1,4}/g);
        if (crateStacks.length === 0) {
          crates.map((crate) => {
            const crateLetter = crate.split("")[1];
            if (crateLetter !== "") {
              crateStacks.push([crateLetter]);
            } else {
              crateStacks.push([]);
            }
          });
        } else {
          crates.map((crate, index) => {
            const crateLetter = crate.split("")[1];
            crateLetter !== " " && crateStacks[index].push(crateLetter);
          });
        }
      });
    }

    if (crateStacks.length === 0) {
      initialLines.unshift(line); //initializing
    }

    if (line.startsWith("move")) {
      const [move, numCrates, from, stackFrom, to, stackTo] = line.split(" ");

      Array(parseInt(numCrates))
        .fill("")
        .map(() => {
          const popped = crateStacks[parseInt(stackFrom) - 1].pop();
          crateStacks[parseInt(stackTo) - 1].push(popped);
        });
    }
  }

  print(crateStacks);

  const answer = crateStacks.reduce((prev, curr) => {
    return [...prev, curr.pop()];
  }, []);

  console.log(answer.join(""));
}

processLineByLine();
