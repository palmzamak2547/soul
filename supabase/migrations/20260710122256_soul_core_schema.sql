begin;

-- SOUL production data foundation for managed Supabase Postgres 17.
-- Secrets, raw NFC identifiers, raw tap tokens, raw IP addresses, and raw claim
-- codes must never be stored in this schema. Hashes are SHA-256/HMAC-SHA-256.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.soul_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

revoke all on function private.soul_set_updated_at() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text,
  display_name text not null,
  avatar_path text,
  bio text,
  is_discoverable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_handle_check check (
    handle is null
    or (
      handle = lower(handle)
      and handle ~ '^[a-z0-9_]{3,30}$'
    )
  ),
  constraint profiles_display_name_check check (
    char_length(btrim(display_name)) between 1 and 80
  ),
  constraint profiles_bio_check check (bio is null or char_length(bio) <= 500),
  constraint profiles_avatar_path_check check (
    avatar_path is null
    or (
      char_length(avatar_path) between 1 and 512
      and avatar_path !~ '(^|/)\.\.(/|$)'
    )
  )
);

create unique index profiles_handle_unique_idx
  on public.profiles (lower(handle))
  where handle is not null;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text,
  description text,
  logo_path text,
  website_url text,
  status text not null default 'active',
  is_public boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_slug_check check (
    slug = lower(slug) and slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
  ),
  constraint organizations_name_check check (char_length(btrim(name)) between 1 and 160),
  constraint organizations_short_name_check check (
    short_name is null or char_length(btrim(short_name)) between 1 and 40
  ),
  constraint organizations_description_check check (
    description is null or char_length(description) <= 2000
  ),
  constraint organizations_status_check check (status in ('active', 'suspended', 'archived')),
  constraint organizations_website_url_check check (
    website_url is null or website_url ~ '^https://[^[:space:]]+$'
  ),
  constraint organizations_logo_path_check check (
    logo_path is null
    or (
      char_length(logo_path) between 1 and 512
      and logo_path !~ '(^|/)\.\.(/|$)'
    )
  )
);

create table public.campuses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  slug text not null,
  name text not null,
  timezone text not null default 'Asia/Bangkok',
  address jsonb not null default '{}'::jsonb,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campuses_slug_check check (
    slug = lower(slug) and slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
  ),
  constraint campuses_name_check check (char_length(btrim(name)) between 1 and 160),
  constraint campuses_timezone_check check (char_length(btrim(timezone)) between 1 and 80),
  constraint campuses_address_check check (jsonb_typeof(address) = 'object'),
  constraint campuses_latitude_check check (latitude is null or latitude between -90 and 90),
  constraint campuses_longitude_check check (longitude is null or longitude between -180 and 180),
  constraint campuses_status_check check (status in ('active', 'suspended', 'archived')),
  unique (organization_id, slug),
  unique (id, organization_id)
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  status text not null default 'invited',
  invited_by uuid references auth.users (id) on delete set null,
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_role_check check (role in ('owner', 'admin', 'editor', 'support', 'viewer')),
  constraint memberships_status_check check (status in ('invited', 'active', 'suspended', 'left')),
  constraint memberships_joined_at_check check (status <> 'active' or joined_at is not null),
  unique (organization_id, user_id)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  campus_id uuid,
  slug text not null,
  title_th text not null,
  title_en text,
  description_th text,
  description_en text,
  cover_asset_path text,
  status text not null default 'draft',
  visibility text not null default 'public',
  sort_order integer not null default 0,
  published_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collections_campus_fkey
    foreign key (campus_id, organization_id)
    references public.campuses (id, organization_id)
    on delete restrict,
  constraint collections_slug_check check (
    slug = lower(slug) and slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
  ),
  constraint collections_title_th_check check (char_length(btrim(title_th)) between 1 and 160),
  constraint collections_title_en_check check (
    title_en is null or char_length(btrim(title_en)) between 1 and 160
  ),
  constraint collections_status_check check (status in ('draft', 'published', 'archived')),
  constraint collections_visibility_check check (visibility in ('public', 'members', 'private')),
  constraint collections_publish_time_check check (status <> 'published' or published_at is not null),
  constraint collections_window_check check (ends_at is null or starts_at is null or ends_at > starts_at),
  constraint collections_cover_asset_path_check check (
    cover_asset_path is null
    or (
      char_length(cover_asset_path) between 1 and 512
      and cover_asset_path !~ '(^|/)\.\.(/|$)'
    )
  ),
  unique (organization_id, slug),
  unique (id, organization_id)
);

