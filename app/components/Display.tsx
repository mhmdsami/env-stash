import type { Env as EnvType } from "~/types";

interface DisplayProps {
  envs: EnvType[];
}

export default function Display({ envs }: DisplayProps) {
  return (
    <div className="flex flex-col gap-2">
      {envs.length > 0 ? (
        <div className="flex flex-col gap-2 lg:w-2/5 mx-auto">
          <h1 className="pt-10 text-xl">Your Envs</h1>
          <div className="grid grid-cols-4 gap-2">
            <div className="table-element col-span-2 truncate">Id</div>
            <div className="table-element col-span-2">Name</div>
          </div>
          {envs.map(({ id, name, envElements }) => (
            <div key={id} className="grid grid-cols-4 gap-2">
              <div className="table-element col-span-2 truncate">{id}</div>
              <div className="table-element col-span-2">{name}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex items-center justify-center font-bold text-2xl">
          No env created yet!
        </p>
      )}
    </div>
  );
}
