const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id;
  if (id >= tours.length) {
    res.status(404).json({
      status: 'fail',
      data: 'invalid ID',
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
};

const addNewTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  const id = req.params.id;
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: 'invalid ID',
    });
  }
  res.status().json({
    status: 'success',
    data: {
      tour: '<Updtaed tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id;
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: 'invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', addNewTour);
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
