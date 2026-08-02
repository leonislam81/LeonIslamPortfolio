-- Run this after the individual dashboard table migrations.
-- The guarded blocks keep the Users table migration independent from optional modules.
do $$ begin
  if to_regclass('public.content_pages') is not null then
    execute 'drop policy if exists "Workspace members can manage content pages" on public.content_pages';
    execute 'create policy "Workspace members can manage content pages" on public.content_pages for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.content_revisions') is not null then
    execute 'drop policy if exists "Workspace members can manage content revisions" on public.content_revisions';
    execute 'create policy "Workspace members can manage content revisions" on public.content_revisions for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.audit_leads') is not null then
    execute 'drop policy if exists "Workspace members can manage leads" on public.audit_leads';
    execute 'create policy "Workspace members can manage leads" on public.audit_leads for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.audit_lead_activities') is not null then
    execute 'drop policy if exists "Workspace members can manage lead activity" on public.audit_lead_activities';
    execute 'create policy "Workspace members can manage lead activity" on public.audit_lead_activities for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.projects') is not null then
    execute 'drop policy if exists "Workspace members can manage projects" on public.projects';
    execute 'create policy "Workspace members can manage projects" on public.projects for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.project_tasks') is not null then
    execute 'drop policy if exists "Workspace members can manage project tasks" on public.project_tasks';
    execute 'create policy "Workspace members can manage project tasks" on public.project_tasks for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.dashboard_settings') is not null then
    execute 'drop policy if exists "Workspace members can manage dashboard settings" on public.dashboard_settings';
    execute 'create policy "Workspace members can manage dashboard settings" on public.dashboard_settings for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.site_operations') is not null then
    execute 'drop policy if exists "Workspace members can manage site operations" on public.site_operations';
    execute 'create policy "Workspace members can manage site operations" on public.site_operations for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.audit_scheduled_emails') is not null then
    execute 'drop policy if exists "Workspace members can manage scheduled emails" on public.audit_scheduled_emails';
    execute 'create policy "Workspace members can manage scheduled emails" on public.audit_scheduled_emails for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.email_campaigns') is not null then
    execute 'drop policy if exists "Workspace members can manage email campaigns" on public.email_campaigns';
    execute 'create policy "Workspace members can manage email campaigns" on public.email_campaigns for all to authenticated using (public.is_dashboard_workspace_member(owner_id)) with check (public.is_dashboard_workspace_member(owner_id))';
  end if;
  if to_regclass('public.dashboard_activity_log') is not null then
    execute 'drop policy if exists "Workspace members can view activity log" on public.dashboard_activity_log';
    execute 'create policy "Workspace members can view activity log" on public.dashboard_activity_log for select to authenticated using (public.is_dashboard_workspace_member(workspace_owner_id))';
    execute 'drop policy if exists "Workspace members can write activity log" on public.dashboard_activity_log';
    execute 'create policy "Workspace members can write activity log" on public.dashboard_activity_log for insert to authenticated with check (public.is_dashboard_workspace_member(workspace_owner_id))';
  end if;
  if to_regclass('public.dashboard_notifications') is not null then
    execute 'drop policy if exists "Workspace members can manage notifications" on public.dashboard_notifications';
    execute 'create policy "Workspace members can manage notifications" on public.dashboard_notifications for all to authenticated using (public.is_dashboard_workspace_member(workspace_owner_id)) with check (public.is_dashboard_workspace_member(workspace_owner_id))';
  end if;
end $$;

notify pgrst, 'reload schema';
