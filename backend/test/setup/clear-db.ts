import { beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma.js';

beforeEach(async () => {
  // Add all your models here to ensure a clean slate
  await prisma.user.deleteMany();
  // await prisma.post.deleteMany(); 
});