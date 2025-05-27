import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or your preferred toast lib
import { removeEmployeeFromProject } from "../../actions/employee/removeEmployeeFromProject";

interface RemoveParams {
  projectId: string;
  userId: string;
}

export function useRemoveEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId }: RemoveParams) => {
      const response = await removeEmployeeFromProject({ projectId, userId });

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: (_, { projectId }) => {
      toast.success("Employee removed from project.");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove employee.");
    },
  });
}
