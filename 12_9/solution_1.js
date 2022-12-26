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

  const head = {
    x: 0,
    y: 0,
  };

  const tail = {
    x: 0,
    y: 0,
  };

  const uniqueTailPositions = new Set();

  const makeMoves = (direction, numTimes) => {
    const moveTail = () => {
      const headIsTooFar =
        Math.abs(head.y - tail.y) > 1 || Math.abs(head.x - tail.x) > 1;

      if (headIsTooFar) {
        //move tail
        if (Math.abs(head.y - tail.y) > 1) {
          const val = head.y > tail.y ? 1 : -1;
          tail.y = tail.y + val;
          tail.x = head.x;
        } else {
          const val = head.x > tail.x ? 1 : -1;
          tail.x = tail.x + val;
          tail.y = head.y;
        }
      }

      uniqueTailPositions.add(`${tail.x},${tail.y}`);
    };

    Array(numTimes)
      .fill("")
      .map(() => {
        switch (direction) {
          case "U":
            head.y = head.y + 1;
            break;
          case "D":
            head.y = head.y - 1;
            break;
          case "L":
            head.x = head.x - 1;
            break;
          case "R":
            head.x = head.x + 1;
            break;
          default:
            throw new Error(`Unrecognized direction ${direction}`);
            break;
        }

        moveTail();
      });
  };

  for await (const line of rl) {
    const [direction, numTimes] = line.split(" ");
    makeMoves(direction, parseInt(numTimes));
  }

  console.log(uniqueTailPositions.size);
}

processLineByLine();