create table public.card_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  collection_id uuid not null,
  slug text not null,
  title_th text not null,
  title_en text,
  description_th text,
  description_en text,
  chapter text,
  rarity text not null default 'signature',
  status text not null default 'draft',
  edition_size integer not null,
  image_path text not null,
  animation_path text,
  traits jsonb not null default '{}'::jsonb,
  public_metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint card_templates_collection_fkey
    foreign key (collection_id, organization_id)
    references public.collections (id, organization_id)
    on delete restrict,
  constraint card_templates_slug_check check (
    slug = lower(slug) and slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
  ),
  constraint card_templates_title_th_check check (char_length(btrim(title_th)) between 1 and 160),
  constraint card_templates_title_en_check check (
    title_en is null or char_length(btrim(title_en)) between 1 and 160
  ),
  constraint card_templates_rarity_check check (
    rarity in ('signature', 'rare', 'limited', 'legendary')
  ),
  constraint card_templates_status_check check (status in ('draft', 'active', 'paused', 'retired')),
  constraint card_templates_edition_size_check check (edition_size between 1 and 10000000),
  constraint card_templates_image_path_check check (
    char_length(image_path) between 1 and 512
    and image_path !~ '(^|/)\.\.(/|$)'
  ),
  constraint card_templates_animation_path_check check (
    animation_path is null
    or (
      char_length(animation_path) between 1 and 512
      and animation_path !~ '(^|/)\.\.(/|$)'
    )
  ),
  constraint card_templates_traits_check check (jsonb_typeof(traits) = 'object'),
  constraint card_templates_public_metadata_check check (jsonb_typeof(public_metadata) = 'object'),
  unique (organization_id, slug),
  unique (id, organization_id),
  unique (id, organization_id, collection_id)
);

create table public.physical_cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  card_template_id uuid not null,
  serial_number text not null,
  edition_number integer not null,
  lifecycle_status text not null default 'manufactured',
  public_token_hash bytea not null,
  public_token_key_version smallint not null default 1,
  claim_code_hash bytea,
  verification_mode text not null default 'signed_url',
  chip_product text not null default 'ntag216',
  chip_uid_hash bytea,
  nfc_key_version smallint,
  sun_file_number smallint,
  sun_read_counter_limit integer,
  last_verified_counter integer,
  verification_status text not null default 'unverified',
  verification_attempts bigint not null default 0,
  last_verified_at timestamptz,
  manufactured_at timestamptz,
  activated_at timestamptz,
  claimed_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint physical_cards_template_fkey
    foreign key (card_template_id, organization_id)
    references public.card_templates (id, organization_id)
    on delete restrict,
  constraint physical_cards_serial_number_check check (
    char_length(btrim(serial_number)) between 4 and 80
  ),
  constraint physical_cards_edition_number_check check (edition_number > 0),
  constraint physical_cards_lifecycle_status_check check (
    lifecycle_status in ('manufactured', 'active', 'claimed', 'suspended', 'lost', 'retired', 'destroyed')
  ),
  constraint physical_cards_public_token_hash_check check (octet_length(public_token_hash) = 32),
  constraint physical_cards_public_token_key_version_check check (public_token_key_version > 0),
  constraint physical_cards_claim_code_hash_check check (
    claim_code_hash is null or octet_length(claim_code_hash) = 32
  ),
  constraint physical_cards_verification_mode_check check (
    verification_mode in ('signed_url', 'ntag424_sun')
  ),
  constraint physical_cards_chip_product_check check (
    chip_product in ('ntag216', 'ntag424_dna', 'other')
  ),
  constraint physical_cards_chip_uid_hash_check check (
    chip_uid_hash is null or octet_length(chip_uid_hash) = 32
  ),
  constraint physical_cards_nfc_key_version_check check (
    nfc_key_version is null or nfc_key_version > 0
  ),
  constraint physical_cards_sun_file_number_check check (
    sun_file_number is null or sun_file_number between 0 and 31
  ),
  constraint physical_cards_sun_counter_limit_check check (
    sun_read_counter_limit is null or sun_read_counter_limit between 1 and 16777215
  ),
  constraint physical_cards_last_counter_check check (
    last_verified_counter is null or last_verified_counter between 0 and 16777215
  ),
  constraint physical_cards_verification_status_check check (
    verification_status in ('unverified', 'valid', 'replay_detected', 'invalid_mac', 'invalid_token', 'revoked')
  ),
  constraint physical_cards_verification_attempts_check check (verification_attempts >= 0),
  constraint physical_cards_dynamic_security_check check (
    verification_mode <> 'ntag424_sun'
    or (
      chip_product = 'ntag424_dna'
      and chip_uid_hash is not null
      and nfc_key_version is not null
      and sun_file_number is not null
    )
  ),
  constraint physical_cards_revocation_check check (
    (revoked_at is null and revocation_reason is null)
    or (revoked_at is not null and char_length(btrim(revocation_reason)) between 1 and 500)
  ),
  unique (organization_id, serial_number),
  unique (card_template_id, edition_number),
  unique (id, organization_id),
  unique (id, organization_id, card_template_id)
);

