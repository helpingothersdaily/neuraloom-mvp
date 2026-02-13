import { addComponent, listComponents, getById as getComponentById, update as updateComponent, remove as removeComponent } from '../services/components.service.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * Get all components
 * @route GET /api/components
 */
export const getAll = asyncHandler(async (req, res) => {
  const components = listComponents();
  res.json({ success: true, data: components });
});

/**
 * Get component by ID
 * @route GET /api/components/:id
 */
export const getById = asyncHandler(async (req, res) => {
  const component = await getComponentById(req.params.id);
  if (!component) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }
  res.json({ success: true, data: component });
});

/**
 * Create new component
 * @route POST /api/components
 * @param {string} title - Component title (required)
 * @param {string} description - Component description (optional)
 * @param {string} category - Component category (optional, defaults to 'general')
 */
export const create = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  // Validate required fields
  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  // Create component via service
  const component = addComponent({
    title: title.trim(),
    description: description?.trim() || '',
    category: category?.trim() || 'general',
  });

  res.status(201).json({ success: true, data: component });
});

/**
 * Update component
 * @route PUT /api/components/:id
 */
export const update = asyncHandler(async (req, res) => {
  const component = await updateComponent(req.params.id, req.body);
  if (!component) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }
  res.json({ success: true, data: component });
});

/**
 * Delete component
 * @route DELETE /api/components/:id
 */
export const remove = asyncHandler(async (req, res) => {
  const component = await removeComponent(req.params.id);
  if (!component) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }
  res.json({ success: true, message: 'Component deleted', data: component });
});
