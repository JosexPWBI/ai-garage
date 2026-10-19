-- Store the AI Garage advisor's answer with each saved build.
-- Nullable, so existing rows and older app versions keep working.
alter table public."Builds" add column if not exists ai_advice text;
