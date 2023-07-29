import { requireUserId } from "~/utils/session.server";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import DisplayEnv from "~/components/DisplayEnv";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const { id } = params;
  if (!id) redirect("/dashboard");

  const env = await db.env.findUnique({
    where: {
      id,
      userId,
    },
  });

  return json({ env });
};

export default function ViewEnv() {
  const { env } = useLoaderData();

  return <DisplayEnv env={env} />;
}
