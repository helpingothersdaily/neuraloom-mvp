const API_URL = "/api";

// Get the delete token from localStorage
function getDeleteToken(): string | null {
  return localStorage.getItem("deleteToken");
}

// Set the delete token in localStorage
export function setDeleteToken(token: string): void {
  localStorage.setItem("deleteToken", token);
}

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
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data || json;
}

export const api = {
  async getAll(): Promise<Component[]> {
    const url = `${API_URL}/components`;
    console.log("Fetching:", url);
    try {
      const response = await fetch(url);
      console.log("Response status:", response.status);
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch components:", error);
      throw new Error(`Cannot connect to backend at ${API_URL}. Make sure the server is running on port 5000.`);
    }
  },

  async getById(id: string): Promise<Component> {
    const response = await fetch(`${API_URL}/components/${id}`);
    return handleResponse(response);
  },

  async create(title: string, description = "", category = "general"): Promise<Component> {
    const url = `${API_URL}/components`;
    const payload = { title, description, category };
    console.log("Creating component at:", url, payload);
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
    const token = getDeleteToken();
    if (!token) {
      throw new Error("Delete token not set. Please configure your delete token.");
    }
    const response = await fetch(`${API_URL}/components/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
