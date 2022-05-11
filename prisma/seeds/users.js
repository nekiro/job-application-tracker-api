import prisma from '../../src/database';
import { encrypt, generateSalt } from '../../src/utils/crypt';

const users = [
  {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@admin.pl',
    password: 'admin',
    role: 'ADMIN',
  },
  {
    firstName: 'Marcin',
    lastName: 'J',
    email: 'marcinj@gmail.com',
    password: 'marcin',
    role: 'USER',
  },
];

const seedUsers = async () => {
  console.log('Seeding users...');

  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          ...user,
          tokenSecret: await generateSalt(6),
          password: await encrypt(user.password),
        },
      });
    } catch (err) {
      // ignore err
    }
  }

  console.log('users table:', await prisma.user.findMany());
};

export default seedUsers;
