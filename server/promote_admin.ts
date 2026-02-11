import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found.');
    return;
  }
  
  console.log('Users found:', users.map(u => ({ email: u.email, role: u.role })));
  const firstUser = users[0];
  
  const updated = await prisma.user.update({
    where: { id: firstUser.id },
    data: { role: 'admin' }
  });
  
  console.log(`Successfully promoted ${updated.email} to admin.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
