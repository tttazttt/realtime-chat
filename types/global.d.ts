// global.d.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined; // prismaを追加し、型を指定
}

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    image: string;
  }

  interface Session {
    user: User;
  }
}
