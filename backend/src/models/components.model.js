/**
 * Components Model
 * 
 * TODO: Implement your database model here
 * Example using MongoDB/Mongoose:
 * 
 * const mongoose = require('mongoose');
 * 
 * const ComponentSchema = new mongoose.Schema({
 *   name: {
 *     type: String,
 *     required: true,
 *   },
 *   description: String,
 *   createdAt: {
 *     type: Date,
 *     default: Date.now,
 *   },
 *   updatedAt: {
 *     type: Date,
 *     default: Date.now,
 *   },
 * });
 * 
 * module.exports = mongoose.model('Components', ComponentSchema);
 */

module.exports = class Components {
  constructor(data) {
    Object.assign(this, data);
  }
};
