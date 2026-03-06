import api from "./api";

export const exportStageReport = async (stageId) => {
  const response = await api.get(`/reports/stage/${stageId}/export`, {
    responseType: "blob",
  });

  return response;
};
