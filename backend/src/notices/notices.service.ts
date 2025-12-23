import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, and, or, ilike, sql } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async create(createNoticeDto: CreateNoticeDto) {
    const {
      title,
      content,
      department,
      status,
      type,
      targetType,
      employeeId,
      employeeName,
      position,
      attachmentUrl,
      date,
    } = createNoticeDto;

    const notice = await this.db
      .insert(schema.notices)
      .values({
        title,
        content,
        department,
        status: status || 'Draft',
        type,
        targetType,
        employeeId,
        employeeName,
        position,
        attachmentUrl,
        date: date ? new Date(date) : null,
      })
      .returning();
    return notice[0];
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    department?: string;
  }) {
    const { page, limit, search, status, department } = params;
    const offset = (page - 1) * limit;

    const where = and(
      status ? eq(schema.notices.status, status) : undefined,
      department ? eq(schema.notices.department, department) : undefined,
      search
        ? or(
            ilike(schema.notices.title, `%${search}%`),
            ilike(schema.notices.employeeName, `%${search}%`),
          )
        : undefined,
    );

    const [data, total] = await Promise.all([
      this.db
        .select()
        .from(schema.notices)
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(schema.notices.createdAt)),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(schema.notices)
        .where(where)
        .then((res) => Number(res[0].count)),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const notice = await this.db
      .select()
      .from(schema.notices)
      .where(eq(schema.notices.id, id));

    if (!notice.length) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    return notice[0];
  }

  async update(id: number, updateNoticeDto: UpdateNoticeDto) {
    const { date, ...rest } = updateNoticeDto;

    const updatedNotice = await this.db
      .update(schema.notices)
      .set({
        ...rest,
        ...(date ? { date: new Date(date) } : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.notices.id, id))
      .returning();

    if (!updatedNotice.length) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    return updatedNotice[0];
  }

  async remove(id: number) {
    const deletedNotice = await this.db
      .delete(schema.notices)
      .where(eq(schema.notices.id, id))
      .returning();

    if (!deletedNotice.length) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    return deletedNotice[0];
  }
}
