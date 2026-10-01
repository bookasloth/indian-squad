-- Per-sport community: tag each post with a sport. Prefixed is_ (shared project).
alter table is_posts add column if not exists sport text
  check (sport in ('cricket', 'hockey', 'kabaddi', 'badminton', 'football', 'f1'));

create index if not exists is_posts_sport_idx on is_posts (sport);
