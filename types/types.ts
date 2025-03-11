export type User = {
  name?: string | null;
  email: string | null;
  image?: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
};

export type Message = {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  user: User;
};
