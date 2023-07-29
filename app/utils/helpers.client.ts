import toast from "~/utils/toast.client";
import type { Env } from "~/types";

export const copyToClipboard = async (id: string, env: Env) => {
  const { name, envElements } = env;

  const text = envElements
    .map(({ key, value }) => `${key}=${value}`)
    .join("\n");
  await navigator.clipboard.writeText(text);
  toast.show(`${name} copied to clipboard!`, "🚀");
};

export const deleteEnv = async (id: string) => {
  const res = await fetch(`/env/delete?id=${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    toast.success("Env deleted!");
  } else {
    const data = await res.json();
    toast.error(data);
  }
};

export const getEnvById = (id: string, envs: Env[]) => {
  return envs.find((env) => env.id === id) as Env;
};
