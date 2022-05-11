import prisma from '../../src/database';

const companies = [
  {
    name: 'Jalochex',
    website: 'www.jalochex.pl',
    size: 2,
  },
  {
    name: 'Google',
    website: 'www.google.pl',
    size: 15000,
  },
];

const seedCompanies = async () => {
  console.log('Seeding companies...');

  const users = await prisma.user.findMany();

  for (const [index, user] of users.entries()) {
    try {
      const company = companies[index];
      if (!company) {
        console.log('?');
        continue;
      }

      await prisma.company.create({
        data: { ...company, userId: user.id },
      });
    } catch (err) {
      console.log(err);
      // ignore err
    }
  }

  console.log('companies table:', await prisma.company.findMany());
};

export default seedCompanies;
