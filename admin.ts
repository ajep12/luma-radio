function readEnv(key: string): string {
  const value = (import.meta as unknown as { env: Record<string, string | undefined> }).env[key];
  return value?.trim() ?? "";
}

const adminEmails = readEnv("VITE_ADMIN_EMAILS")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails.includes(email.toLowerCase());
}
