import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession, signUp } from "~/utils/session.server";
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

  return createUserSession(user.id, "/");
};

export default function SignUp() {
  let actionData = useActionData<ActionData | undefined>();

  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Get Started!</h1>
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <input
          name="email"
          type="email"
          placeholder="email"
          className="bg-secondary w-56 px-2 py-1 rounded-md border border-highlight"
        />
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
        <Link className="text-sm hover:underline" to="/auth/signin">
          I have an account already!
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
