import { api, Component } from "../api";

/**
 * Components Service Layer
 * Encapsulates business logic for managing components
 */

export const componentsService = {
  /**
   * Fetch all components from backend
   */
  async loadAll(): Promise<Component[]> {
    try {
      const components = await api.getAll();
      console.log("✓ Loaded components:", components.length);
      return components || [];
    } catch (error) {
      console.error("✗ Failed to load components:", error);
      throw error;
    }
  },

  /**
   * Create a new component
   */
  async createComponent(title: string, description = "", category = "general"): Promise<Component> {
    if (!title?.trim()) {
      throw new Error("Title is required");
    }

    try {
      const component = await api.create(title.trim(), description.trim(), category.trim());
      console.log("✓ Created component:", component.id);
      return component;
    } catch (error) {
      console.error("✗ Failed to create component:", error);
      throw error;
    }
  },

  /**
   * Delete a component by ID
   */
  async deleteComponent(id: string): Promise<void> {
    try {
      await api.delete(id);
      console.log("✓ Deleted component:", id);
    } catch (error) {
      console.error("✗ Failed to delete component:", error);
      throw error;
    }
  },

  /**
   * Get a single component by ID
   */
  async getComponent(id: string): Promise<Component> {
    try {
      const component = await api.getById(id);
      console.log("✓ Fetched component:", id);
      return component;
    } catch (error) {
      console.error("✗ Failed to fetch component:", error);
      throw error;
    }
  },

  /**
   * Update a component
   */
  async updateComponent(id: string, updates: Partial<Component>): Promise<Component> {
    try {
      const component = await api.update(id, updates);
      console.log("✓ Updated component:", id);
      return component;
    } catch (error) {
      console.error("✗ Failed to update component:", error);
      throw error;
    }
  },
};
