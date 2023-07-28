export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: string;
  envs: Env[];
};

export type Env = {
  id: string;
  name: string;
  envElements: EnvElement[];
  user: User;
  userId: string;
};

export type EnvElement = {
  key: string;
  value: string;
};