create unique index physical_cards_public_token_hash_unique_idx
  on public.physical_cards (public_token_hash);

create unique index physical_cards_claim_code_hash_unique_idx
  on public.physical_cards (claim_code_hash)
  where claim_code_hash is not null;

create unique index physical_cards_chip_uid_hash_unique_idx
  on public.physical_cards (chip_uid_hash)
  where chip_uid_hash is not null;

create table public.ownerships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  physical_card_id uuid not null,
  owner_user_id uuid not null references auth.users (id) on delete restrict,
  status text not null default 'active',
  acquired_via text not null,
  claim_idempotency_key uuid,
  acquired_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  constraint ownerships_card_fkey
    foreign key (physical_card_id, organization_id)
    references public.physical_cards (id, organization_id)
    on delete restrict,
  constraint ownerships_status_check check (status in ('active', 'transferred', 'revoked')),
  constraint ownerships_acquired_via_check check (
    acquired_via in ('claim', 'transfer', 'gift', 'admin_issue', 'import')
  ),
  constraint ownerships_end_state_check check (
    (status = 'active' and ended_at is null)
    or (status in ('transferred', 'revoked') and ended_at is not null)
  ),
  unique (id, organization_id, physical_card_id)
);

create unique index ownerships_one_active_owner_per_card_idx
  on public.ownerships (physical_card_id)
  where status = 'active' and ended_at is null;

create unique index ownerships_claim_idempotency_idx
  on public.ownerships (owner_user_id, claim_idempotency_key)
  where claim_idempotency_key is not null;

create table public.ownership_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  physical_card_id uuid not null,
  from_ownership_id uuid not null,
  from_user_id uuid references auth.users (id) on delete set null,
  to_user_id uuid references auth.users (id) on delete set null,
  initiated_by uuid references auth.users (id) on delete set null,
  recipient_email_hash bytea,
  transfer_token_hash bytea,
  idempotency_key uuid,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  expires_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ownership_transfers_ownership_fkey
    foreign key (from_ownership_id, organization_id, physical_card_id)
    references public.ownerships (id, organization_id, physical_card_id)
    on delete restrict,
  constraint ownership_transfers_card_fkey
    foreign key (physical_card_id, organization_id)
    references public.physical_cards (id, organization_id)
    on delete restrict,
  constraint ownership_transfers_status_check check (
    status in ('pending', 'accepted', 'rejected', 'cancelled', 'expired')
  ),
  constraint ownership_transfers_recipient_check check (
    to_user_id is not null or recipient_email_hash is not null
  ),
  constraint ownership_transfers_distinct_users_check check (
    from_user_id is null or to_user_id is null or from_user_id <> to_user_id
  ),
  constraint ownership_transfers_recipient_email_hash_check check (
    recipient_email_hash is null or octet_length(recipient_email_hash) = 32
  ),
  constraint ownership_transfers_token_hash_check check (
    transfer_token_hash is null or octet_length(transfer_token_hash) = 32
  ),
  constraint ownership_transfers_pending_token_check check (
    status <> 'pending' or transfer_token_hash is not null
  ),
  constraint ownership_transfers_resolution_check check (
    (status = 'pending' and resolved_at is null)
    or (status <> 'pending' and resolved_at is not null)
  ),
  constraint ownership_transfers_expiry_check check (
    expires_at is null or expires_at > requested_at
  )
);

