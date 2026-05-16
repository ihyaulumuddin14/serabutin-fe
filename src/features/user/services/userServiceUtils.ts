export const ensureSuccess = <T extends { status?: string; message?: string }>(
  response: { data: T },
  fallbackMessage: string,
) => {
  if (response.data.status !== "success") {
    throw new Error(response.data?.message || fallbackMessage);
  }

  return response.data;
};
