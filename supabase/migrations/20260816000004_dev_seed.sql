-- Migration: 20260816000004_dev_seed
-- Purpose: Seed realistic-but-clearly-development service data.
--
-- THIS DATA IS FOR DEVELOPMENT AND TESTING ONLY.
-- It must never be presented to end-users as real production prices or timings
-- without the owner explicitly confirming and updating them via the admin panel.
--
-- Services are seeded with booking_mode = 'request' so no immediate confirmed
-- booking can happen from dev data — the owner must confirm each request.

INSERT INTO public.services (slug, name, short_description, booking_mode, duration_minutes, cleanup_buffer_minutes, price_mode, price_amount_minor, currency, active, sort_order)
VALUES
  (
    'obnova-farova',
    'Obnova farova',
    'Restauracija oksidovanih farova — vidljiv rezultat u jednom tretmanu.',
    'request',
    120,
    30,
    'fixed',
    499900,
    'RSD',
    true,
    10
  ),
  (
    'dubinsko-ciscenje-enterijera',
    'Dubinsko čišćenje enterijera',
    'Ekstrakcija, dezinfekcija i osvežavanje svih površina unutar vozila.',
    'request',
    240,
    30,
    'from',
    799900,
    'RSD',
    true,
    20
  ),
  (
    'kompletna-restauracija',
    'Kompletna restauracija',
    'Spoljašnji i unutrašnji tretman — vozilo se vraća na nivo koji odgovara prvom danu.',
    'request',
    360,
    60,
    'from',
    1299900,
    'RSD',
    true,
    30
  )
ON CONFLICT (slug) DO UPDATE SET
  name                   = EXCLUDED.name,
  short_description      = EXCLUDED.short_description,
  booking_mode           = EXCLUDED.booking_mode,
  duration_minutes       = EXCLUDED.duration_minutes,
  cleanup_buffer_minutes = EXCLUDED.cleanup_buffer_minutes,
  price_mode             = EXCLUDED.price_mode,
  price_amount_minor     = EXCLUDED.price_amount_minor,
  currency               = EXCLUDED.currency,
  active                 = EXCLUDED.active,
  sort_order             = EXCLUDED.sort_order,
  updated_at             = now();
