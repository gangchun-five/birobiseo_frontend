import { useQuery } from '@tanstack/react-query';

import { createRecommendationAction } from '@/services/domains/recommendation/actions';

export function useRecommendationQuery(...input: Parameters<typeof createRecommendationAction>) {
  return useQuery({
    queryKey: ['recommendationData', input],
    queryFn: async () => {
      const result = await createRecommendationAction(...input);

      if (!result.success || !result.data) {
        throw new Error(result.error?.message ?? "추천 분석에 실패했습니다.");
      }

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    enabled: false
  });
}
