import {
  serial,
  text,
  timestamp,
  time,
  pgTable,
  boolean,
  integer,
  date,
  numeric,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const questionType = pgTable('question_type', {
  questiontypeid: serial('questiontypeid').primaryKey().notNull(),
  questiontype: text('questiontype').notNull(),
  questiontypedesc: text('questiontypedesc').notNull(),
});

export const questions = pgTable('questions', {
  questionid: serial('questionid').primaryKey().notNull(),
  questiontext: text('questiontext').notNull(),
  questiontypeid: integer('questiontypeid').references(
    () => questionType.questiontypeid
  ),
});

export const options = pgTable('options', {
  optionid: serial('optionid').primaryKey().notNull(),
  optiontext: text('optiontext').notNull(),
  questionid: integer('questionid').references(() => questions.questionid),
});