create unique index ownership_transfers_token_hash_unique_idx
  on public.ownership_transfers (transfer_token_hash)
  where transfer_token_hash is not null;

create unique index ownership_transfers_idempotency_idx
  on public.ownership_transfers (initiated_by, idempotency_key)
  where initiated_by is not null and idempotency_key is not null;

create unique index ownership_transfers_one_pending_per_card_idx
  on public.ownership_transfers (physical_card_id)
  where status = 'pending';

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  collection_id uuid not null,
  card_template_id uuid not null,
  physical_card_id uuid not null,
  ownership_id uuid,
  author_user_id uuid references auth.users (id) on delete set null,
  title text,
  body text,
  asset_path text,
  asset_media_type text,
  visibility text not null default 'private',
  moderation_status text not null default 'pending',
  moderation_reason_code text,
  moderated_by uuid references auth.users (id) on delete set null,
  moderated_at timestamptz,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memories_collection_fkey
    foreign key (collection_id, organization_id)
    references public.collections (id, organization_id)
    on delete restrict,
  constraint memories_template_fkey
    foreign key (card_template_id, organization_id, collection_id)
    references public.card_templates (id, organization_id, collection_id)
    on delete restrict,
  constraint memories_card_fkey
    foreign key (physical_card_id, organization_id, card_template_id)
    references public.physical_cards (id, organization_id, card_template_id)
    on delete restrict,
  constraint memories_ownership_fkey
    foreign key (ownership_id, organization_id, physical_card_id)
    references public.ownerships (id, organization_id, physical_card_id)
    on delete restrict,
  constraint memories_content_check check (
    nullif(btrim(title), '') is not null
    or nullif(btrim(body), '') is not null
    or asset_path is not null
  ),
  constraint memories_title_check check (title is null or char_length(title) <= 160),
  constraint memories_body_check check (body is null or char_length(body) <= 10000),
  constraint memories_asset_path_check check (
    asset_path is null
    or (
      char_length(asset_path) between 1 and 512
      and asset_path !~ '(^|/)\.\.(/|$)'
    )
  ),
  constraint memories_asset_pair_check check (
    (asset_path is null and asset_media_type is null)
    or (asset_path is not null and asset_media_type is not null)
  ),
  constraint memories_asset_media_type_check check (
    asset_media_type is null
    or asset_media_type in (
      'image/jpeg',
      'image/png',
      'image/webp',
      'audio/mpeg',
      'audio/mp4',
      'video/mp4'
    )
  ),
  constraint memories_visibility_check check (
    visibility in ('private', 'card_owners', 'organization_members', 'public')
  ),
  constraint memories_moderation_status_check check (
    moderation_status in ('pending', 'approved', 'rejected', 'hidden')
  ),
  constraint memories_moderation_fields_check check (
    (moderation_status = 'pending' and moderated_at is null and moderated_by is null)
    or (moderation_status <> 'pending' and moderated_at is not null)
  ),
  constraint memories_publication_check check (
    visibility <> 'public'
    or moderation_status <> 'approved'
    or published_at is not null
  )
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  slug text not null,
  title_th text not null,
  title_en text,
  description_th text,
  description_en text,
  kind text not null,
  fulfillment_mode text not null,
  image_path text,
  terms_th text,
  terms_en text,
  status text not null default 'draft',
  inventory_total bigint,
  per_user_limit integer not null default 1,
  starts_at timestamptz,
  ends_at timestamptz,
  public_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rewards_slug_check check (
    slug = lower(slug) and slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
  ),
  constraint rewards_title_th_check check (char_length(btrim(title_th)) between 1 and 160),
  constraint rewards_title_en_check check (
    title_en is null or char_length(btrim(title_en)) between 1 and 160
  ),
  constraint rewards_kind_check check (
    kind in ('digital_keepsake', 'immersive_preview', 'physical_item', 'experience', 'discount')
  ),
  constraint rewards_fulfillment_mode_check check (
    fulfillment_mode in ('instant', 'manual', 'code_pool', 'webhook')
  ),
  constraint rewards_status_check check (status in ('draft', 'active', 'paused', 'retired')),
  constraint rewards_inventory_total_check check (inventory_total is null or inventory_total > 0),
  constraint rewards_per_user_limit_check check (per_user_limit between 1 and 1000),
  constraint rewards_window_check check (ends_at is null or starts_at is null or ends_at > starts_at),
  constraint rewards_image_path_check check (
    image_path is null
    or (
      char_length(image_path) between 1 and 512
      and image_path !~ '(^|/)\.\.(/|$)'
    )
  ),
  constraint rewards_public_metadata_check check (jsonb_typeof(public_metadata) = 'object'),
  unique (organization_id, slug),
  unique (id, organization_id)
);

