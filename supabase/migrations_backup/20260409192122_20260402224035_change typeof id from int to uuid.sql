alter table "public"."tasks" drop column "endTime";

alter table "public"."tasks" drop column "name";

alter table "public"."tasks" drop column "startTime";

alter table "public"."tasks" add column "end_time" timestamp without time zone not null;

alter table "public"."tasks" add column "start_time" timestamp without time zone not null;

alter table "public"."tasks" add column "title" text;


  create policy "Enable users to view their own data only"
  on "public"."tasks"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."templates"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



