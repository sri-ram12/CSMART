const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'file:./prisma/dev.db' } } });

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true }
  });
  console.log('Admin users:', JSON.stringify(admins, null, 2));
}
main().finally(() => prisma.$disconnect());
