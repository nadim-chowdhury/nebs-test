import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type'), // Single string or comma-separated for multiple types
  department: text('department').notNull(), // Target audience (e.g., 'HR', 'All Department')
  status: text('status').default('Draft'), // 'Published', 'Draft', 'Unpublished', 'Archived'
  date: timestamp('date'), // Publish date
  content: text('content'), // Notice Body

  // Specific to targeting individuals
  targetType: text('target_type'), // 'individual', 'all', 'hr', etc.
  employeeId: text('employee_id'),
  employeeName: text('employee_name'),
  position: text('position'),

  attachmentUrl: text('attachment_url'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
