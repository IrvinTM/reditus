-- users must pick their own password before using the system (seeded admin, users created by an admin)
ALTER TABLE user_accounts ADD COLUMN must_change_password boolean NOT NULL DEFAULT false;
