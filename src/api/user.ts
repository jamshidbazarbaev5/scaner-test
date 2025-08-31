import {useMutation} from "@tanstack/react-query";
import {api} from "./api.ts";

interface UpdateUserData {
  first_name: string;
  last_name: string;
  phone: string;
}

interface ChangePasswordData {
  new_password: string;
}

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await api.put('/user/update', data);
      return response.data;
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post('/user/change-password/', data);
      return response.data;
    }
  });
};