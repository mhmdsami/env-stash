interface AddEnvProps {
  inputCount: number;
}

export default function AddEnv({ inputCount }: AddEnvProps) {
  return (
    <>
      {Array.from({ length: inputCount }, (_, i) => (
        <div key={i} className="flex gap-2">
          <input
            key={`key-${i + 1}`}
            type="text"
            name="key[]"
            className="text-field w-full"
            placeholder="API_BASE_URL"
          />
          <input
            key={`value-${i + 1}`}
            type="text"
            name="value[]"
            className="text-field w-full"
          />
        </div>
      ))}
    </>
  );
}
