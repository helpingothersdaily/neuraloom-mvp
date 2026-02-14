/**
 * Components API Layer
 * Abstracts API calls for component management
 */

const API_URL = process.env.REACT_APP_API_URL || "/api";

export interface Component {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data || json;
}

export const componentApi = {
  async getAll(): Promise<Component[]> {
    const url = `${API_URL}/components`;
    console.log("Fetching components:", url);
    try {
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch components:", error);
      throw new Error(`Cannot connect to backend at ${API_URL}`);
    }
  },

  async getById(id: string): Promise<Component> {
    const response = await fetch(`${API_URL}/components/${id}`);
    return handleResponse(response);
  },

  async create(title: string, description = "", category = "general"): Promise<Component> {
    const url = `${API_URL}/components`;
    const payload = { title, description, category };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Create response status:", response.status);
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to create component:", error);
      throw new Error(`Cannot reach backend at ${API_URL}`);
    }
  },

  async update(id: string, updates: Partial<Component>): Promise<Component> {
    const response = await fetch(`${API_URL}/components/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<Component> {
    const response = await fetch(`${API_URL}/components/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