create table public.card_template_rewards (
  organization_id uuid not null references public.organizations (id) on delete restrict,
  card_template_id uuid not null,
  reward_id uuid not null,
  unlock_condition text not null default 'ownership',
  requirement_value integer,
  created_at timestamptz not null default now(),
  primary key (card_template_id, reward_id),
  constraint card_template_rewards_template_fkey
    foreign key (card_template_id, organization_id)
    references public.card_templates (id, organization_id)
    on delete restrict,
  constraint card_template_rewards_reward_fkey
    foreign key (reward_id, organization_id)
    references public.rewards (id, organization_id)
    on delete restrict,
  constraint card_template_rewards_unlock_condition_check check (
    unlock_condition in ('tap', 'ownership', 'collection_complete', 'event')
  ),
  constraint card_template_rewards_requirement_value_check check (
    requirement_value is null or requirement_value > 0
  ),
  unique (card_template_id, reward_id, organization_id)
);

create table public.redemptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  reward_id uuid not null,
  card_template_id uuid not null,
  physical_card_id uuid not null,
  ownership_id uuid not null,
  user_id uuid not null references auth.users (id) on delete restrict,
  idempotency_key uuid not null,
  request_fingerprint_hash bytea,
  quantity integer not null default 1,
  status text not null default 'requested',
  confirmation_reference text not null,
  fulfillment_reference_hash bytea,
  public_result jsonb not null default '{}'::jsonb,
  rejection_reason_code text,
  requested_at timestamptz not null default now(),
  processed_by uuid references auth.users (id) on delete set null,
  processed_at timestamptz,
  fulfilled_at timestamptz,
  cancelled_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint redemptions_template_reward_fkey
    foreign key (card_template_id, reward_id, organization_id)
    references public.card_template_rewards (card_template_id, reward_id, organization_id)
    on delete restrict,
  constraint redemptions_card_fkey
    foreign key (physical_card_id, organization_id, card_template_id)
    references public.physical_cards (id, organization_id, card_template_id)
    on delete restrict,
  constraint redemptions_ownership_fkey
    foreign key (ownership_id, organization_id, physical_card_id)
    references public.ownerships (id, organization_id, physical_card_id)
    on delete restrict,
  constraint redemptions_request_fingerprint_hash_check check (
    request_fingerprint_hash is null or octet_length(request_fingerprint_hash) = 32
  ),
  constraint redemptions_quantity_check check (quantity between 1 and 100),
  constraint redemptions_status_check check (
    status in ('requested', 'approved', 'fulfilled', 'rejected', 'cancelled', 'expired')
  ),
  constraint redemptions_confirmation_reference_check check (
    char_length(confirmation_reference) between 8 and 80
  ),
  constraint redemptions_fulfillment_reference_hash_check check (
    fulfillment_reference_hash is null or octet_length(fulfillment_reference_hash) = 32
  ),
  constraint redemptions_public_result_check check (jsonb_typeof(public_result) = 'object'),
  constraint redemptions_processing_check check (
    (status = 'requested' and processed_at is null)
    or (status <> 'requested' and processed_at is not null)
  ),
  constraint redemptions_fulfilled_check check (
    status <> 'fulfilled' or fulfilled_at is not null
  ),
  constraint redemptions_cancelled_check check (
    status <> 'cancelled' or cancelled_at is not null
  ),
  constraint redemptions_expiry_check check (expires_at is null or expires_at > requested_at),
  unique (organization_id, user_id, idempotency_key),
  unique (confirmation_reference)
);

