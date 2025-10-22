insert into public.admin_settings (id, commission_percentage, bank_account_name, bank_account_number, bank_name, mobile_wallet_provider, mobile_wallet_number)
values (
  gen_random_uuid(),
  10,
  'TalentHunt BD',
  '1234567890123',
  'Sonali Bank Bangladesh',
  'bKash',
  '017XXXXXXXX'
)
on conflict do nothing;

-- Optional: seed job categories
insert into public.jobs (id, employer_id, title, description, category, budget_mode, budget_min, budget_max, skills, status)
select
  gen_random_uuid(),
  p.id,
  'Sample UI/UX redesign project',
  'Create a modern dashboard experience for a fintech startup targeting youth banking customers.',
  'Design',
  'fixed',
  500,
  1200,
  array ['UI/UX', 'Figma', 'User Research'],
  'open'
from public.profiles p
where p.role = 'employer'
limit 1;
