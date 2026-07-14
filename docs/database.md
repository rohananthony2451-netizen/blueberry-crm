# Eventos Database

## Multi Tenant

Everything belongs to an Organization.

Organizations

↓

Profiles

↓

Leads

↓

Clients

↓

Quotations

↓

Quotation Items

↓

Payments

↓

Events

↓

Vendors

↓

Vendor Entries

↓

Expenses

## Authentication

Supabase Auth

## Database

PostgreSQL

## Primary Keys

UUID

## Relationships

Every business record contains:

organization_id

This guarantees complete isolation between companies.