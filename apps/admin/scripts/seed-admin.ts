import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";

async function main() {
  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log(`Admin "${username}" already exists`);
    return;
  }

  await prisma.admin.create({
    data: {
      username,
      passwordHash: hashPassword(password),
    },
  });

  console.log(`Admin created: ${username} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
