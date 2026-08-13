import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "rathitanishka07@gmail.com";
  const newClerkUserId = "user_3HxjNh7xX1Svg6MLl0GttXvDPHs";

  console.log(`Updating database user ${email} to use new Clerk ID ${newClerkUserId}...`);

  await prisma.user.update({
    where: { email },
    data: { clerkUserId: newClerkUserId },
  });

  console.log("Successfully fixed the user in the database!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
