CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text,
	"department" text NOT NULL,
	"status" text DEFAULT 'Draft',
	"date" timestamp,
	"content" text,
	"target_type" text,
	"employee_id" text,
	"employee_name" text,
	"position" text,
	"attachment_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
