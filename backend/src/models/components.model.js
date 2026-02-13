/**
 * Components Model
 * 
 * TODO: Implement your database model here
 * Example using MongoDB/Mongoose:
 * 
 * import mongoose from 'mongoose';
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
 * export default mongoose.model('Components', ComponentSchema);
 */

export default class Components {
  constructor(data) {
    Object.assign(this, data);
  }
}
