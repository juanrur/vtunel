alter table "public"."templates" drop column "name";

alter table "public"."templates" add column "title" text not null;

-- primero quitar identity
alter table "public"."templates"
  alter column "id" drop identity if exists;

-- luego cambiar tipo
alter table "public"."templates"
  alter column "id" set data type uuid using gen_random_uuid();

-- luego poner default
alter table "public"."templates"
  alter column "id" set default gen_random_uuid();

alter table "public"."templates"
  alter column "user_id" drop default;
