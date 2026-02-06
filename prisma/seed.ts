import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const subjects = [
  { name: "Mathematics", description: "Algebra, calculus, statistics, and more" },
  { name: "Physics", description: "Mechanics, electromagnetism, thermodynamics" },
  { name: "Programming", description: "JavaScript, Python, and general software development" },
  { name: "Languages", description: "Spanish, French, and other language learning" },
  { name: "Machine Learning", description: "ML fundamentals, neural networks, and applications" },
  { name: "Chemistry", description: "Organic, inorganic, and physical chemistry" },
  { name: "Writing", description: "Essay writing, creative writing, and communication" },
  { name: "Design", description: "UI/UX, graphic design, and design systems" },
];

async function main() {
  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { name: s.name },
      create: s,
      update: { description: s.description },
    });
  }
  console.log("Seeded subjects:", subjects.length);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
