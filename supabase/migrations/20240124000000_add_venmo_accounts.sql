create table if not exists venmo_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  venmo_username text not null,
  venmo_access_token text not null,
  venmo_user_id text not null,
  venmo_email text,
  venmo_phone text,
  venmo_display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id),
  unique(venmo_user_id)
);

-- Create trigger to update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_venmo_accounts_updated_at
  before update on venmo_accounts
  for each row
  execute function update_updated_at_column(); 