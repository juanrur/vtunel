create extension if not exists "pgjwt" with schema "extensions";

drop extension if exists "pg_net";

create type "public"."recurrence_enum" as enum ('none', 'daily', 'weekly', 'monthly', 'yearly');


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "startTime" timestamp without time zone not null,
    "endTime" timestamp without time zone not null,
    "name" text,
    "user_id" uuid not null,
    "recurrence_type" public.recurrence_enum default 'none'::public.recurrence_enum,
    "recurrence_interval" integer default 1,
    "recurrence_days" character varying(7),
    "recurrence_end" date,
    "exception_dates" text
      );


alter table "public"."events" enable row level security;


  create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "startTime" timestamp without time zone not null,
    "endTime" timestamp without time zone not null,
    "name" text,
    "user_id" uuid not null,
    "done" boolean not null default false
      );


alter table "public"."tasks" enable row level security;


  create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX "event system db_pkey" ON public.events USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."events" add constraint "event system db_pkey" PRIMARY KEY using index "event system db_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."events" add constraint "events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_user_id_fkey";

alter table "public"."tasks" add constraint "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
begin
  insert into public.users (id, created_at, name)
  values (
    new.id,
    now(),
    new.raw_user_meta_data->>'name'
  )
  on conflict (id) do nothing;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_user_in_public_table_for_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
begin
  -- Inserta o actualiza el usuario en la tabla pública
  insert into public.users (id, name, created_at)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name', -- si lo pasas en el signup
      new.raw_user_meta_data->>'name',      -- otro posible campo
      new.email,                            -- fallback: email
      ''                                    -- último recurso
    ),
    now()
  )
  on conflict (id) do update
  set
    name = coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.email,
      users.name
    );

  return new;

exception
  when others then
    -- evita que un fallo bloquee la creación de usuario en auth.users
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_user_in_public_table_for_new_user(p_user_id uuid, p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (p_user_id, p_email);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (NEW.id, NEW.email, NEW.name, NEW.avatar_url)
    ON CONFLICT (id) DO UPDATE SET
        email      = EXCLUDED.email,
        name       = COALESCE(EXCLUDED.name, public.users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Enable delete for all users"
  on "public"."events"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert for all users"
  on "public"."events"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for all users"
  on "public"."events"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Allow everybody to read users information"
  on "public"."users"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.insert_user_in_public_table_for_new_user();


