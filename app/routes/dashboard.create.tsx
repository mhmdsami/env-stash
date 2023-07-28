import { useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import type { ActionFunction, V2_MetaFunction } from "@remix-run/node";
import type { Prisma } from "@prisma/client";
import type { Env } from "~/types";
import { requireUserId } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Create | env stash" },
    { name: "description", content: "Create env" },
  ];
};

type ActionData = {
  env?: Env;
  formError?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const keys = form.getAll("key[]");
  const values = form.getAll("value[]");

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

  const envElements = keys.map((key, i) => ({
    key,
    value: values[i],
  })) as Prisma.JsonArray;

  const env = await db.env.create({
    data: {
      name,
      envElements,
      userId,
    },
  });

  return json({ env });
};

export default function DashboardCreate() {
  const actionData = useActionData<ActionData | undefined>();
  const [inputCount, setInputCount] = useState(0);

  return (
    <div className="py-10 flex flex-col items-center gap-3">
      <Form method="post" className="flex flex-col gap-3 w-fit">
        <button type="submit" className="btn self-end">
          Create
        </button>
        <div className="flex flex-col gap-2">
          <label className="text-sm" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="dashboard-prod"
            className="text-field"
            aria-describedby={
              actionData?.formError ? "form-error-message" : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-3 w-fit">
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="key">
                key
              </label>
              <input
                key="key-0"
                type="text"
                name="key[]"
                className="text-field"
                placeholder="API_BASE_URL"
                aria-describedby={
                  actionData?.formError ? "form-error-message" : undefined
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="value">
                value
              </label>
              <input
                key="value-0"
                type="text"
                name="value[]"
                className="text-field"
                aria-describedby={
                  actionData?.formError ? "form-error-message" : undefined
                }
              />
            </div>
          </div>
          {Array.from({ length: inputCount }, (_, i) => (
            <div key={i} className="flex gap-3">
              <input
                key={`key-${i + 1}`}
                type="text"
                name="key[]"
                className="text-field"
                placeholder="API_BASE_URL"
                aria-describedby={
                  actionData?.formError ? "form-error-message" : undefined
                }
              />
              <input
                key={`value-${i + 1}`}
                type="text"
                name="value[]"
                className="text-field"
                aria-describedby={
                  actionData?.formError ? "form-error-message" : undefined
                }
              />
            </div>
          ))}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="text-red-400" role="alert">
              {actionData?.formError}
            </p>
          ) : null}
        </div>
      </Form>
      <button
        type="button"
        className="btn"
        onClick={() => setInputCount((count) => count + 1)}
      >
        + Add Another
      </button>
    </div>
  );
}
