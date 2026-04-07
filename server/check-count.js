const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const studentCount = await prisma.student.count();
    console.log(`Student Count: ${studentCount}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
