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
    name: string;
    childrenDirectories: [self]
    files: [{ name: string; size: number; }]
    parentDirectory: self
  }
  */

  const createFile = (name, size) => {
    return { name, size: parseInt(size) };
  };

  const createDirectory = (name, parentDirectory) => {
    return {
      name,
      files: [],
      parentDirectory,
      childrenDirectories: [],
      size: 0,
    };
  };

  const findDirectory = (name, directories) => {
    for (const directory of directories) {
      if (directory.name === name) {
        return directory;
      }
    }

    return undefined;
  };

  const head = createDirectory("/", null);
  let curr = undefined;
  let isListing = false;

  const calcSize = (node) => {
    for (const child of node.childrenDirectories) {
      calcSize(child);
      node.size = node.size + child.size;
    }

    node.files.map((file) => {
      node.size = node.size + file.size;
    });
  };

  const getDirectories = (node, directories, minSizeToDelete) => {
    for (const child of node.childrenDirectories) {
      getDirectories(child, directories, minSizeToDelete);
    }

    if (node.size >= minSizeToDelete) {
      directories.push(node);
    }
  };

  const print = (node, depth) => {
    const dirSpaces = new Array(depth * 2).fill(" ").join("");
    console.log(`${dirSpaces} - ${node.name} (dir, size=${node.size})`);

    for (const child of node.childrenDirectories) {
      print(child, depth + 1);
    }

    const fileSpaces = new Array((depth + 1) * 2).fill(" ").join("");

    node.files.map((file) =>
      console.log(`${fileSpaces} - ${file.name} (file, size=${file.size})`)
    );
  };

  //compile tree
  for await (const line of rl) {
    if (line.startsWith("$")) {
      isListing = false;
      const [dollar, command, directory] = line.split(" ");
      if (command === "cd") {
        if (directory === undefined) {
          throw new Error(`Command ${command} requires a directory`);
        }

        if (directory === "/") {
          curr = head;
        } else if (directory === "..") {
          if (curr === undefined || curr.parentDirectory === null) {
            throw new Error(
              `${command} ${directory} not valid, in root directory`
            );
          }

          curr = curr.parentDirectory;
        } else {
          curr = findDirectory(directory, curr.childrenDirectories);
        }
      } else if (command === "ls") {
        isListing = true;
      } else {
        throw new Error(`Unrecognized command ${command}`);
      }
    } else {
      if (isListing) {
        const [first, second] = line.split(" ");
        if (first === "dir") {
          curr.childrenDirectories.push(createDirectory(second, curr));
        } else {
          curr.files.push(createFile(second, first));
        }
      } else {
        throw new Error(`Unrecognized state`);
      }
    }
  }

  //find directories of size less than 100,000
  calcSize(head);
  print(head, 0);

  const unusedSpace = 70000000 - head.size;
  const minSizeToDelete = 30000000 - unusedSpace;

  console.log(minSizeToDelete);
  const directories = [];
  getDirectories(head, directories, minSizeToDelete);

  const sortedDirectories = directories.sort((a, b) => a.size - b.size);

  console.log(sortedDirectories[0].size);
}

processLineByLine();
