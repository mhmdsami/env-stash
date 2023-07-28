import { Link, useLocation } from "@remix-run/react";
import type { User as UserType } from "~/types";

interface NavbarProps {
  user?: UserType;
}

const Navbar = ({ user }: NavbarProps) => {
  const { pathname } = useLocation();

  const links: {
    [key: string]: {
      to: string;
      text: string;
    };
  } = {
    "/": {
      text: "Dashboard",
      to: "/dashboard",
    },
    "/dashboard": {
      text: "Create",
      to: "/dashboard/create",
    },
    "/dashboard/create": {
      text: "Dashboard",
      to: "/dashboard",
    },
  };

  const { text, to } = links[pathname in links ? pathname : "/"];

  return (
    <nav className="flex justify-between items-center px-10 h-16 bg-tertiary">
      <Link to="/" className="text-2xl font-bold">
        env stash
      </Link>
      {user ? (
        <div className="flex gap-2">
          <Link to={to} className="btn">
            {text}
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn">
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <Link to="/auth/signin" className="btn">
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
