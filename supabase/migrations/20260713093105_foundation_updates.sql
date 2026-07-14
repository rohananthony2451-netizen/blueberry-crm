ALTER TABLE organizations
ADD COLUMN email text,
ADD COLUMN phone text,
ADD COLUMN address text,
ADD COLUMN website text,
ADD COLUMN updated_at timestamptz DEFAULT now();

ALTER TABLE profiles
ADD COLUMN phone text,
ADD COLUMN updated_at timestamptz DEFAULT now();