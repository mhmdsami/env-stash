import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession, signIn } from "~/utils/session.server";
import type { ActionFunction, V2_MetaFunction } from "@remix-run/node";

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

  return createUserSession(user.id, "/");
};

export default function SignIn() {
  let actionData = useActionData<ActionData | undefined>();

  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <input
          name="username"
          type="text"
          placeholder="username"
          className="bg-secondary w-56 px-2 py-1 rounded-md border border-highlight"
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          className="bg-secondary w-56 px-2 py-1 rounded-md border border-highlight"
        />
        <Link className="text-sm hover:underline" to="/auth/signup">
          I don't have an account yet.
        </Link>
        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData?.formError}
            </p>
          ) : null}
        </div>
        <button type="submit" className="btn">
          Sign In
        </button>
      </Form>
    </div>
  );
}
