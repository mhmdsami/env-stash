import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession, signUp } from "~/utils/session.server";
import { useEffect } from "react";
import toast from "~/utils/toast.client";
import type { ActionFunction, V2_MetaFunction } from "@remix-run/node";

type ActionData = {
  formError?: string;
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Sign Up | env stash" },
    { name: "description", content: "Sign Up for env stash" },
  ];
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  const form = await request.formData();
  const email = form.get("email");
  const username = form.get("username");
  const password = form.get("password");

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return {
      formError: "Form not submitted correctly.",
    };
  }

  const user = await signUp(email, username, password);
  if (!user) {
    return {
      formError: "Username or email already exists.",
    };
  }

  return createUserSession(user.id, "/dashboard");
};

export default function SignUp() {
  let actionData = useActionData<ActionData | undefined>();

  useEffect(() => {
    if (actionData?.formError) {
      toast.error(actionData.formError);
    }
  }, [actionData]);

  return (
    <>
      <h1 className="text-3xl font-bold">Get Started!</h1>
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
      >
        <input
          name="email"
          type="email"
          placeholder="email"
          className="text-field w-56"
        />
        <input
          name="username"
          type="text"
          placeholder="username"
          className="text-field w-56"
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          className="text-field w-56"
        />
        <Link className="text-sm hover:underline" to="/auth/signin">
          I have an account already!
        </Link>
        <button type="submit" className="btn">
          Sign In
        </button>
      </Form>
    </>
  );
}
