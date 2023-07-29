import type { Env } from "~/types";

interface DisplayEnvProps {
  env: Env;
}

export default function EditEnv({ env }: DisplayEnvProps) {
  const { envElements } = env;

  return (
    <>
      <div className="flex gap-2">
        <div className="table-element w-full">key</div>
        <div className="table-element w-full">value</div>
      </div>
      {envElements.map(({ key, value }) => (
        <div key={key} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={key}
              name="key[]"
              className="text-field w-full"
            />
            <input
              type="text"
              defaultValue={value}
              name="value[]"
              className="text-field w-full"
            />
          </div>
        </div>
      ))}
    </>
  );
}
