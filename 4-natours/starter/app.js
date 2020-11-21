const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

/////////////// MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/////////////// ROUTEHANDLERS

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
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

/////////////// ROUTES

app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

/////////////// SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
