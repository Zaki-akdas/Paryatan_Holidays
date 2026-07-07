create table paryatan_bookings (
  id bigint generated always as identity primary key,
  tour_id bigint references paryatan_tours(id),
  tour_title text not null,
  adults int default 1,
  children int default 0,
  package_tier text default 'standard',
  total_amount int,
  customer_name text,
  customer_phone text,
  customer_email text,
  custom_message text,
  video_source text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table paryatan_inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text,
  phone text,
  subject text default 'General Inquiry',
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

create index idx_paryatan_bookings_created on paryatan_bookings(created_at desc);
create index idx_paryatan_inquiries_created on paryatan_inquiries(created_at desc);