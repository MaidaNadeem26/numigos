-- ==============================================================================
-- NUTECH EVENTS & SOCIETIES (NUMIGOS) - PRODUCTION DATABASE SCHEMA & RLS
-- ==============================================================================
-- Execute in Supabase Dashboard -> SQL Editor
-- This script creates all tables, constraints, foreign keys, triggers, RLS policies,
-- and seed data matching the current application implementation.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  roll_number text,
  department text,
  semester text,
  phone text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'society_admin', 'osa_admin')),
  managed_society_id text,
  is_verified boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. SOCIETIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.societies (
  id text primary key,
  name text not null,
  short_name text not null,
  tagline text,
  category text not null check (category in ('Technical', 'Creative', 'Community', 'Outdoor & Sports')),
  category_label text,
  dept text,
  faculty_advisor text,
  contact_email text,
  instagram text,
  meeting_schedule text,
  members_count int not null default 0,
  events_count int not null default 0,
  logo text,
  banner text,
  mission text,
  status text not null default 'Active & Approved by OSA',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.societies enable row level security;

drop policy if exists "Societies are viewable by everyone" on public.societies;
create policy "Societies are viewable by everyone"
  on public.societies for select to authenticated, anon
  using (true);

drop policy if exists "Admins can update their managed society" on public.societies;
create policy "Admins can update their managed society"
  on public.societies for update to authenticated
  using (
    id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  )
  with check (
    id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  );

-- ------------------------------------------------------------------------------
-- 3. SOCIETY TEAM MEMBERS (Roster)
-- ------------------------------------------------------------------------------
create table if not exists public.society_members (
  id text primary key default gen_random_uuid()::text,
  society_id text not null references public.societies (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  roll_number text not null,
  role text not null,
  group_name text not null check (group_name in ('Leadership', 'Core Team', 'Member')),
  department text,
  email text,
  avatar text,
  joined_date text,
  created_at timestamptz not null default now()
);

alter table public.society_members enable row level security;

drop policy if exists "Society members viewable by everyone" on public.society_members;
create policy "Society members viewable by everyone"
  on public.society_members for select to authenticated, anon
  using (true);

drop policy if exists "Admins can manage society members" on public.society_members;
create policy "Admins can manage society members"
  on public.society_members for all to authenticated
  using (
    society_id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  )
  with check (
    society_id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  );

-- ------------------------------------------------------------------------------
-- 4. EVENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.events (
  id text primary key,
  society_id text not null references public.societies (id) on delete cascade,
  society_name text not null,
  title text not null,
  short_title text,
  category text not null check (category in ('Workshops', 'Hackathons', 'Clubs', 'Cultural')),
  category_tag text,
  badge text,
  date text not null,
  date_label text,
  time_label text,
  date_time_full text,
  venue text not null,
  wing text,
  capacity int not null default 100,
  registered_count int not null default 0,
  deadline_text text,
  urgent boolean default false,
  image text,
  club_logo text,
  description text,
  status text not null default 'Pending Approval' check (status in ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Changes Requested', 'Completed', 'Cancelled')),
  osa_notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Approved events are viewable by everyone" on public.events;
create policy "Approved events are viewable by everyone"
  on public.events for select to authenticated, anon
  using (
    status = 'Approved' or status = 'Completed'
    or auth.uid() in (select id from public.profiles where managed_society_id = events.society_id)
  );

drop policy if exists "Admins can insert events for managed society" on public.events;
create policy "Admins can insert events for managed society"
  on public.events for insert to authenticated
  with check (
    society_id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  );

drop policy if exists "Admins can update events for managed society" on public.events;
create policy "Admins can update events for managed society"
  on public.events for update to authenticated
  using (
    society_id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  )
  with check (
    society_id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  );

-- ------------------------------------------------------------------------------
-- 5. REGISTRATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.registrations (
  id text primary key default gen_random_uuid()::text,
  event_id text not null references public.events (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  roll_number text not null,
  department text,
  semester text,
  email text not null,
  avatar text,
  status text not null default 'Registered' check (status in ('Registered', 'Attended', 'Absent')),
  registered_at timestamptz not null default now(),
  constraint unique_event_roll unique (event_id, roll_number)
);

alter table public.registrations enable row level security;

drop policy if exists "Users view own registrations or society admin view event registrants" on public.registrations;
create policy "Users view own registrations or society admin view event registrants"
  on public.registrations for select to authenticated
  using (
    user_id = auth.uid()
    or event_id in (
      select id from public.events where society_id in (
        select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin'
      )
    )
  );

drop policy if exists "Users can register for events" on public.registrations;
create policy "Users can register for events"
  on public.registrations for insert to authenticated
  with check (true);

drop policy if exists "Admins can update registrant attendance" on public.registrations;
create policy "Admins can update registrant attendance"
  on public.registrations for update to authenticated
  using (
    event_id in (
      select id from public.events where society_id in (
        select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin'
      )
    )
  );

-- ------------------------------------------------------------------------------
-- 6. BOOKMARKS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.bookmarks (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id text not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_user_event_bookmark unique (user_id, event_id)
);

alter table public.bookmarks enable row level security;

drop policy if exists "Users can manage own bookmarks" on public.bookmarks;
create policy "Users can manage own bookmarks"
  on public.bookmarks for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 7. CLUB FOLLOWERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.club_followers (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users (id) on delete cascade,
  society_id text not null references public.societies (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_user_society_follow unique (user_id, society_id)
);

alter table public.club_followers enable row level security;

drop policy if exists "Users can manage own followed clubs" on public.club_followers;
create policy "Users can manage own followed clubs"
  on public.club_followers for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 8. POSTS & POST LIKES TABLES
-- ------------------------------------------------------------------------------
create table if not exists public.posts (
  id text primary key,
  society_id text not null references public.societies (id) on delete cascade,
  society text not null,
  category text not null,
  time_ago text,
  logo_source text,
  image_source text,
  title text,
  body text not null,
  external_link_label text,
  external_link_url text,
  secondary_link_label text,
  secondary_link_url text,
  event_tag_id text,
  event_tag_label text,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "Posts are viewable by everyone" on public.posts;
create policy "Posts are viewable by everyone"
  on public.posts for select to authenticated, anon
  using (true);

create table if not exists public.post_likes (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id text not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_user_post_like unique (user_id, post_id)
);

alter table public.post_likes enable row level security;

drop policy if exists "Users can manage own post likes" on public.post_likes;
create policy "Users can manage own post likes"
  on public.post_likes for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 9. CHAT MESSAGES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.chat_messages (
  id text primary key default gen_random_uuid()::text,
  society_id text not null references public.societies (id) on delete cascade,
  sender_id text not null,
  sender_name text not null,
  sender_role text not null,
  sender_avatar text,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

drop policy if exists "Society chat viewable by society team" on public.chat_messages;
create policy "Society chat viewable by society team"
  on public.chat_messages for select to authenticated
  using (true);

drop policy if exists "Society chat insertable by authenticated users" on public.chat_messages;
create policy "Society chat insertable by authenticated users"
  on public.chat_messages for insert to authenticated
  with check (true);

-- ------------------------------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users (id) on delete cascade,
  society_id text references public.societies (id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('approval', 'registration', 'changes', 'team', 'reminder')),
  read boolean not null default false,
  target_route text,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Notifications viewable and manageable by recipient" on public.notifications;
create policy "Notifications viewable and manageable by recipient"
  on public.notifications for all to authenticated
  using (
    user_id = auth.uid()
    or society_id in (select managed_society_id from public.profiles where id = auth.uid() and role = 'society_admin')
  )
  with check (true);

-- ------------------------------------------------------------------------------
-- 11. SOCIETY REGISTRATION REQUESTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.society_registration_requests (
  id text primary key default gen_random_uuid()::text,
  proposed_name text not null,
  domain text not null,
  advisor text not null,
  purpose text not null,
  submitted_by_user_id uuid references auth.users (id) on delete set null,
  status text not null default 'Pending OSA Review',
  created_at timestamptz not null default now()
);

alter table public.society_registration_requests enable row level security;

drop policy if exists "Users can submit society registration requests" on public.society_registration_requests;
create policy "Users can submit society registration requests"
  on public.society_registration_requests for insert to authenticated
  with check (true);

drop policy if exists "Users can view own society registration requests" on public.society_registration_requests;
create policy "Users can view own society registration requests"
  on public.society_registration_requests for select to authenticated
  using (submitted_by_user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 12. AUTOMATIC AUTH USER TRIGGER
-- ------------------------------------------------------------------------------
create or replace function public.handle_auth_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, roll_number, department, role, managed_society_id, is_verified, updated_at
  )
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'roll_number',
    new.raw_user_meta_data->>'department',
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'managed_society_id',
    true,
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    roll_number = coalesce(excluded.roll_number, public.profiles.roll_number),
    department = coalesce(excluded.department, public.profiles.department),
    role = coalesce(excluded.role, public.profiles.role),
    managed_society_id = coalesce(excluded.managed_society_id, public.profiles.managed_society_id),
    is_verified = true,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_or_verified on auth.users;
create trigger on_auth_user_created_or_verified
  after insert or update of email_confirmed_at, raw_user_meta_data, email
  on auth.users
  for each row
  execute function public.handle_auth_user_sync();

-- ------------------------------------------------------------------------------
-- 13. SEED INITIAL SOCIETIES & EVENTS
-- ------------------------------------------------------------------------------
insert into public.societies (
  id, name, short_name, tagline, category, category_label, dept, faculty_advisor,
  contact_email, instagram, meeting_schedule, members_count, events_count, logo, banner, mission, status
) values
(
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'AWS Builder Group',
  'Join The Team Behind Our Campus Tech Community',
  'Technical',
  'CLOUD & TECH COMMUNITY',
  'CS, IT & Engineering · NUTECH',
  'Dr. Kamran Malik (Associate Professor, CS Dept)',
  'aws.builder@nutech.edu.pk',
  '@awsnutech',
  'Every Thursday · 3:30 PM (CS Lab 2)',
  24,
  4,
  'local:aws-builder',
  'local:aws-builder',
  'NUTECH’s most premium tech community! After flagship events and industry visits at NASTP and 10Pearls, AWS Student Builder Group NUTECH empowers students with AWS cloud credits, exam vouchers, hands-on workshops, and industry networking.',
  'Active & Approved by OSA'
),
(
  'zindigi-prize-nutech',
  'Zindigi Prize NUTECH',
  'Zindigi Prize',
  'Pakistan’s Largest Social Entrepreneurship Platform',
  'Creative',
  'ENTREPRENEURSHIP & INNOVATION',
  'Management Sciences & Innovation · NUTECH',
  'Dr. Sajid Munir (Dean of Student Affairs)',
  'zindigi.prize@nutech.edu.pk',
  '@zindigiprizenutech',
  'Bi-weekly Fridays · 4:00 PM (Admin Auditorium)',
  18,
  3,
  'local:zindigi-prize',
  'local:zindigi-prize',
  'Empowering university changemakers to build scalable business solutions solving Pakistan’s social challenges with mentorship, incubation, and million-rupee seed funds.',
  'Active & Approved by OSA'
),
(
  'entrepreneurship-club',
  'NUTECH Entrepreneurship & Innovation Club',
  'Entrepreneurship Club',
  'Turn Ideas Into Sustainable Campus Startups',
  'Creative',
  'STARTUP INCUBATION',
  'All Academic Departments · NUTECH',
  'Engr. Bilal Hashmi',
  'entrepreneurship@nutech.edu.pk',
  '@nutech.ec',
  'Wednesdays · 3:00 PM',
  35,
  2,
  'local:entrepreneurship',
  'local:entrepreneurship',
  'Fostering startup mindset, patent filings, venture investor pitch sessions, and product development across engineering disciplines.',
  'Active & Approved by OSA'
),
(
  'ieee-nutech',
  'IEEE NUTECH Student Branch',
  'IEEE NUTECH',
  'Advancing Technology for Humanity on Campus',
  'Technical',
  'INTERNATIONAL TECH BODY',
  'Electrical & Computer Engineering · NUTECH',
  'Dr. Tahir Mahmood',
  'ieee@nutech.edu.pk',
  '@ieeenutech',
  'Mondays · 4:00 PM',
  42,
  5,
  'local:ieee-nutech',
  'local:ieee-nutech',
  'Connecting engineering students with IEEE global network, international research publications, conferences, and technical student design competitions.',
  'Active & Approved by OSA'
)
on conflict (id) do nothing;

insert into public.events (
  id, society_id, society_name, title, short_title, category, category_tag, badge,
  date, date_label, time_label, date_time_full, venue, wing, capacity, registered_count,
  deadline_text, urgent, image, club_logo, description, status, submitted_at
) values
(
  'event-aws-jam-25',
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'Cloud Study Jam: Serverless & Generative AI on AWS',
  'AWS Cloud Study Jam',
  'Workshops',
  'STUDY JAM',
  'HOT',
  '2026-03-27',
  'Thu, Mar 27 · 2:00 PM',
  '2:00 – 5:00 PM',
  'Thursday, Mar 27 · 2:00 PM – 5:00 PM',
  'Academic Block · CS Lab 3 (Level 2)',
  'Academic Block',
  150,
  128,
  'Registration closes Tomorrow, 11:59 PM',
  true,
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  'local:aws-builder',
  'Join the AWS Student Builder Group NUTECH for an intensive hands-on Cloud Study Jam. Learn AWS Lambda, Amazon Bedrock, and deploy serverless full-stack web applications. 50$ AWS credits provided to all attendees!',
  'Approved',
  now() - interval '5 days'
),
(
  'event-aws-bootcamp-25',
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'AWS Cloud Practitioner Certification Bootcamp',
  'Cloud Practitioner Bootcamp',
  'Workshops',
  'CERTIFICATION',
  'POPULAR',
  '2026-04-05',
  'Sat, Apr 05 · 10:00 AM',
  '10:00 AM – 3:30 PM',
  'Saturday, Apr 05 · 10:00 AM – 3:30 PM',
  'NUTECH Main Auditorium',
  'Admin Block',
  250,
  180,
  'Closes in 5 days',
  false,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  'local:aws-builder',
  'Official AWS Certified Cloud Practitioner preparation bootcamp. Free practice test vouchers and domain breakdown for Cloud Concepts, Security, and Architecture.',
  'Approved',
  now() - interval '3 days'
),
(
  'event-ieee-fest',
  'ieee-nutech',
  'IEEE NUTECH Student Branch',
  'NUTECH TechFiesta 2026: National Hackathon',
  'TechFiesta 2026',
  'Hackathons',
  'HACKATHON',
  'FEATURED',
  '2026-04-12',
  'Sun, Apr 12 · 9:00 AM',
  '9:00 AM – 6:00 PM',
  'Sunday, Apr 12 · 9:00 AM – 6:00 PM',
  'NUTECH Multi-Purpose Hall & Innovation Labs',
  'Innovation Wing',
  300,
  215,
  'Closes Apr 10',
  false,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  'local:ieee-nutech',
  'NUTECH’s premier annual hackathon with cash prizes over PKR 250,000. Tracks include AI for Defense, IoT Edge Solutions, and Clean Energy.',
  'Approved',
  now() - interval '7 days'
)
on conflict (id) do nothing;
