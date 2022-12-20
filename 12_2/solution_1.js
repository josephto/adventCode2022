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

  let totalScore = 0;
  const getResultScore = (self, opp) => {
    const map = {
      X: {
        //rock
        A: 3, //rock
        B: 0, //paper
        C: 6, //scissor
      },
      Y: {
        //paper
        A: 6, //rock
        B: 3, //paper
        C: 0, //scissor
      },
      Z: {
        //scissor
        A: 0, //rock
        B: 6, //paper
        C: 3, //scissor
      },
    };

    return map[self][opp];
  };
  const choiceScore = { X: 1, Y: 2, Z: 3 };

  for await (const line of rl) {
    const [opp, self] = line.split(" ");

    totalScore += choiceScore[self] + getResultScore(self, opp);
  }
  console.log(totalScore);
}

processLineByLine();
