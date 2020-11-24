class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach((element) => delete queryObj[element]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\bgte|gt|lt|lte\b/, (match) => `$${match}`)
    );
    this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limitField() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = limit * (page - 1);
    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
