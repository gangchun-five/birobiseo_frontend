export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "development") {
    return;
  }

  const { ensureSeeded } = await import("./services/seed-data");
  await ensureSeeded();
}
