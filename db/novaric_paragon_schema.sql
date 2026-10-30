-- ============================================================
-- NOVARIC® Figurat Politike — PARAGON® Real-Data Schema
-- PostgreSQL 15+ / Supabase (pgvector optional for embeddings)
-- Target: live, verifiable data across all political profiles
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Identity spine ----------
create table if not exists parties (
  slug        text primary key,              -- 'ps', 'pd', 'lsi', 'nismadhe'...
  name        text not null,                 -- 'Partia Socialiste'
  short_name  text not null,
  color_hex   text,
  founded_year smallint
);

create table if not exists politicians (
  id               uuid primary key default gen_random_uuid(),
  numeric_id       integer unique not null,  -- == VipProfile.numericId (stable frontend key)
  full_name        text not null,
  first_name       text,
  father_name      text,                     -- patronymic (Atesia) — key Albanian disambiguator
  last_name        text,
  date_of_birth    date,
  place_of_birth   text,
  gender           text,
  party_slug       text references parties(slug),
  electoral_zone   text,                     -- qark (e.g. 'Tiranë', 'Durrës')
  parliament_email text,
  photo_url        text,                     -- official parl blob URL -> cached in storage
  social           jsonb default '{}'::jsonb, -- {facebook, twitter, linkedin, instagram}
  is_active_mp     boolean default false,
  active_until     timestamptz,              -- null if currently serving; set on deactivation pass
  bio_short        text,
  bio_detailed     text,
  identifiers      jsonb default '{}'::jsonb, -- {opensanctions_id, wikidata_qid, kuvendi_id}
  kuvendi_raw      jsonb,                    -- last raw /anetaret record (audit trail)
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
create index if not exists idx_politicians_names on politicians (last_name, first_name);
create index if not exists idx_politicians_party on politicians (party_slug) where is_active_mp;

create table if not exists committees (
  slug     text primary key,
  name     text not null,
  mandate  text
);

-- ---------- Kuvendi: sessions, speeches, bills, votes ----------
create table if not exists parliament_sessions (
  id            uuid primary key default gen_random_uuid(),
  external_id   text unique,                  -- id from /mbledhjet
  session_type  text not null check (session_type in ('plenary','committee','other')),
  committee_slug text references committees(slug),
  held_at       date not null,
  agenda        text,
  transcript_url text,                        -- PDF/DOCX blob URL
  source_url    text,
  raw           jsonb
);
create index if not exists idx_sessions_held_at on parliament_sessions (held_at desc);

create table if not exists speeches (
  id             uuid primary key default gen_random_uuid(),
  politician_id  uuid not null references politicians(id),
  session_id     uuid not null references parliament_sessions(id),
  spoke_at       timestamptz,
  word_count     integer default 0,
  topic_tags     jsonb default '[]'::jsonb,
  sentiment      numeric(4,3),
  excerpt        text,
  source_url     text,
  unique (politician_id, session_id, excerpt)
);
create index if not exists idx_speeches_politician on speeches (politician_id, spoke_at desc);

create table if not exists bills (
  id            uuid primary key default gen_random_uuid(),
  external_id   text unique,                  -- from /aktet
  title         text not null,
  summary       text,
  status        text,                         -- draft|committee|plenary|enacted|rejected
  introduced_at date,
  enacted_at    date,
  gazette_ref   text,                         -- Fletorja Zyrtare link (qbz.gov.al)
  source_url    text,
  raw           jsonb
);

create table if not exists bill_sponsors (
  bill_id        uuid not null references bills(id),
  politician_id  uuid not null references politicians(id),
  role           text not null default 'coauthor' check (role in ('lead','coauthor','rapporteur')),
  primary key (bill_id, politician_id)
);
create index if not exists idx_bill_sponsors_pol on bill_sponsors (politician_id);

create table if not exists votes (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references parliament_sessions(id),
  bill_id      uuid references bills(id),
  vote_subject text not null,
  voted_at     date,
  passed       boolean,
  source_url   text,                          -- roll-call PDF (PDF ballot lists)
  raw          jsonb
);

create table if not exists vote_records (
  vote_id       uuid not null references votes(id),
  politician_id uuid not null references politicians(id),
  choice        text not null check (choice in ('for','against','abstain','absent','present')),
  primary key (vote_id, politician_id)
);
create index if not exists idx_vote_records_pol on vote_records (politician_id);

create table if not exists attendance (
  politician_id uuid not null references politicians(id),
  session_id    uuid not null references parliament_sessions(id),
  attended      boolean not null default false,
  primary key (politician_id, session_id)
);

-- ---------- ILDKPKI: asset declarations ----------
create table if not exists asset_declarations (
  id              uuid primary key default gen_random_uuid(),
  politician_id   uuid not null references politicians(id),
  decl_year       smallint not null,
  filed_at        date,
  on_time         boolean,                    -- filed by 31 March deadline
  source_pdf_url  text,
  parsed          jsonb,                      -- structured extraction
  parser_version  smallint default 1,
  confidence      numeric(4,3),
  unique (politician_id, decl_year)
);

create table if not exists declaration_assets (
  id             uuid primary key default gen_random_uuid(),
  declaration_id uuid not null references asset_declarations(id),
  category       text not null,  -- real_estate|movable|liquid|securities|business_share|debt|income
  description    text,
  value_low      numeric(14,2),
  value_high     numeric(14,2),
  currency       char(3) default 'ALL',
  share_pct      numeric(5,2)
);
create index if not exists idx_decl_assets_cat on declaration_assets (category);

-- ---------- KQZ: elections & candidacies ----------
create table if not exists elections (
  id      uuid primary key default gen_random_uuid(),
  cycle   text not null,       -- '2025', '2021'...
  etype   text not null,       -- parliamentary|local|presidential|by_election
  held_on date
);

create table if not exists candidacies (
  politician_id   uuid not null references politicians(id),
  election_id     uuid not null references elections(id),
  party_slug      text references parties(slug),
  position        text,          -- MP list / mayor / council
  list_rank       smallint,
  preferential_votes integer,
  mandate_won     boolean,
  education       jsonb,         -- from KQZ candidate CV
  profession      text,
  cv_raw          jsonb,
  primary key (politician_id, election_id)
);

-- ---------- Media & narrative ----------
create table if not exists media_outlets (
  slug      text primary key,   -- 'top-channel', 'rtsh', 'reporter-birn', 'euronews-al'...
  name      text not null,
  country   text default 'AL',
  rss_url   text,
  reliability_tier smallint default 2  -- 1 wire/state, 2 mainstream, 3 aggregator
);

create table if not exists media_mentions (
  id           uuid primary key default gen_random_uuid(),
  url          text unique not null,
  outlet_slug  text references media_outlets(slug),
  published_at timestamptz,
  title        text,
  content_text text,
  language     char(2) default 'sq',
  sentiment    numeric(4,3),     -- [-1, 1]
  toxicity     numeric(4,3),
  topics       jsonb default '[]'::jsonb
);
create index if not exists idx_media_mentions_published on media_mentions (published_at desc);

create table if not exists mention_entities (
  mention_id    uuid not null references media_mentions(id),
  politician_id uuid not null references politicians(id),
  confidence    numeric(4,3) not null,
  context_span  text,
  primary key (mention_id, politician_id)
);

-- ---------- Procurement / concession links (Open Data Albania / PPA) ----------
create table if not exists procurement_contracts (
  id          uuid primary key default gen_random_uuid(),
  external_id text unique,
  title       text,
  buyer       text,
  value       numeric(16,2),
  currency    char(3) default 'ALL',
  awarded_at  date,
  source      text,              -- 'e-procurement' | 'openprocurement-al' | 'opentender-eu'
  raw         jsonb
);

create table if not exists contract_links (
  contract_id   uuid not null references procurement_contracts(id),
  politician_id uuid not null references politicians(id),
  entity_name   text not null,   -- company linked to figure (relative, declared business)
  link_type     text not null check (link_type in ('owner','relative','donor','appointee')),
  confidence    numeric(4,3),
  primary key (contract_id, politician_id, entity_name)
);

-- ---------- PARAGON scoring ----------
create table if not exists scoring_weights (
  model_version text primary key,
  weights       jsonb not null,          -- {"d1":0.16,...,"decay_half_life_days":180}
  valid_from    timestamptz default now()
);

create table if not exists paragon_scores (
  politician_id uuid not null references politicians(id),
  computed_at   timestamptz not null default now(),
  period_start  date not null,
  period_end    date not null,
  model_version text not null references scoring_weights(model_version),
  d1_policy_engagement      numeric(5,2),
  d2_accountability         numeric(5,2),
  d3_representation         numeric(5,2),
  d4_assertiveness          numeric(5,2),
  d5_governance             numeric(5,2),
  d6_party_cohesion         numeric(5,2),
  d7_narrative              numeric(5,2),
  composite     numeric(5,2),
  metrics       jsonb not null,          -- every raw input, for transparency/debugging
  primary key (politician_id, period_end, model_version)
);
create index if not exists idx_paragon_scores_composite on paragon_scores (composite desc);

-- ---------- Ingestion audit ----------
create table if not exists ingestion_runs (
  id          uuid primary key default gen_random_uuid(),
  source      text not null,       -- 'kuvendi.odata','ildkpki','kqz','rss',...
  started_at  timestamptz default now(),
  finished_at timestamptz,
  records_new integer default 0,
  records_updated integer default 0,
  status      text default 'running' check (status in ('running','ok','failed')),
  error       text
);

-- ---------- Staging table for identity resolution ----------
create table if not exists staging_unresolved_entities (
  id           uuid primary key default gen_random_uuid(),
  source       text not null,
  raw_name     text not null,
  context_info jsonb default '{}'::jsonb,
  created_at   timestamptz default now()
);

-- ---------- View for politician cards ----------
create or replace view v_politician_cards as
select 
  p.id as profile_uuid,
  'vip' || p.numeric_id as id,
  p.numeric_id as politician_id,
  p.full_name as name,
  'Politikë (' || coalesce(pty.short_name, 'IND') || ')' as category,
  coalesce(pty.short_name, 'IND') as party,
  p.party_slug,
  p.bio_short as short_bio,
  p.bio_detailed as detailed_bio,
  p.photo_url as image_url,
  p.date_of_birth,
  p.place_of_birth,
  p.electoral_zone,
  p.is_active_mp,
  p.active_until,
  ps.composite,
  ps.composite as paragon_score,
  ps.composite as dynamic_score,
  ps.period_end,
  ps.d1_policy_engagement,
  ps.d2_accountability,
  ps.d3_representation,
  ps.d4_assertiveness,
  ps.d5_governance,
  ps.d6_party_cohesion,
  ps.d7_narrative,
  ps.metrics,
  coalesce(ps.computed_at, p.updated_at) as last_updated
from politicians p
left join parties pty on p.party_slug = pty.slug
left join lateral (
  select * from paragon_scores 
  where politician_id = p.id 
  order by period_end desc, computed_at desc 
  limit 1
) ps on true
order by coalesce(ps.composite, 0) desc;

-- ---------- Row Level Security (RLS) Policies ----------
alter table politicians enable row level security;
alter table paragon_scores enable row level security;

-- Public read for anon and authenticated users
create policy if not exists "politicians_read_anon" on politicians for select to anon, authenticated using (true);
create policy if not exists "paragon_scores_read_anon" on paragon_scores for select to anon, authenticated using (true);

-- Restricted write: service_role only
create policy if not exists "politicians_write_service_role" on politicians for all to service_role using (true) with check (true);
create policy if not exists "paragon_scores_write_service_role" on paragon_scores for all to service_role using (true) with check (true);

