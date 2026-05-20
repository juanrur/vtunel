
  create policy "Users can update his own tasks"
  on "public"."tasks"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



