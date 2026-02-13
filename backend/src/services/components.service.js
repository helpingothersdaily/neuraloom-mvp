import { createComponent } from '../models/components.model.js';

// In-memory storage (will be replaced with database)
const components = [];

/**
 * Add a new component
 * @param {Object} data - Component data (title, description, category)
 * @returns {Object} Created component with id and timestamps
 */
export function addComponent(data) {
  const component = createComponent(data);
  components.push(component);
  return component;
}

/**
 * Get all components
 * @returns {Array} All stored components
 */
export function listComponents() {
  return components;
}

/**
 * Get all components (async wrapper for API)
 */
export const getAll = async () => {
  try {
    return listComponents();
  } catch (error) {
    throw new Error(`Failed to fetch components: ${error.message}`);
  }
};

/**
 * Get component by ID
 */
export const getById = async (id) => {
  try {
    return components.find((c) => c.id === id) || null;
  } catch (error) {
    throw new Error(`Failed to fetch component: ${error.message}`);
  }
};

/**
 * Create new component
 */
export const create = async (data) => {
  try {
    return addComponent(data);
  } catch (error) {
    throw new Error(`Failed to create component: ${error.message}`);
  }
};

/**
 * Update component
 */
export const update = async (id, data) => {
  try {
    const index = components.findIndex((c) => c.id === id);
    if (index === -1) return null;
    
    const updated = {
      ...components[index],
      ...data,
      updatedAt: new Date(),
    };
    components[index] = updated;
    return updated;
  } catch (error) {
    throw new Error(`Failed to update component: ${error.message}`);
  }
};

/**
 * Delete component
 */
export const remove = async (id) => {
  try {
    const index = components.findIndex((c) => c.id === id);
    if (index === -1) return null;
    
    const [deleted] = components.splice(index, 1);
    return deleted;
  } catch (error) {
    throw new Error(`Failed to delete component: ${error.message}`);
  }
};
