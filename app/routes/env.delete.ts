import { requireUserId } from "~/utils/session.server";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => redirect("/dashboard");

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (request.method !== "DELETE") {
    return new Response("Invalid method", { status: 400 });
  }

  if (!id) {
    return new Response("No id provided", { status: 400 });
  }

  const envExists = await db.env.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!envExists) {
    return new Response("You are not authorized to delete this env", {
      status: 400,
    });
  }

  const env = await db.env.delete({
    where: {
      id,
      userId,
    },
  });

  return json({ env });
};
