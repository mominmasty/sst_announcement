import { pgTable, serial, text, varchar, boolean, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['student', 'student_admin', 'admin', 'super_admin', 'user']);
export const eventTypeEnum = pgEnum('event_type', ['view', 'click', 'dismiss']);

// Enum for announcement status
export const announcementStatusEnum = pgEnum('announcement_status', [
  'draft',
  'under_review',
  'approved',
  'rejected',
  'scheduled',
  'active',
  'urgent',
  'expired'
]);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  username: varchar('username', { length: 100 }),
  role: userRoleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  expiryDate: timestamp('expiry_date', { withTimezone: true }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  reminderTime: timestamp('reminder_time', { withTimezone: true }),
  isActive: boolean('is_active').default(true),
  status: announcementStatusEnum('status').default('draft').notNull(),
  viewsCount: integer('views_count').default(0),
  clicksCount: integer('clicks_count').default(0),
  sendEmail: boolean('send_email').default(false),
  emailSent: boolean('email_sent').default(false),
  priorityUntil: timestamp('priority_until', { withTimezone: true }),
  isEmergency: boolean('is_emergency').default(false).notNull(),
  emergencyExpiresAt: timestamp('emergency_expires_at', { withTimezone: true }),
  visibleAfter: timestamp('visible_after', { withTimezone: true }),
});

export const announcementEngagements = pgTable('announcement_engagements', {
  id: serial('id').primaryKey(),
  announcementId: integer('announcement_id').notNull().references(() => announcements.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  eventType: text('event_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Announcement comments table
export const announcementComments = pgTable('announcement_comments', {
  id: serial('id').primaryKey(),
  announcementId: integer('announcement_id').notNull().references(() => announcements.id, { onDelete: 'cascade' }),
  authorId: integer('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetAdminId: integer('target_admin_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations (optional, for easier joins)
export const usersRelations = relations(users, ({ many }) => ({
  announcements: many(announcements),
  engagements: many(announcementEngagements),
}));

export const announcementsRelations = relations(announcements, ({ one, many }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
  engagements: many(announcementEngagements),
}));

export const announcementEngagementsRelations = relations(announcementEngagements, ({ one }) => ({
  announcement: one(announcements, {
    fields: [announcementEngagements.announcementId],
    references: [announcements.id],
  }),
  user: one(users, {
    fields: [announcementEngagements.userId],
    references: [users.id],
  }),
}));

export const announcementCommentsRelations = relations(announcementComments, ({ one }) => ({
  announcement: one(announcements, {
    fields: [announcementComments.announcementId],
    references: [announcements.id],
  }),
  author: one(users, {
    fields: [announcementComments.authorId],
    references: [users.id],
  }),
  targetAdmin: one(users, {
    fields: [announcementComments.targetAdminId],
    references: [users.id],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type AnnouncementEngagement = typeof announcementEngagements.$inferSelect;
export type NewAnnouncementEngagement = typeof announcementEngagements.$inferInsert;
export type AnnouncementComment = typeof announcementComments.$inferSelect;
export type NewAnnouncementComment = typeof announcementComments.$inferInsert;
