import * as componentsService from '../services/components.service.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * @route GET /api/components
 * @desc Get all components
 */
export const getAll = asyncHandler(async (req, res) => {
  const components = await componentsService.getAll();
  res.json({ success: true, data: components });
});

/**
 * @route GET /api/components/:id
 * @desc Get component by ID
 */
export const getById = asyncHandler(async (req, res) => {
  const component = await componentsService.getById(req.params.id);
  if (!component) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }
  res.json({ success: true, data: component });
});

/**
 * @route POST /api/components
 * @desc Create new component
 */
export const create = asyncHandler(async (req, res) => {
  const component = await componentsService.create(req.body);
  res.status(201).json({ success: true, data: component });
});

/**
 * @route PUT /api/components/:id
 * @desc Update component
 */
export const update = asyncHandler(async (req, res) => {
  const component = await componentsService.update(req.params.id, req.body);
  if (!component) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }
  res.json({ success: true, data: component });
});

/**
 * @route DELETE /api/components/:id
 * @desc Delete component
 */
export const remove = asyncHandler(async (req, res) => {
  const component = await componentsService.remove(req.params.id);
  if (!component) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }
  res.json({ success: true, message: 'Component deleted successfully' });
});
