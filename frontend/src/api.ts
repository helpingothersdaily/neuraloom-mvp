const API_URL = "/api";

export interface Nest {
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
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data || json;
}

export const nestApi = {
  async getAllNests(): Promise<Nest[]> {
    const url = `${API_URL}/nests`;
    console.log("Fetching:", url);
    try {
      const response = await fetch(url);
      console.log("Response status:", response.status);
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch nests:", error);
      throw new Error(`Cannot connect to API at ${API_URL}.`);
    }
  },

  async getNestById(id: string): Promise<Nest> {
    const response = await fetch(`${API_URL}/nests/${id}`);
    return handleResponse(response);
  },

  async createNest(title: string, description = "", category = "general"): Promise<Nest> {
    const url = `${API_URL}/nests`;
    const payload = { title, description, category };
    console.log("Creating nest at:", url, payload);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Create response status:", response.status);
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to create nest:", error);
      throw new Error(`Cannot reach API at ${API_URL}`);
    }
  },

  async updateNest(id: string, updates: Partial<Nest>): Promise<Nest> {
    const response = await fetch(`${API_URL}/nests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  async deleteNest(id: string): Promise<Nest> {
    const response = await fetch(`${API_URL}/nests/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
