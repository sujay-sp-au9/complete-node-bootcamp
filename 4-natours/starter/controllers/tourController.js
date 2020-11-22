const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
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

exports.addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
