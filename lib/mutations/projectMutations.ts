import { ProjectStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { updateProjectStatus } from "../../actions/project/statusChange";

export function useUpdateProjectStatus() {
  return useMutation({
    mutationFn: async ({
      projectId,
      status,
    }: {
      projectId: string;
      status: ProjectStatus;
    }) => {
      const result = await updateProjectStatus(projectId, status);

      if (result?.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}
