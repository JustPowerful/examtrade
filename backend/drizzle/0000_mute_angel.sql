CREATE TYPE "public"."user_role" AS ENUM('student', 'professor', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY GENERATED ALWAYS AS (uuid_generate_v4()) STORED NOT NULL,
	"firstname" varchar NOT NULL,
	"lastname" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL
);
