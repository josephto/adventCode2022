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

  const rope = Array(10)
    .fill("")
    .map((val, i) => ({ index: i, x: 0, y: 0 }));

  const head = rope[0];
  const tail = rope[rope.length - 1];

  const uniqueTailPositions = new Set();

  const print = (minx, maxx, miny, maxy) => {
    for (let y = maxy; y >= miny; y--) {
      const row = [];

      for (let x = minx; x <= maxx; x++) {
        const foundKnot = rope.filter((knot) => knot.x === x && knot.y === y);

        if (foundKnot.length > 0) {
          row.push(foundKnot[0].index);
        } else {
          row.push(".");
        }
      }
      console.log(row.join(""));
    }
    console.log();
  };

  const makeMoves = (direction, numTimes) => {
    const moveTail = (h, t) => {
      const headIsTooFar = Math.abs(h.y - t.y) > 1 || Math.abs(h.x - t.x) > 1;

      if (headIsTooFar) {
        //move tail
        if (Math.abs(h.y - t.y) > 1) {
          const yval = h.y > t.y ? 1 : -1;
          const xval = h.x === t.x ? 0 : h.x > t.x ? 1 : -1;
          t.y = t.y + yval;
          t.x = t.x + xval;
        } else {
          const xval = h.x > t.x ? 1 : -1;
          const yval = h.y === t.y ? 0 : h.y > t.y ? 1 : -1;

          t.x = t.x + xval;
          t.y = t.y + yval;
        }
      }
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

        for (let i = 1; i < rope.length; i++) {
          moveTail(rope[i - 1], rope[i]);
        }
        uniqueTailPositions.add(`${tail.x},${tail.y}`);
      });

    // print(-11, 14, -5, 15);
  };

  for await (const line of rl) {
    const [direction, numTimes] = line.split(" ");
    makeMoves(direction, parseInt(numTimes));
  }

  // console.log(uniqueTailPositions);
  // print(0, 5, 0, 4);
  // print(-11, 14, -5, 15);
  console.log(uniqueTailPositions.size);
}

processLineByLine();
