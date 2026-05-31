import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { success, fail } from '../utils/response';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const VALID_TYPES = ['express', 'takeout', 'shopping', 'print', 'delivery', 'other'] as const;
const VALID_STATUSES = ['pending', 'accepted', 'picking', 'delivering', 'completed', 'cancelled'] as const;

const createTaskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(50),
  description: z.string().max(200).optional(),
  type: z.enum(VALID_TYPES, { errorMap: () => ({ message: '任务类型不合法' }) }),
  pickupLocation: z.string().min(1, '取件地点不能为空'),
  deliveryLocation: z.string().min(1, '送达地点不能为空'),
  reward: z.number().positive('赏金必须大于0'),
  contactInfo: z.string().min(1, '联系方式不能为空'),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().optional(),
});

// GET /api/tasks
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const type = typeof req.query.type === 'string' ? req.query.type : undefined;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

    const where: any = {};
    if (status && (VALID_STATUSES as readonly string[]).includes(status)) where.status = status;
    if (type && (VALID_TYPES as readonly string[]).includes(type)) where.type = type;
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { pickupLocation: { contains: keyword } },
        { deliveryLocation: { contains: keyword } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        publisher: { select: { id: true, nickname: true, avatarUrl: true } },
        runner: { select: { id: true, nickname: true, avatarUrl: true } },
        category: { select: { id: true, name: true, icon: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return success(res, tasks);
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id as string },
      include: {
        publisher: { select: { id: true, nickname: true, avatarUrl: true } },
        runner: { select: { id: true, nickname: true, avatarUrl: true } },
        category: { select: { id: true, name: true, icon: true } },
      },
    });

    if (!task) return fail(res, '任务不存在', 404);
    return success(res, task);
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/tasks
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, parsed.error.issues[0].message);
    }

    const task = await prisma.task.create({
      data: {
        ...parsed.data,
        description: parsed.data.description || null,
        imageUrl: parsed.data.imageUrl || null,
        categoryId: parsed.data.categoryId || null,
        publisherId: req.userId!,
      },
      include: {
        publisher: { select: { id: true, nickname: true, avatarUrl: true } },
      },
    });

    return success(res, task, '发布成功');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/tasks/:id/accept
router.post('/:id/accept', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return fail(res, '任务不存在', 404);
    if (task.status !== 'pending') return fail(res, '该任务不可接单');
    if (task.publisherId === req.userId) return fail(res, '不能接自己发布的任务');

    const updated = await prisma.task.update({
      where: { id },
      data: { status: 'accepted', runnerId: req.userId },
      include: {
        publisher: { select: { id: true, nickname: true } },
        runner: { select: { id: true, nickname: true } },
      },
    });

    return success(res, updated, '接单成功');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/tasks/:id/start
router.post('/:id/start', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return fail(res, '任务不存在', 404);
    if (task.status !== 'accepted') return fail(res, '该任务不可开始');
    if (task.runnerId !== req.userId) return fail(res, '只有接单者可以开始任务');

    const updated = await prisma.task.update({
      where: { id },
      data: { status: 'picking' },
    });

    return success(res, updated, '已开始取件');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/tasks/:id/complete
router.post('/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return fail(res, '任务不存在', 404);
    if (task.status !== 'picking' && task.status !== 'delivering') return fail(res, '该任务不可完成');
    if (task.runnerId !== req.userId) return fail(res, '只有接单者可以完成任务');

    const updated = await prisma.task.update({
      where: { id },
      data: { status: 'completed' },
    });

    return success(res, updated, '任务已完成');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/tasks/:id/confirm
router.post('/:id/confirm', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return fail(res, '任务不存在', 404);
    if (task.status !== 'completed') return fail(res, '只能确认已完成的任务');
    if (task.publisherId !== req.userId) return fail(res, '只有发布者可以确认');

    const updated = await prisma.task.update({
      where: { id },
      data: { status: 'completed' },
    });

    return success(res, updated, '已确认');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

// POST /api/tasks/:id/cancel
router.post('/:id/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return fail(res, '任务不存在', 404);
    if (task.publisherId !== req.userId) return fail(res, '只有发布者可以取消任务');
    if (task.status !== 'pending') return fail(res, '只能取消待接单的任务');

    const updated = await prisma.task.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    return success(res, updated, '任务已取消');
  } catch (err) {
    console.error(err);
    return fail(res, '服务器内部错误', 500);
  }
});

export default router;
