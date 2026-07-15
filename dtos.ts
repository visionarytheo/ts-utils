export function ResDto<T>({
  status,
  data,
  message,
}: {
  status: number;
  data?: T;
  message?: { success?: string; error?: string };
}) {
  return {
    status,
    data,
    message: message?.success ?? message?.error,
  };
}

