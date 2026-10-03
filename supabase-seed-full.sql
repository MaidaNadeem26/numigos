-- ==============================================================================
-- NUMIGOS (NUTECH EVENTS & SOCIETIES) - COMPLETE DATABASE SETUP & SEED DATA
-- ==============================================================================
-- Run this entire script in Supabase Dashboard -> SQL Editor
-- It safely upgrades existing tables, creates all required tables, sets up RLS,
-- configures admin & student roles, and inserts rich data for AWS Builder Group.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. PROFILES TABLE (Safe column additions for your existing table)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text not null default 'student';
alter table public.profiles add column if not exists roll_number text;
alter table public.profiles add column if not exists department text;
alter table public.profiles add column if not exists semester text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists managed_society_id text;
alter table public.profiles add column if not exists is_verified boolean not null default true;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Update existing profiles: Admin vs Student
update public.profiles
set 
  role = 'society_admin',
  managed_society_id = 'aws-student-builder-nutech',
  full_name = coalesce(full_name, 'Hamza Malik (AWS Lead)'),
  department = coalesce(department, 'Computer Science'),
  semester = coalesce(semester, '7th'),
  roll_number = coalesce(roll_number, 'F21-BCS-001'),
  phone = coalesce(phone, '+92 300 1234567'),
  is_verified = true
where email like 'admin.aws%';

update public.profiles
set 
  role = 'student',
  full_name = coalesce(full_name, split_part(email, '@', 1)),
  department = coalesce(department, 'Computer Science'),
  semester = coalesce(semester, '6th'),
  roll_number = coalesce(roll_number, 'F21-BCS-042'),
  phone = coalesce(phone, '+92 300 9876543'),
  is_verified = true
where email not like 'admin.aws%' and email not like 'admin.zindigi%';

