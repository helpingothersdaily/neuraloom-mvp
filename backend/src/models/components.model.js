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

/**
 * Create a new component object with generated ID and timestamps
 */
export function createComponent(data) {
  return {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    category: data.category,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default class Components {
  constructor(data) {
    Object.assign(this, data);
  }
}
