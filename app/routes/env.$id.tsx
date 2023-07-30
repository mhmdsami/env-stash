import { requireUserId } from "~/utils/session.server";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { decrypt } from "~/utils/crypto.server";
import { useLoaderData } from "@remix-run/react";
import DisplayEnv from "~/components/DisplayEnv";
import type { LoaderFunction } from "@remix-run/node";
import type { Env } from "~/types";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const { id } = params;
  if (!id) redirect("/dashboard");

  const encryptedEnv = (await db.env.findUnique({
    where: {
      id,
      userId,
    },
  })) as Env;

  if (!encryptedEnv) redirect("/dashboard");

  const env = {
    ...encryptedEnv,
    envElements: encryptedEnv.envElements.map((envElement) => ({
      key: decrypt(envElement.key),
      value: decrypt(envElement.value),
    })),
  };

  return json({ env });
};

export default function ViewEnv() {
  const { env } = useLoaderData();

  return <DisplayEnv env={env} />;
}
