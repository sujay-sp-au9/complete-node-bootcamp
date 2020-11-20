const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.send('POST!');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours/:id?', (req, res) => {
  const id = req.params.id;
  if (req.params.hasOwnProperty('id') && id) {
    if (id >= tours.length) {
      res.status(404).json({
        status: 'fail',
        message: 'invalid ID',
      });
    } else {
      const tour = tours.find((element) => element.id == id);
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    }
  } else {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  }
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log(err);
      else
        res.status(201).json({
          status: 201,
          data: {
            tour: newTour,
          },
        });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
