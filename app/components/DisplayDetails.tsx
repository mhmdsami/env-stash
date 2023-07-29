import { ClipboardCopy, Eye, Pen, Trash } from "lucide-react";
import { useNavigate, useRevalidator } from "@remix-run/react";
import { copyToClipboard, deleteEnv, getEnvById } from "~/utils/helpers.client";
import type { Env } from "~/types";

interface DisplayDetailsProps {
  envs: Env[];
}

export default function DisplayDetails({ envs }: DisplayDetailsProps) {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  return (
    <div className="flex flex-col lg:w-2/5 mx-auto gap-2">
      <h1 className="pt-10 text-xl">Your Envs</h1>
      {envs.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-6 gap-2">
            <div className="table-element col-span-2 truncate">Id</div>
            <div className="table-element col-span-4">Name</div>
          </div>
          {envs.map(({ id, name, envElements }) => (
            <div key={id} className="grid grid-cols-6 gap-2">
              <div className="table-element col-span-2 truncate">{id}</div>
              <div className="table-element flex items-center justify-between col-span-4">
                {name}
                <div className="flex items-center gap-2">
                  <Pen
                    width={16}
                    height={16}
                    className="hover:text-green-400"
                    onClick={() => navigate(`/env/${id}/edit`)}
                  />
                  <Eye
                    width={20}
                    height={20}
                    className="hover:text-green-400"
                    onClick={() => navigate(`/env/${id}`)}
                  />
                  <ClipboardCopy
                    width={16}
                    height={16}
                    className="hover:text-green-400"
                    onClick={() => copyToClipboard(id, getEnvById(id, envs))}
                  />
                  <Trash
                    width={16}
                    height={16}
                    className="hover:text-red-400"
                    onClick={async () => {
                      await deleteEnv(id);
                      revalidate();
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 flex items-center justify-center font-bold text-2xl">
          No env created yet!
        </p>
      )}
    </div>
  );
}
