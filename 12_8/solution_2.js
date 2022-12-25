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
            return tree.height;
          })
          .join("")
      );
    });
  };

  const createTree = (height) => ({
    height: parseInt(height),
    scenicScore: 0,
  });

  //initialize forest
  for await (const line of rl) {
    forest.push(line.split("").map((height) => createTree(height)));
  }

  let idealTree = forest[0][0];
  forest.map((treeLine, i) => {
    const scores = [];
    treeLine.map((tree, j) => {
      const northScore = (() => {
        let localI = i - 1;
        let blocked = false;
        let score = 0;
        while (localI >= 0 && !blocked) {
          const targetTree = forest[localI][j];
          score++;
          blocked = targetTree.height >= tree.height;
          localI--;
        }

        return score;
      })();

      const southScore = (() => {
        let localI = i + 1;
        let blocked = false;
        let score = 0;
        while (localI < forest.length && !blocked) {
          const targetTree = forest[localI][j];
          score++;
          blocked = targetTree.height >= tree.height;
          localI++;
        }

        return score;
      })();

      const eastScore = (() => {
        let localJ = j + 1;
        let blocked = false;
        let score = 0;
        while (localJ < forest[0].length && !blocked) {
          const targetTree = forest[i][localJ];
          score++;
          blocked = targetTree.height >= tree.height;
          localJ++;
        }

        return score;
      })();

      const westScore = (() => {
        let localJ = j - 1;
        let blocked = false;
        let score = 0;
        while (localJ >= 0 && !blocked) {
          const targetTree = forest[i][localJ];
          score++;
          blocked = targetTree.height >= tree.height;
          localJ--;
        }

        return score;
      })();

      const scenicScore = northScore * southScore * eastScore * westScore;
      tree.scenicScore = scenicScore;

      if (tree.scenicScore >= idealTree.scenicScore) {
        idealTree = tree;
      }

      scores.push(scenicScore);
    });
    console.log(scores.join(""));
  });

  // print();
  console.log(idealTree.scenicScore);
}

processLineByLine();
