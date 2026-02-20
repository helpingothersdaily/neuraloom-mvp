import { nestApi, Nest } from "../api";

/**
 * Nests Service Layer
 * Encapsulates business logic for managing nests
 */

export const nestService = {
  /**
   * Fetch all nests from backend
   */
  async getAllNests(): Promise<Nest[]> {
    try {
      const nests = await nestApi.getAllNests();
      console.log("✓ Loaded nests:", nests.length);
      return nests || [];
    } catch (error) {
      console.error("✗ Failed to load nests:", error);
      throw error;
    }
  },

  /**
  * Create a new nest
   */
  async createNest(title: string, description = "", category = "general"): Promise<Nest> {
    if (!title?.trim()) {
      throw new Error("Title is required");
    }

    try {
      const nest = await nestApi.createNest(title.trim(), description.trim(), category.trim());
      console.log("✓ Created nest:", nest.id);
      return nest;
    } catch (error) {
      console.error("✗ Failed to create nest:", error);
      throw error;
    }
  },

  /**
   * Delete a nest by ID
   */
  async deleteNest(id: string): Promise<void> {
    try {
      await nestApi.deleteNest(id);
      console.log("✓ Deleted nest:", id);
    } catch (error) {
      console.error("✗ Failed to delete nest:", error);
      throw error;
    }
  },

  /**
   * Get a single nest by ID
   */
  async getNest(id: string): Promise<Nest> {
    try {
      const nest = await nestApi.getNestById(id);
      console.log("✓ Fetched nest:", id);
      return nest;
    } catch (error) {
      console.error("✗ Failed to fetch nest:", error);
      throw error;
    }
  },

  /**
   * Update a nest
   */
  async updateNest(id: string, updates: Partial<Nest>): Promise<Nest> {
    try {
      const nest = await nestApi.updateNest(id, updates);
      console.log("✓ Updated nest:", id);
      return nest;
    } catch (error) {
      console.error("✗ Failed to update nest:", error);
      throw error;
    }
  },
};
