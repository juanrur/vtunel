alter table "public"."templates" drop column "name";

alter table "public"."templates" add column "title" text not null;

alter table "public"."templates" alter column "id" set default gen_random_uuid();

alter table "public"."templates" alter column "id" drop identity;

alter table "public"."templates" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."templates" alter column "user_id" drop default;


