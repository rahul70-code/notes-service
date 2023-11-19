const ObjectId = require('mongodb').ObjectId;
const db = require('../models/index');

class MongodbService {
  constructor() {}

  insert(collection, doc) {
    return new Promise((resolve, reject) => {
      db[collection]
        .create(doc)
        .then((result) => {
          resolve(result._id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  insertMany(collection, docs) {
    return new Promise((resolve, reject) => {
      // __logger.info("insertMany operation called");
      db[collection]
        .insertMany(docs, { ordered: true })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateById(collection, id, update) {
    return new Promise((resolve, reject) => {
      db[collection]
        .updateOne({ _id: new ObjectId(id) }, { $set: update }, { runValidators: true } )
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  findById(collection, id, project = {}) {
    return new Promise((resolve, reject) => {
      //__logger.info("Get document by _id operation called");
      db[collection]
        .findOne({ _id: new ObjectId(id) }, project)
        .then((doc) => {
          resolve(doc);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  findMany(
    collection,
    query = {},
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        db[collection]
          .find(query)
          .lean()
          .then((result) => resolve(result));
      } catch (err) {
        reject(err);
      }
    });
  }


  delete(collection, id) {
    return new Promise((resolve, reject) => {
      db[collection]
        .deleteOne({ _id: new ObjectId(id) })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}

module.exports = MongodbService;
