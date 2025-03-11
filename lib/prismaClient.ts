import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // 本番環境では新しいインスタンスを作成
  prisma = new PrismaClient();
} else {
  // 開発環境ではグローバルインスタンスを使い回し
  // 開発環境での再利用を促進
  if (global.prisma === undefined) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
