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

  /*
  {
    height: number;
    northMax: number;
    southMax: number;
    eastMax: number;
    westMax: number;
    visible: boolean;
  }
  */

  const forest = [];

  const print = () => {
    forest.map((treeLine) => {
      const trees = [];
      treeLine.map((tree) => {
        trees.push(tree);
      });

      console.log(
        trees
          .map((tree) => {
            if (
              tree.height > tree.northMax ||
              tree.height > tree.southMax ||
              tree.height > tree.eastMax ||
              tree.height > tree.westMax
            ) {
              return "Y";
            } else {
              return "n";
            }
          })
          .join("")
      );
    });
  };

  const createTree = (height) => ({
    height: parseInt(height),
    northMax: 0,
    southMax: 0,
    eastMax: 0,
    westMax: 0,
  });

  //initialize forest
  for await (const line of rl) {
    forest.push(line.split("").map((height) => createTree(height)));
  }

  //north
  for (let i = 0; i < forest.length; i++) {
    for (let j = 0; j < forest[i].length; j++) {
      const tree = forest[i][j];
      if (i === 0) {
        tree.northMax = -1;
      } else {
        const northTree = forest[i - 1][j];
        tree.northMax = Math.max(northTree.height, northTree.northMax);
      }
    }
  }

  //south
  for (let i = forest.length - 1; i >= 0; i--) {
    for (let j = 0; j < forest[i].length; j++) {
      const tree = forest[i][j];
      if (i === forest.length - 1) {
        tree.southMax = -1;
      } else {
        const southTree = forest[i + 1][j];
        tree.southMax = Math.max(southTree.height, southTree.southMax);
      }
    }
  }

  //east
  for (let j = 0; j < forest[0].length; j++) {
    for (let i = 0; i < forest.length; i++) {
      const tree = forest[i][j];
      if (j === 0) {
        tree.eastMax = -1;
      } else {
        const eastTree = forest[i][j - 1];
        tree.eastMax = Math.max(eastTree.height, eastTree.eastMax);
      }
    }
  }

  //west
  for (let j = forest[0].length - 1; j >= 0; j--) {
    for (let i = 0; i < forest.length; i++) {
      const tree = forest[i][j];
      if (j === forest[0].length - 1) {
        tree.westMax = -1;
      } else {
        const westTree = forest[i][j + 1];
        tree.westMax = Math.max(westTree.height, westTree.westMax);
      }
    }
  }

  let visibleCount = 0;
  forest.map((treeLine) => {
    treeLine.map((tree) => {
      if (
        tree.height > tree.northMax ||
        tree.height > tree.southMax ||
        tree.height > tree.eastMax ||
        tree.height > tree.westMax
      ) {
        visibleCount++;
      }
    });
  });

  // print();
  console.log(visibleCount);
}

processLineByLine();