create table public.tap_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  collection_id uuid not null,
  card_template_id uuid not null,
  physical_card_id uuid not null,
  user_id uuid references auth.users (id) on delete set null,
  tap_source text not null default 'nfc',
  verification_result text not null,
  sun_read_counter integer,
  token_key_version smallint,
  request_id uuid,
  session_fingerprint_hash bytea,
  ip_fingerprint_hash bytea,
  user_agent_family text,
  locale text,
  country_code text,
  risk_score smallint,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint tap_events_collection_fkey
    foreign key (collection_id, organization_id)
    references public.collections (id, organization_id)
    on delete restrict,
  constraint tap_events_template_fkey
    foreign key (card_template_id, organization_id, collection_id)
    references public.card_templates (id, organization_id, collection_id)
    on delete restrict,
  constraint tap_events_card_fkey
    foreign key (physical_card_id, organization_id, card_template_id)
    references public.physical_cards (id, organization_id, card_template_id)
    on delete restrict,
  constraint tap_events_tap_source_check check (tap_source in ('nfc', 'qr', 'manual', 'unknown')),
  constraint tap_events_verification_result_check check (
    verification_result in ('valid', 'unverified', 'replay_detected', 'invalid_mac', 'invalid_token', 'revoked')
  ),
  constraint tap_events_sun_counter_check check (
    sun_read_counter is null or sun_read_counter between 0 and 16777215
  ),
  constraint tap_events_token_key_version_check check (
    token_key_version is null or token_key_version > 0
  ),
  constraint tap_events_session_fingerprint_hash_check check (
    session_fingerprint_hash is null or octet_length(session_fingerprint_hash) = 32
  ),
  constraint tap_events_ip_fingerprint_hash_check check (
    ip_fingerprint_hash is null or octet_length(ip_fingerprint_hash) = 32
  ),
  constraint tap_events_country_code_check check (
    country_code is null or country_code ~ '^[A-Z]{2}$'
  ),
  constraint tap_events_risk_score_check check (risk_score is null or risk_score between 0 and 100),
  constraint tap_events_metadata_check check (jsonb_typeof(metadata) = 'object')
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations (id) on delete restrict,
  actor_user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  request_id uuid,
  ip_fingerprint_hash bytea,
  user_agent_family text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint audit_logs_action_check check (char_length(action) between 1 and 100),
  constraint audit_logs_entity_type_check check (char_length(entity_type) between 1 and 80),
  constraint audit_logs_ip_fingerprint_hash_check check (
    ip_fingerprint_hash is null or octet_length(ip_fingerprint_hash) = 32
  ),
  constraint audit_logs_metadata_check check (jsonb_typeof(metadata) = 'object')
);

create table public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email_product_updates boolean not null default true,
  email_reward_updates boolean not null default true,
  push_tap_alerts boolean not null default false,
  push_reward_alerts boolean not null default true,
  marketing_opt_in boolean not null default false,
  quiet_hours_start time without time zone,
  quiet_hours_end time without time zone,
  timezone text not null default 'Asia/Bangkok',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_preferences_quiet_hours_check check (
    (quiet_hours_start is null and quiet_hours_end is null)
    or (quiet_hours_start is not null and quiet_hours_end is not null)
  ),
  constraint notification_preferences_timezone_check check (
    char_length(btrim(timezone)) between 1 and 80
  )
);

-- This table is deliberately outside the exposed public schema. The server
-- supplies an HMAC-SHA-256 fingerprint; raw IP addresses are never accepted.
create table private.api_rate_limits (
  route_key text not null,
  bucket_fingerprint_hash bytea not null,
  window_start timestamptz not null,
  request_count integer not null default 1,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (route_key, bucket_fingerprint_hash, window_start),
  constraint api_rate_limits_route_key_check check (
    route_key ~ '^[a-z0-9][a-z0-9:_-]{1,79}$'
  ),
  constraint api_rate_limits_bucket_hash_check check (
    octet_length(bucket_fingerprint_hash) = 32
  ),
  constraint api_rate_limits_request_count_check check (request_count > 0),
  constraint api_rate_limits_expiry_check check (expires_at > window_start)
);

alter table private.api_rate_limits enable row level security;
alter table private.api_rate_limits force row level security;
revoke all on private.api_rate_limits from public, anon, authenticated;
