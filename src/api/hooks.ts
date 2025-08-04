import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

// Типы данных на основе API из main.py
export interface User {
  id: number;
  tg_id: number;
  username: string;
  firstname: string;
  created_at: string;
  free_trial_expires_at?: string;
}

export interface Server {
  id: number;
  name: string;
  host: string;
  port: number;
  country?: string;
  is_active: boolean;
  created_at: string;
}

export interface Protocol {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserConfig {
  id: number;
  config_name: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  protocol: string;
  server_name: string;
  server_country: string;
  config_content: string;
}

export interface Purchase {
  id: number;
  user_id: number;
  config_id: number;
  amount: number;
  duration_days: number;
  purchase_type: string;
  created_at: string;
}

export interface FreeTrialStatus {
  user_id: number;
  available: boolean;
  used: boolean;
  expires_at?: string;
}

// Типы для запросов
export interface CreateUserRequest {
  user_id: number;
  username: string;
  firstname: string;
  activate_trial?: boolean;
  trial_days?: number;
}

export interface CreateConfigRequest {
  user_id: number;
  server_id: number;
  protocol_id: number;
  config_name: string;
  duration_days?: number;
}

export interface BuyConfigRequest {
  user_id: number;
  server_id: number;
  protocol_id: number;
  config_name: string;
  config_content: string;
  amount: number;
  duration_days?: number;
  use_free_trial?: boolean;
}

export interface RenewConfigRequest {
  config_id: number;
  user_id: number;
  amount: number;
  duration_days: number;
}

// Ключи для кэширования
export const queryKeys = {
  users: ["users"] as const,
  user: (id: number) => ["users", id] as const,
  userFreeTrial: (id: number) => ["users", id, "free-trial"] as const,
  servers: ["servers"] as const,
  protocols: ["protocols"] as const,
  configs: ["configs"] as const,
  userConfigs: (userId: number) => ["configs", "user", userId] as const,
  userActiveConfigs: (userId: number) =>
    ["configs", "user", userId, "active"] as const,
  config: (id: number) => ["configs", id] as const,
  purchases: ["purchases"] as const,
  userPurchases: (userId: number) => ["purchases", "user", userId] as const,
};

// Хуки для пользователей
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest) => {
      return apiClient.post<User>(
        "/api/users",
        undefined,
        userData as unknown as Record<string, string | number | boolean>
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      console.log("Пользователь создан:", data);
    },
    onError: (error) => {
      console.error("Ошибка при создании пользователя:", error);
    },
  });
};

export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => apiClient.get<User>(`/api/users/${userId}`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useGetUserFreeTrial = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userFreeTrial(userId),
    queryFn: () =>
      apiClient.get<FreeTrialStatus>(`/api/users/${userId}/free-trial`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useActivateFreeTrial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      trialDays,
    }: {
      userId: number;
      trialDays?: number;
    }) => {
      return apiClient.post<User>(
        `/api/users/${userId}/activate-trial`,
        undefined,
        {
          trial_days: trialDays || 7,
        }
      );
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userFreeTrial(userId),
      });
      console.log("Бесплатный пробный период активирован:", data);
    },
    onError: (error) => {
      console.error("Ошибка при активации пробного периода:", error);
    },
  });
};

// Хуки для серверов
export const useGetServers = () => {
  return useQuery({
    queryKey: queryKeys.servers,
    queryFn: () => apiClient.get<{ servers: Server[] }>("/api/servers"),
    staleTime: 10 * 60 * 1000, // 10 минут
  });
};

// Хуки для протоколов
export const useGetProtocols = () => {
  return useQuery({
    queryKey: queryKeys.protocols,
    queryFn: () => apiClient.get<{ protocols: Protocol[] }>("/api/protocols"),
    staleTime: 10 * 60 * 1000, // 10 минут
  });
};

// Хуки для конфигураций
export const useCreateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (configData: CreateConfigRequest) => {
      return apiClient.post<UserConfig>(
        "/api/configs",
        undefined,
        configData as unknown as Record<string, string | number | boolean>
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userConfigs(variables.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userActiveConfigs(variables.user_id),
      });
      console.log("Конфигурация создана:", data);
    },
    onError: (error) => {
      console.error("Ошибка при создании конфигурации:", error);
    },
  });
};

