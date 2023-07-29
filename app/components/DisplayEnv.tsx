import { copyToClipboard, deleteEnv } from "~/utils/helpers.client";
import { ClipboardCopy, Pen, Trash } from "lucide-react";
import { useNavigate } from "@remix-run/react";
import type { Env } from "~/types";

interface DisplayEnvProps {
  env: Env;
}

export default function DisplayEnv({ env }: DisplayEnvProps) {
  const navigate = useNavigate();
  const { id, envElements } = env;

  return (
    <div className="flex flex-col gap-2 mx-auto lg:w-2/5 min-h-[85vh] justify-center">
      <div className="flex items-center gap-2 self-end">
        <Pen
          width={16}
          height={16}
          className="hover:text-green-400"
          onClick={() => navigate(`/env/${id}/edit`)}
        />
        <ClipboardCopy
          width={16}
          height={16}
          className="hover:text-green-400"
          onClick={() => copyToClipboard(id, env)}
        />
        <Trash
          width={16}
          height={16}
          className="hover:text-red-400"
          onClick={async () => {
            await deleteEnv(id);
            navigate("/dashboard");
          }}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="table-element col-span-2">key</div>
        <div className="table-element col-span-2">value</div>
      </div>
      {envElements.map(({ key, value }) => (
        <div key={key} className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="table-element col-span-2">{key}</div>
            <div className="table-element col-span-2">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
