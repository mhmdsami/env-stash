import EditEnv from "~/components/EditEnv";
import { requireUserId } from "~/utils/session.server";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import AddEnv from "~/components/AddEnv";
import toast from "~/utils/toast.client";
import { decrypt, encrypt } from "~/utils/crypto.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { Prisma } from "@prisma/client";
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

type ActionData = {
  updatedEnv?: Env;
  formError?: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  const form = await request.formData();
  const name = form.get("name");
  const keys = form.getAll("key[]") as string[];
  const values = form.getAll("value[]") as string[];

  if (!id) {
    return {
      formError: "Something went wrong.",
    };
  }

  if (
    typeof name !== "string" ||
    !Array.isArray(keys) ||
    !Array.isArray(values)
  ) {
    return {
      formError: "Form not submitted correctly.",
    };
  }

  if (keys.length !== values.length) {
    return {
      formError: "Form not submitted correctly.",
    };
  }

  if (!name) {
    return {
      formError: "Name is required.",
    };
  }

  if (keys.some((key) => !key) || values.some((value) => !value)) {
    return {
      formError: "All key/value pairs are required.",
    };
  }

  if (!keys[0] || !values[0]) {
    return {
      formError: "At least one key/value pair is required.",
    };
  }

  const env = await db.env.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!env) redirect("/dashboard");

  const envElements = keys.map((key, i) => ({
    key: encrypt(key),
    value: encrypt(values[i]),
  })) as Prisma.JsonArray;

  const updatedEnv = await db.env.update({
    where: {
      id,
    },
    data: {
      envElements,
    },
  });

  return json({ updatedEnv });
};

export default function ViewEnv() {
  const { env } = useLoaderData();
  const [inputCount, setInputCount] = useState(0);
  const actionData = useActionData<ActionData | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.formError) {
      toast.error(actionData.formError);
    }

    if (actionData?.updatedEnv) {
      console.log(actionData.updatedEnv);
      toast.success("Env updated!");

      navigate("/dashboard");
    }
  }, [navigate, actionData]);

  return (
    <div className="mt-10 gap-2 flex flex-col mx-auto lg:w-2/5 min-h-[85vh] items-center">
      <Form method="post" className="flex flex-col gap-3 w-full">
        <button type="submit" className="btn self-end">
          Save
        </button>
        <input
          type="text"
          name="name"
          defaultValue={env.name}
          placeholder="env name"
          className="text-field w-56"
        />
        <EditEnv env={env} />
        <AddEnv inputCount={inputCount} />
      </Form>
      <button
        type="button"
        className="btn self-end"
        onClick={() => setInputCount((count) => count + 1)}
      >
        + Add Another
      </button>
    </div>
  );
}
