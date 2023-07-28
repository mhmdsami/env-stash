import { requireUserId } from "~/utils/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  return requireUserId(request);
};

export default function Index() {
  return (
    <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
      <div className="text-4xl font-bold">env stash</div>
      <form action="/auth/signout" method="post">
        <button type="submit" className="btn">
          Sign Out
        </button>
      </form>
    </div>
  );
}
