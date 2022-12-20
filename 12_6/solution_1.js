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

  for await (const line of rl) {
    const array = line.split("");

    for (let i = 0; i < array.length - 4; i++) {
      const fourLetters = [];
      for (let j = 0; j < 4; j++) {
        fourLetters.push(array[i + j]);
      }

      const duplicatesExists = fourLetters.reduce((prev, curr, index) => {
        if (prev) return prev;

        const toCompare = fourLetters.filter(
          (val, filterIndex) => index !== filterIndex
        );

        return toCompare.includes(curr);
      }, false);
      if (!duplicatesExists) {
        console.log(i + 4);
        break;
      }
    }
  }
}

processLineByLine();
