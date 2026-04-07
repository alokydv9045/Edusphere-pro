const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Finalizing Data Enrichment (Schema Match Fix)...');

  const academicYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
  if (!academicYear) return;

  const students = await prisma.student.findMany({ where: { status: 'ACTIVE' } });
  
  // ─── SERVICE REQUESTS ─────────────────────────────
  console.log('🛠️ Seeding final Service Requests...');
  for (let i = 0; i < 5; i++) {
    const reqNo = `REQ-FIN-${Date.now()}-${i}`;
    const student = students[i % students.length];
    
    const existing = await prisma.serviceRequest.findUnique({ where: { requestNumber: reqNo } });
    if (existing) continue;

    await prisma.serviceRequest.create({
      data: {
        requestNumber: reqNo,
        requesterId: student.userId,
        type: 'OTHER',
        subject: 'Service Enrichment Test',
        description: 'Auto-generated request to verify system operational capacity.',
        status: 'PENDING',
        priority: 'NORMAL'
        // academicYearId intentionally removed as it is not in the schema
      }
    });
  }

  console.log('\n✨ Database Enrichment Complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
