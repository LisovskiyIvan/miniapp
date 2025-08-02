// @ts-expect-error: Свойство 'env' может отсутствовать на типе 'ImportMeta'
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ApiError {
  message: string;
  status: number;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    let url = `${this.baseURL}${endpoint}`;

    // Добавляем query параметры
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error("Неизвестная ошибка API");
    }
  }

  // GET запрос
  async get<T>(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, queryParams);
  }

  // POST запрос
  async post<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      queryParams
    );
  }

  // PUT запрос
  async put<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      queryParams
    );
  }

  // DELETE запрос
  async delete<T>(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, queryParams);
  }
}

// Экспортируем экземпляр клиента
export const apiClient = new ApiClient();
