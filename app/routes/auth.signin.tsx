import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession, signIn } from "~/utils/session.server";
import type { ActionFunction, V2_MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import toast from "~/utils/toast.client";

type ActionData = {
  formError?: string;
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Sign In | env stash" },
    { name: "description", content: "Sign In into env stash" },
  ];
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return {
      formError: "Form not submitted correctly.",
    };
  }

  const user = await signIn(username, password);
  if (!user) {
    return {
      formError: "Invalid username or password.",
    };
  }

  return createUserSession(user.id, "/dashboard");
};

export default function SignIn() {
  let actionData = useActionData<ActionData | undefined>();

  useEffect(() => {
    if (actionData?.formError) {
      toast.error(actionData.formError);
    }
  }, [actionData]);

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
      >
        <input
          name="username"
          type="text"
          placeholder="username"
          className="text-field"
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          className="text-field"
        />
        <Link className="text-sm hover:underline" to="/auth/signup">
          I don't have an account yet.
        </Link>
        <button type="submit" className="btn">
          Sign In
        </button>
      </Form>
    </>
  );
}
