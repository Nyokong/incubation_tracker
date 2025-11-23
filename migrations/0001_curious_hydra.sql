CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"formId" uuid,
	"submittedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_responseId_responses_id_fk";
--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "options" DROP CONSTRAINT "options_questionId_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_formId_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" DROP CONSTRAINT "responses_formId_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "shareId" SET DEFAULT 'poOqSROSz0WzDYKHtyGiS';--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_formId_forms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_responseId_responses_id_fk" FOREIGN KEY ("responseId") REFERENCES "public"."responses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "options" ADD CONSTRAINT "options_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_formId_forms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_formId_forms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;