export type ActionResult<T = null> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

export function success<T>(data: T): ActionResult<T> {
  return { success: true, data, error: null };
}

export function failure<T = null>(message: string): ActionResult<T> {
  return { success: false, data: null, error: { message } };
}

export function formText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}
