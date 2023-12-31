import DisplayDetails from "~/components/DisplayDetails";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { Env } from "~/types";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { decrypt } from "~/utils/crypto.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dashboard | env stash" },
    { name: "description", content: "Dashboard" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const encryptedEnvs = (await db.env.findMany({
    where: {
      userId,
    },
  })) as Env[];

  const envs = encryptedEnvs.map((encryptedEnv) => ({
    ...encryptedEnv,
    envElements: encryptedEnv.envElements.map(({ key, value }) => ({
      key: decrypt(key),
      value: decrypt(value),
    })),
  }));

  return json({ envs });
};

export default function Dashboard() {
  const { envs } = useLoaderData();

  return (
    <div className="px-10 py-5">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Outlet />
      <DisplayDetails envs={envs} />
    </div>
  );
}
