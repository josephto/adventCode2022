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
  const getChoiceScore = (self, opp) => {
    const map = {
      X: {
        //lose
        A: 3, //rock
        B: 1, //paper
        C: 2, //scissor
      },
      Y: {
        //draw
        A: 1, //rock
        B: 2, //paper
        C: 3, //scissor
      },
      Z: {
        //win
        A: 2, //rock
        B: 3, //paper
        C: 1, //scissor
      },
    };

    return map[self][opp];
  };
  const resultScore = { X: 0, Y: 3, Z: 6 };

  for await (const line of rl) {
    const [opp, self] = line.split(" ");

    totalScore += resultScore[self] + getChoiceScore(self, opp);
  }
  console.log(totalScore);
}

processLineByLine();
