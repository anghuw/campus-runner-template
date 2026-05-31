import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: '代取快递' }, update: {}, create: { name: '代取快递', icon: 'package' } }),
    prisma.category.upsert({ where: { name: '代买餐食' }, update: {}, create: { name: '代买餐食', icon: 'utensils' } }),
    prisma.category.upsert({ where: { name: '代买物品' }, update: {}, create: { name: '代买物品', icon: 'shopping-bag' } }),
    prisma.category.upsert({ where: { name: '代打印' }, update: {}, create: { name: '代打印', icon: 'printer' } }),
    prisma.category.upsert({ where: { name: '代送文件' }, update: {}, create: { name: '代送文件', icon: 'file-text' } }),
    prisma.category.upsert({ where: { name: '其他' }, update: {}, create: { name: '其他', icon: 'more-horizontal' } }),
  ]);

  // Create demo users
  const hash = await bcrypt.hash('123456', 10);

  const user1 = await prisma.user.upsert({
    where: { phone: '13800000001' },
    update: {},
    create: { phone: '13800000001', nickname: '小明', passwordHash: hash, studentId: '2024001', bio: '勤工俭学，乐于助人' },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: '13800000002' },
    update: {},
    create: { phone: '13800000002', nickname: '小红', passwordHash: hash, studentId: '2024002', bio: '有空就帮忙' },
  });

  // Create demo tasks
  await prisma.task.createMany({
    data: [
      { title: '帮我取一下快递', description: '菜鸟驿站，取件码 6-3-2808', type: 'express', pickupLocation: '菜鸟驿站', deliveryLocation: '7号宿舍楼 312', reward: 5, contactInfo: '13800000001', publisherId: user1.id, status: 'pending', categoryId: categories[0].id },
      { title: '带一份黄焖鸡', description: '微辣，加米饭', type: 'takeout', pickupLocation: '美食城', deliveryLocation: '图书馆 3楼', reward: 3, contactInfo: '13800000001', publisherId: user1.id, status: 'pending', categoryId: categories[1].id },
      { title: '帮忙打印论文', description: 'A4双面，3份，U盘在宿管那', type: 'print', pickupLocation: '打印店', deliveryLocation: '5号宿舍楼', reward: 8, contactInfo: '13800000002', publisherId: user2.id, status: 'pending', categoryId: categories[3].id },
      { title: '送文件到教务处', description: '成绩单盖章，急用', type: 'delivery', pickupLocation: '行政楼 教务处', deliveryLocation: '3号教学楼 201', reward: 10, contactInfo: '13800000002', publisherId: user2.id, status: 'accepted', runnerId: user1.id, categoryId: categories[4].id },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
