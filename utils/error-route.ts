type ErrorRouteInput = {
  code: string;
  message: string;
  returnTo?: string;
};

export function getErrorRoute({ code, message, returnTo = "/" }: ErrorRouteInput) {
  const params = new URLSearchParams({
    code,
    message,
    returnTo
  });

  return `/error?${params.toString()}`;
}
