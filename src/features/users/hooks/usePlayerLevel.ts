import { useCallback, useState } from "react";
import { useApi } from "../../../shared/hooks/useApi";

export interface PlayerLevelResponse {
  level: number;
}

export const usePlayerLevel = () => {
  const playerLevelApi = useApi<PlayerLevelResponse>();
  const [level, setLevel] = useState<number>(0);

  const fetchPlayerLevel = useCallback(
    async (userId: string) => {
      const data = await playerLevelApi.get(`/users/${userId}/level`);
      if (data) {
        setLevel(data.level);
        return data.level;
      }
      return level;
    },
    [playerLevelApi],
  );

  return {
    level,
    isLoading: playerLevelApi.isLoading,
    error: playerLevelApi.error,
    clearError: playerLevelApi.clearError,
    fetchPlayerLevel,
  };
};
