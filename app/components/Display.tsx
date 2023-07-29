import toast from "~/utils/toast";
import { ClipboardCopy, Eye, Pen, Trash } from "lucide-react";
import { useNavigate, useRevalidator } from "@remix-run/react";
import type { Env as EnvType } from "~/types";

interface DisplayProps {
  envs: EnvType[];
}

export default function Display({ envs }: DisplayProps) {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const copyToClipboard = async (id: string) => {
    const env = envs.find((env) => env.id === id);
    if (!env) return;

    const { name, envElements } = env;

    const text = envElements
      .map(({ key, value }) => `${key}=${value}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    toast.show(`${name} copied to clipboard!`, "🚀");
  };

  const deleteEnv = async (id: string) => {
    const res = await fetch(`/env/delete?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Env deleted!");
      revalidate();
    } else {
      const data = await res.json();
      toast.error(data);
    }
  };

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
                    className="hover:text-blue-400"
                    onClick={() => navigate(`/dashboard/env/${id}/edit`)}
                  />
                  <Eye
                    width={20}
                    height={20}
                    className="hover:text-blue-400"
                    onClick={() => navigate(`/dashboard/env/${id}`)}
                  />
                  <ClipboardCopy
                    width={16}
                    height={16}
                    className="hover:text-blue-400"
                    onClick={() => copyToClipboard(id)}
                  />
                  <Trash
                    width={16}
                    height={16}
                    className="hover:text-red-400"
                    onClick={() => deleteEnv(id)}
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
