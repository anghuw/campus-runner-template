import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { success, fail } from '../utils/response';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

const registerSchema = z.object({
  phone: z.string().min(11, '手机号格式不正确').max(11),
  nickname: z.string().min(1, '昵称不能为空').max(20),
  password: z.string().min(6, '密码至少6位').max(50),
  studentId: z.string().optional(),
});

const loginSchema = z.object({
  phone: z.string().min(11, '手机号格式不正确').max(11),
  password: z.string().min(1, '密码不能为空'),
});

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, parsed.error.issues[0].message);
    }

    const { phone, nickname, password, studentId } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return fail(res, '该手机号已注册');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { phone, nickname, passwordHash, studentId: studentId || null },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return success(res, {
      token,
      user: { id: user.id, phone: user.phone, nickname: user.nickname, studentId: user.studentId },
    }, '注册成功');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, parsed.error.issues[0].message);
    }

    const { phone, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return fail(res, '手机号或密码错误');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return fail(res, '手机号或密码错误');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return success(res, {
      token,
      user: { id: user.id, phone: user.phone, nickname: user.nickname, studentId: user.studentId },
    }, '登录成功');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, phone: true, nickname: true, studentId: true, avatarUrl: true, bio: true, role: true, createdAt: true },
    });

    if (!user) {
      return fail(res, '用户不存在', 404);
    }

    return success(res, user);
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

export default router;
