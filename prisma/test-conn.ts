import { PrismaClient } from '@prisma/client';

async function test() {
  const passwords = ['postgres', 'root', 'admin', 'password', '1234', '123456', '', 'paypilot'];
  for (const pw of passwords) {
    const url = `postgresql://postgres:${pw}@localhost:5432/postgres?schema=public`;
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    try {
      await prisma.$connect();
      console.log('PostgreSQL connected successfully with password:', pw);
      await prisma.$disconnect();
      return;
    } catch (e: any) {
      console.log(`Password "${pw}" failed:`, e.message?.slice(0, 100));
    }
  }
}
test();