export const useGetUserConfigs = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userConfigs(userId),
    queryFn: () =>
      apiClient.get<{ configs: UserConfig[] }>(`/api/configs/user/${userId}`),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useGetUserActiveConfigs = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userActiveConfigs(userId),
    queryFn: () =>
      apiClient.get<{ configs: UserConfig[] }>(
        `/api/configs/user/${userId}/active`
      ),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useDeactivateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (configId: number) => {
      return apiClient.delete<{ message: string }>(`/api/configs/${configId}`);
    },
    onSuccess: (data) => {
      // Инвалидируем все кэши конфигураций
      queryClient.invalidateQueries({ queryKey: queryKeys.configs });
      console.log("Конфигурация деактивирована:", data);
    },
    onError: (error) => {
      console.error("Ошибка при деактивации конфигурации:", error);
    },
  });
};

export const useExtendConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      configId,
      additionalDays,
    }: {
      configId: number;
      additionalDays: number;
    }) => {
      return apiClient.put<UserConfig>(
        `/api/configs/${configId}/extend`,
        undefined,
        {
          additional_days: additionalDays,
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.configs });
      console.log("Конфигурация продлена:", data);
    },
    onError: (error) => {
      console.error("Ошибка при продлении конфигурации:", error);
    },
  });
};

// Хуки для покупок
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseData: {
      user_id: number;
      config_id: number;
      amount: number;
      duration_days: number;
      purchase_type?: string;
    }) => {
      return apiClient.post<Purchase>(
        "/api/purchases",
        undefined,
        purchaseData
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPurchases(variables.user_id),
      });
      console.log("Покупка создана:", data);
    },
    onError: (error) => {
      console.error("Ошибка при создании покупки:", error);
    },
  });
};

export const useGetUserPurchases = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userPurchases(userId),
    queryFn: () =>
      apiClient.get<{ purchases: Purchase[] }>(`/api/purchases/user/${userId}`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хуки для покупки конфигураций
export const useBuyConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (buyData: BuyConfigRequest) => {
      return apiClient.post<{ config: UserConfig; purchase: Purchase }>(
        "/api/buy-config",
        undefined,
        buyData as unknown as Record<string, string | number | boolean>
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userConfigs(variables.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userActiveConfigs(variables.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPurchases(variables.user_id),
      });
      console.log("Конфигурация куплена:", data);
    },
    onError: (error) => {
      console.error("Ошибка при покупке конфигурации:", error);
    },
  });
};

export const useRenewConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (renewData: RenewConfigRequest) => {
      return apiClient.post<{ config: UserConfig; purchase: Purchase }>(
        "/api/renew-config",
        undefined,
        renewData as unknown as Record<string, string | number | boolean>
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.configs });
      console.log("Конфигурация продлена:", data);
    },
    onError: (error) => {
      console.error("Ошибка при продлении конфигурации:", error);
    },
  });
};

// Хук для создания инвойса
export const useCreateInvoice = () => {
  return useMutation({
    mutationFn: async (invoiceData: {
      title: string;
      description: string;
      payload: string;
      price: number;
    }) => {
      return apiClient.get<{ invoice: string }>(
        "/api/create_invoice",
        invoiceData
      );
    },
    onSuccess: (data) => {
      console.log("Инвойс создан:", data);
    },
    onError: (error) => {
      console.error("Ошибка при создании инвойса:", error);
    },
  });
};

// Хук для отправки конфигурации в Telegram
export const useSendConfigToTelegram = () => {
  return useMutation({
    mutationFn: async ({
      configId,
      chatId,
    }: {
      configId: number;
      chatId: number;
    }) => {
      return apiClient.post<{ message: string }>(
        `/api/configs/${configId}/send-to-telegram`,
        undefined,
        {
          chat_id: chatId,
        }
      );
    },
    onSuccess: (data) => {
      console.log("Конфигурация отправлена в Telegram:", data);
    },
    onError: (error) => {
      console.error("Ошибка при отправке конфигурации в Telegram:", error);
    },
  });
};

// Хук для отправки активной конфигурации пользователя в Telegram
export const useSendUserActiveConfigToTelegram = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      chatId,
    }: {
      userId: number;
      chatId: number;
    }) => {
      return apiClient.post<{ message: string }>(
        `/api/users/${userId}/send-active-config-to-telegram`,
        undefined,
        {
          chat_id: chatId,
        }
      );
    },
    onSuccess: (data) => {
      console.log("Активная конфигурация отправлена в Telegram:", data);
    },
    onError: (error) => {
      console.error(
        "Ошибка при отправке активной конфигурации в Telegram:",
        error
      );
    },
  });
};
