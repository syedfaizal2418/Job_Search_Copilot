const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with starter profile and sample job...");

  // Initialize blank user profile (fresh start for user)
  await prisma.userProfile.upsert({
    where: { id: "default-user" },
    update: {
      fullName: "",
      targetRole: "",
      preferredTone: "professional",
      masterResumeText: "",
    },
    create: {
      id: "default-user",
      fullName: "",
      targetRole: "",
      preferredTone: "professional",
      masterResumeText: "",
    },
  });

  // Seed starter jobs
  const count = await prisma.jobApplication.count();
  if (count === 0) {
    const job1 = await prisma.jobApplication.create({
      data: {
        company: "Stripe",
        title: "Operations Project Specialist",
        location: "Remote (US)",
        salaryRange: "$110,000 - $135,000",
        column: "WISHLIST",
        order: 0,
        jobUrl: "https://stripe.com/jobs",
        jobDescription: `Stripe is looking for an Operations Project Specialist to help streamline global payments operations and lead cross-functional infrastructure initiatives.

Key Responsibilities:
- Manage end-to-end operational workflows supporting enterprise merchant onboarding and payments reliability.
- Build automated dashboards and reporting pipelines to monitor delivery KPIs and SLA compliance.
- Partner with product managers, financial partners, and engineering teams to identify process inefficiencies.
- Author clear documentation, playbooks, and change-management plans for new tool deployments.

Qualifications & Essential Skills:
- 4+ years in project coordination, business operations, or process management.
- Strong command of workflow tools (Jira, Linear, Asana) and data reporting.
- Proven track record of managing competing priorities in fast-paced tech environments.
- Excellent written and verbal communication skills with executive stakeholders.

Nice-to-Have Skills:
- Experience with SQL or data visualization platforms.
- Background in fintech, payment gateways, or regulatory compliance workflows.`,
      },
    });

    const job2 = await prisma.jobApplication.create({
      data: {
        company: "Figma",
        title: "Technical Program Coordinator",
        location: "San Francisco, CA / Hybrid",
        salaryRange: "$120,000 - $140,000",
        column: "APPLIED",
        order: 0,
        jobUrl: "https://figma.com/careers",
        jobDescription: `Figma is seeking a Technical Program Coordinator to join our Core Product Operations team.

What You'll Do:
- Drive team rituals, sprint planning, and quarterly planning cadences for design systems and developer tooling teams.
- Proactively track deliverables, identify technical dependencies, and clear blockers across engineering squads.
- Communicate project updates and release timelines across cross-functional partners in Product, Design, and QA.

Requirements:
- 3+ years experience facilitating agile ceremonies and technical project tracking.
- Exceptional organizational skills and ability to thrive in ambiguous, high-growth settings.
- Familiarity with modern collaboration stacks (Figma, GitHub, Slack).`,
      },
    });

    console.log("Seeded sample jobs:", job1.title, "and", job2.title);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

