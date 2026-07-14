-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------------------------------
-- ORGANIZATIONS
------------------------------------------------------------

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    slug TEXT UNIQUE NOT NULL,

    logo_url TEXT,

    created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- PROFILES
------------------------------------------------------------

CREATE TABLE profiles (

    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

    full_name TEXT,

    email TEXT,

    role TEXT DEFAULT 'admin',

    avatar_url TEXT,

    created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- INDEXES
------------------------------------------------------------

CREATE INDEX idx_profiles_organization
ON profiles(organization_id);

CREATE INDEX idx_organizations_slug
ON organizations(slug);