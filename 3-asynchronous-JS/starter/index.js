const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("ReadFilePro error");
      else resolve(data);
    });
  });
};

const writeFilePro = (file, body) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, body, (err) => {
      if (err) reject("WriteFilePro error");
      else resolve("Random image url saved");
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
    return writeFilePro("dog-img.txt", res);
  })
  .then((res) => console.log(res))
  .catch((err) => {
    console.log(err);
  });
*/

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    all = all.map((elem) => elem.body.message);
    const URLs = all.join("\n");
    console.log(URLs);
    const writeRes = await writeFilePro("dog-img.txt", URLs);
    console.log(writeRes);
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  return "2: READY!";
};

/*
console.log("1: Will get dog pic.");
getDogPic()
  .then((x) => {
    console.log(x);
    console.log("3: Done!");
  })
  .catch(() => console.log("ERROORORROROR"));
*/

(async () => {
  try {
    console.log("1: Will get dog pic.");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done!");
  } catch (err) {
    console.log("ERROORORROROR");
  }
})();
