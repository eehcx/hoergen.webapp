import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FeedbackService } from '@/core/services/feedback/feedback.service'
import type { CreateFeedbackDto } from '@/core/types'

export function useFeedback() {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const feedbackService = FeedbackService.getInstance()
      const feedback = await feedbackService.getAllFeedback()
      return feedback
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useFeedbackMutations() {
  const queryClient = useQueryClient()
  const feedbackService = FeedbackService.getInstance()

  const createFeedback = useMutation({
    mutationFn: (data: CreateFeedbackDto) => feedbackService.createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
    },
  })

  const deleteFeedback = useMutation({
    mutationFn: (id: string) => feedbackService.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
    },
  })

  return {
    createFeedback,
    deleteFeedback,
  }
}
