import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async create(createNoticeDto: CreateNoticeDto) {
    const notice = await this.db
      .insert(schema.notices)
      .values({
        ...createNoticeDto,
        date: createNoticeDto.date ? new Date(createNoticeDto.date) : undefined,
      })
      .returning();
    return notice[0];
  }

  async findAll() {
    return this.db
      .select()
      .from(schema.notices)
      .orderBy(desc(schema.notices.createdAt));
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
