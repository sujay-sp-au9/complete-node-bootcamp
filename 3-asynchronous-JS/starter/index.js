const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      else resolve("Success");
    });
  });
};

/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro("dog-img.txt", res.body.message);
  })
  .then(() => console.log("Random image link saved"))
  .catch((err) => console.log(err));
*/
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePro("dog-img.txt", res.body.message);
    console.log("Random image link saved");
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "2: READY";
};
/*
console.log("1: Will get dog picks");
getDogPic()
  .then((res) => {
    console.log(res);
    console.log("3: Done!");
  })
  .catch((err) => console.log("ERRORRRRRRRRRR"));
*/
(async () => {
  try {
    console.log("1: Will get dog picks");
    const res = await getDogPic();
    console.log(res);
    console.log("3: Done!");
  } catch (err) {
    console.log("ERRORRRRRRRRRR");
  }
})();
