import prisma from '../';

const jobs = [
  {
    name: 'Junior Node.js Developer',
  },
  {
    name: 'Mid PHP Developer',
  },
];

const main = async () => {
  // console.log('Seeding jobs...');

  // const users = await prisma.user.findMany();

  // const companies = await prisma.company.findMany();

  // for (const [index, user] of users.entries()) {
  //   try {
  //     const job = jobs[index];
  //     if (!job) {
  //       continue;
  //     }

  //     await prisma.job.create({
  //       data: {
  //         ...job,
  //         userId: user.id,
  //         companyId: companies[index].id,
  //       },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     // ignore err
  //   }
  // }

  console.log('jobs table:', await prisma.job.findMany());
};

export default main;