-- ------------------------------------------------------------------------------
-- 3. SOCIETIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.societies (
  id text primary key,
  name text not null,
  short_name text not null,
  tagline text,
  category text not null default 'Technical',
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

-- ------------------------------------------------------------------------------
-- 4. EVENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.events (
  id text primary key,
  society_id text not null references public.societies (id) on delete cascade,
  society_name text not null,
  title text not null,
  short_title text,
  category text not null default 'Workshops',
  category_tag text,
  badge text,
  date text not null,
  date_label text,
  time text,
  time_label text,
  date_time_full text,
  venue text not null,
  wing text,
  capacity int not null default 100,
  registered_count int not null default 0,
  registrations_count int not null default 0,
  deadline text,
  deadline_text text,
  urgent boolean default false,
  image text,
  club_logo text,
  description text,
  status text not null default 'Approved',
  osa_notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. SOCIETY MEMBERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.society_members (
  id text primary key default gen_random_uuid()::text,
  society_id text not null references public.societies (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  roll_number text not null,
  role text not null,
  group_name text not null default 'Member',
  department text,
  email text,
  avatar text,
  joined_date text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. POSTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.posts (
  id text primary key,
  society_id text not null references public.societies (id) on delete cascade,
  society_name text not null,
  society text,
  category text not null default 'Clubs',
  title text,
  content text,
  body text,
  image_url text,
  image_source text,
  link text,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 7. REGISTRATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.registrations (
  id text primary key default gen_random_uuid()::text,
  event_id text not null references public.events (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  event_title text,
  name text not null,
  roll_number text not null,
  department text,
  semester text,
  email text not null,
  avatar text,
  status text not null default 'Registered',
  certificate_id text,
  registered_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 8. CHAT MESSAGES TABLE
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

-- ------------------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users (id) on delete cascade,
  society_id text references public.societies (id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'reminder',
  read boolean not null default false,
  target_route text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 10. SOCIETY FOLLOWERS & BOOKMARKS TABLES
-- ------------------------------------------------------------------------------
create table if not exists public.society_followers (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users (id) on delete cascade,
  society_id text not null references public.societies (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id text not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES (Allow App to Read and Write Smoothly)
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.societies enable row level security;
alter table public.events enable row level security;
alter table public.society_members enable row level security;
alter table public.posts enable row level security;
alter table public.registrations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.society_followers enable row level security;
alter table public.bookmarks enable row level security;

-- Drop and recreate clear public policies
drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles" on public.profiles for select using (true);
drop policy if exists "Authenticated update profiles" on public.profiles;
create policy "Authenticated update profiles" on public.profiles for update to authenticated using (true);

drop policy if exists "Public read societies" on public.societies;
create policy "Public read societies" on public.societies for select using (true);
drop policy if exists "Authenticated modify societies" on public.societies;
create policy "Authenticated modify societies" on public.societies for all to authenticated using (true);

drop policy if exists "Public read events" on public.events;
create policy "Public read events" on public.events for select using (true);
drop policy if exists "Authenticated modify events" on public.events;
create policy "Authenticated modify events" on public.events for all to authenticated using (true);

drop policy if exists "Public read society_members" on public.society_members;
create policy "Public read society_members" on public.society_members for select using (true);
drop policy if exists "Authenticated modify society_members" on public.society_members;
create policy "Authenticated modify society_members" on public.society_members for all to authenticated using (true);

drop policy if exists "Public read posts" on public.posts;
create policy "Public read posts" on public.posts for select using (true);
drop policy if exists "Authenticated modify posts" on public.posts;
create policy "Authenticated modify posts" on public.posts for all to authenticated using (true);

drop policy if exists "Public read registrations" on public.registrations;
create policy "Public read registrations" on public.registrations for select using (true);
drop policy if exists "Authenticated modify registrations" on public.registrations;
create policy "Authenticated modify registrations" on public.registrations for all to authenticated using (true);

drop policy if exists "Public read chat_messages" on public.chat_messages;
create policy "Public read chat_messages" on public.chat_messages for select using (true);
drop policy if exists "Authenticated insert chat_messages" on public.chat_messages;
create policy "Authenticated insert chat_messages" on public.chat_messages for insert to authenticated with check (true);

drop policy if exists "Public read notifications" on public.notifications;
create policy "Public read notifications" on public.notifications for select using (true);
drop policy if exists "Authenticated modify notifications" on public.notifications;
create policy "Authenticated modify notifications" on public.notifications for all to authenticated using (true);

drop policy if exists "Public read society_followers" on public.society_followers;
create policy "Public read society_followers" on public.society_followers for select using (true);
drop policy if exists "Authenticated modify society_followers" on public.society_followers;
create policy "Authenticated modify society_followers" on public.society_followers for all to authenticated using (true);

drop policy if exists "Public read bookmarks" on public.bookmarks;
create policy "Public read bookmarks" on public.bookmarks for select using (true);
drop policy if exists "Authenticated modify bookmarks" on public.bookmarks;
create policy "Authenticated modify bookmarks" on public.bookmarks for all to authenticated using (true);

-- ------------------------------------------------------------------------------
-- 12. SEED SOCIETIES (AWS Builder Group + Partners)
-- ------------------------------------------------------------------------------
insert into public.societies (
  id, name, short_name, tagline, category, category_label, dept, faculty_advisor,
  contact_email, instagram, meeting_schedule, members_count, events_count, logo, banner, mission, status
) values
(
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'AWS Builder Group',
  'Building the Next Generation of Cloud & AI Innovators',
  'Technical',
  'CLOUD & TECH COMMUNITY',
  'CS, IT & Engineering · NUTECH',
  'Dr. Kamran Malik (Associate Professor, CS Dept)',
  'aws.builder@nutech.edu.pk',
  '@awsnutech',
  'Every Thursday · 3:30 PM (CS Lab 2)',
  28,
  3,
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
  2,
  'local:zindigi-prize',
  'local:zindigi-prize',
  'Empowering university changemakers to build scalable business solutions solving Pakistan’s social challenges with mentorship, incubation, and million-rupee seed funds.',
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
  4,
  'local:ieee-nutech',
  'local:ieee-nutech',
  'Connecting engineering students with IEEE global network, international research publications, conferences, and technical student design competitions.',
  'Active & Approved by OSA'
)
on conflict (id) do update
set
  name = excluded.name,
  short_name = excluded.short_name,
  tagline = excluded.tagline,
  faculty_advisor = excluded.faculty_advisor,
  members_count = excluded.members_count,
  events_count = excluded.events_count,
  updated_at = now();

-- ------------------------------------------------------------------------------
-- 13. SEED EVENTS (AWS Flagship Events)
-- ------------------------------------------------------------------------------
insert into public.events (
  id, society_id, society_name, title, short_title, category, category_tag, badge,
  date, date_label, time, time_label, date_time_full, venue, wing, capacity, registered_count, registrations_count,
  deadline, deadline_text, urgent, image, club_logo, description, status, submitted_at
) values
(
  'nutech-hackathon-2026',
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'NUTECH National Hackathon 2026',
  'National Hackathon',
  'Hackathons',
  'HACKATHON',
  'FEATURED',
  '2026-10-15',
  'Thu, Oct 15 · 09:00 AM',
  '09:00 AM – 06:00 PM',
  '09:00 AM – 06:00 PM',
  'Thursday, Oct 15 · 09:00 AM – 06:00 PM',
  'Main Auditorium, NUTECH Islamabad',
  'Central Academic Wing',
  250,
  142,
  142,
  '2026-10-14',
  'Registration closes Oct 14',
  true,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  'local:aws-builder',
  'Join Pakistan’s top student teams in solving real-world challenges in AI, Cloud Computing, and Smart Engineering. Free lunch, mentorship from top tech architects, and cash prizes exceeding PKR 250,000.',
  'Approved',
  now() - interval '2 days'
),
(
  'event-aws-jam-25',
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'Cloud Study Jam: Serverless & Generative AI on AWS',
  'AWS Cloud Study Jam',
  'Workshops',
  'STUDY JAM',
  'HOT',
  '2026-10-22',
  'Thu, Oct 22 · 02:00 PM',
  '02:00 PM – 05:00 PM',
  '02:00 PM – 05:00 PM',
  'Thursday, Oct 22 · 02:00 PM – 05:00 PM',
  'Academic Block · CS Lab 3 (Level 2)',
  'Academic Block',
  150,
  98,
  98,
  '2026-10-21',
  'Closes Oct 21',
  false,
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  'local:aws-builder',
  'Learn hands-on AWS Lambda, Amazon Bedrock, and deploy serverless full-stack web applications. $50 AWS credits provided to all attendees!',
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
  '2026-11-05',
  'Thu, Nov 05 · 10:00 AM',
  '10:00 AM – 03:30 PM',
  '10:00 AM – 03:30 PM',
  'Thursday, Nov 05 · 10:00 AM – 03:30 PM',
  'NUTECH Main Auditorium',
  'Admin Block',
  200,
  85,
  85,
  '2026-11-03',
  'Closes Nov 03',
  false,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  'local:aws-builder',
  'Official AWS Certified Cloud Practitioner preparation bootcamp. Free practice test vouchers and domain breakdown for Cloud Concepts, Security, and Architecture.',
  'Approved',
  now() - interval '7 days'
)
on conflict (id) do update
set
  title = excluded.title,
  category = excluded.category,
  date = excluded.date,
  venue = excluded.venue,
  capacity = excluded.capacity,
  registered_count = excluded.registered_count,
  registrations_count = excluded.registrations_count,
  status = excluded.status,
  updated_at = now();

-- ------------------------------------------------------------------------------
-- 14. SEED POSTS (Community Feed for AWS Builder Group)
-- ------------------------------------------------------------------------------
insert into public.posts (
  id, society_id, society_name, society, category, title, content, body, image_url, image_source, link, likes_count, created_at
) values
(
  'post-aws-study-jam-announcement',
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'AWS Student Builder Group NUTECH',
  'Clubs',
  '🚀 AWS Cloud Study Jam 2026 Announced!',
  'Get ready NUTECH builders! We are hosting our flagship Cloud Study Jam covering Serverless, Amazon Bedrock, and AWS Cloud Architecture. All participants will receive $50 in AWS credits and official certificates from AWS Student Builder Group.',
  'Get ready NUTECH builders! We are hosting our flagship Cloud Study Jam covering Serverless, Amazon Bedrock, and AWS Cloud Architecture. All participants will receive $50 in AWS credits and official certificates from AWS Student Builder Group.',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  'https://aws.amazon.com/training/',
  58,
  now() - interval '1 day'
),
(
  'post-aws-recruitment-call',
  'aws-student-builder-nutech',
  'AWS Student Builder Group NUTECH',
  'AWS Student Builder Group NUTECH',
  'Clubs',
  '⚡ Core Team Recruitment 2026-27 is LIVE',
  'Passionate about cloud architecture, devops, event management, or media? Join the organizing committee of AWS Student Builder Group NUTECH. Open to all engineering and computing departments.',
  'Passionate about cloud architecture, devops, event management, or media? Join the organizing committee of AWS Student Builder Group NUTECH. Open to all engineering and computing departments.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  'https://nutech.edu.pk',
  46,
  now() - interval '3 days'
)
on conflict (id) do update
set
  title = excluded.title,
  content = excluded.content,
  body = excluded.body,
  likes_count = excluded.likes_count;

-- ------------------------------------------------------------------------------
-- 15. SEED AWS TEAM MEMBERS (Roster)
-- ------------------------------------------------------------------------------
insert into public.society_members (
  id, society_id, name, roll_number, role, group_name, department, email, avatar, joined_date
) values
(
  'mem-aws-001',
  'aws-student-builder-nutech',
  'Hamza Malik',
  'F21-BCS-001',
  'Lead / President',
  'Leadership',
  'Computer Science',
  'admin.aws@nutech.edu.pk',
  '',
  'Fall 2024'
),
(
  'mem-aws-002',
  'aws-student-builder-nutech',
  'Fatima Noor',
  'F21-BCE-018',
  'Vice President & Operations',
  'Leadership',
  'Computer Engineering',
  'fatima.noor@nutech.edu.pk',
  '',
  'Fall 2024'
),
(
  'mem-aws-003',
  'aws-student-builder-nutech',
  'Bilal Ahmad',
  'F22-BCS-042',
  'Lead Cloud Architect',
  'Core Team',
  'Computer Science',
  'bilal.ahmad@nutech.edu.pk',
  '',
  'Spring 2025'
),
(
  'mem-aws-004',
  'aws-student-builder-nutech',
  'Ayesha Khan',
  'F22-BSE-029',
  'Media & Event Coordinator',
  'Core Team',
  'Software Engineering',
  'ayesha.khan@nutech.edu.pk',
  '',
  'Fall 2025'
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 16. SEED SOCIETY CHAT MESSAGES
-- ------------------------------------------------------------------------------
insert into public.chat_messages (
  id, society_id, sender_id, sender_name, sender_role, sender_avatar, text, created_at
) values
(
  'chat-aws-001',
  'aws-student-builder-nutech',
  'osa-advisor',
  'Engr. Tariq Mehmood (OSA Advisor)',
  'Faculty Advisor',
  '',
  'Welcome team! The proposal for NUTECH National Hackathon 2026 has been officially approved by the Directorate of Student Life. Auditorium and lab reservations are confirmed.',
  now() - interval '2 days'
),
(
  'chat-aws-002',
  'aws-student-builder-nutech',
  'hamza-malik',
  'Hamza Malik (Lead)',
  'Society Lead',
  '',
  'Thank you sir! We have opened registrations. Let us hold a team sync this Thursday at 3:30 PM in CS Lab 2 to delegate volunteer roles.',
  now() - interval '1 day'
),
(
  'chat-aws-003',
  'aws-student-builder-nutech',
  'fatima-noor',
  'Fatima Noor',
  'Vice President',
  '',
  'All AWS stickers, badges, and credit coupons have arrived from the regional team. Ready for the study jam!',
  now() - interval '4 hours'
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 17. SEED NOTIFICATIONS
-- ------------------------------------------------------------------------------
insert into public.notifications (
  id, society_id, title, message, type, read, target_route, created_at
) values
(
  'notif-aws-001',
  'aws-student-builder-nutech',
  'Event Approved by OSA',
  'NUTECH National Hackathon 2026 has been approved by the Directorate of Student Life.',
  'approval',
  false,
  '/society-admin/events',
  now() - interval '2 days'
),
(
  'notif-aws-002',
  'aws-student-builder-nutech',
  'New Registrations Influx',
  'Over 140 students registered for the NUTECH National Hackathon 2026.',
  'registration',
  false,
  '/society-admin/registrants',
  now() - interval '1 day'
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 18. SEED REGISTRATIONS & LINK TO REGISTERED USERS
-- ------------------------------------------------------------------------------
insert into public.registrations (
  id, event_id, event_title, name, roll_number, department, semester, email, status, registered_at
) values
(
  'reg-aws-001',
  'nutech-hackathon-2026',
  'NUTECH National Hackathon 2026',
  'Muhammad Waqas',
  'F21-BCS-042',
  'Computer Science',
  '6th',
  'waqas@nutech.edu.pk',
  'Registered',
  now() - interval '1 day'
),
(
  'reg-aws-002',
  'nutech-hackathon-2026',
  'NUTECH National Hackathon 2026',
  'Bilal Ahmad',
  'F22-BCS-015',
  'Computer Science',
  '5th',
  'bilal.ahmad@nutech.edu.pk',
  'Attended',
  now() - interval '3 days'
)
on conflict (id) do nothing;

-- Sync registration to any user present in profiles table
insert into public.registrations (
  id, event_id, user_id, event_title, name, roll_number, department, semester, email, status, registered_at
)
select 
  'reg-user-' || p.id::text,
  'nutech-hackathon-2026',
  p.id,
  'NUTECH National Hackathon 2026',
  coalesce(p.full_name, 'NUTECH Student'),
  coalesce(p.roll_number, 'F21-BCS-042'),
  coalesce(p.department, 'Computer Science'),
  coalesce(p.semester, '6th'),
  p.email,
  'Registered',
  now()
from public.profiles p
where p.email not like 'admin.aws%'
on conflict (id) do nothing;

-- Sync bookmarks for student users
insert into public.bookmarks (user_id, event_id)
select p.id, 'nutech-hackathon-2026'
from public.profiles p
where p.email not like 'admin.aws%'
on conflict do nothing;

-- Sync follow for AWS society
insert into public.society_followers (user_id, society_id)
select p.id, 'aws-student-builder-nutech'
from public.profiles p
where p.email not like 'admin.aws%'
on conflict do nothing;
