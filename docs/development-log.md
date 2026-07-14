# Eventos CRM - Development Log

> Project: Eventos CRM
> Repository: blueberry-crm
> Stack: Next.js 15, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL
> Started: July 2026
> Status: Foundation Phase

---

# Objective

Build a multi-tenant CRM for Event Management companies.

Primary goals:

- Website + CRM
- SaaS Architecture
- Multi Organization
- Secure Authentication
- Role Based Access
- Sell to multiple event companies

---

# Tech Stack

Frontend

- Next.js
- React
- TypeScript
- TailwindCSS

Backend

- Supabase
- PostgreSQL
- Supabase Auth

Database

- PostgreSQL
- UUID Primary Keys
- Row Level Security
- Multi Tenant Architecture

Deployment

- Vercel
- Supabase Cloud

Version Control

- Git
- GitHub

---

# Folder Structure Created

app/
components/
hooks/
providers/
services/
lib/
lib/supabase/
public/
types/
utils/
docs/
supabase/
supabase/migrations/

---

# Documentation Created

architecture.md

Contains

- Application Architecture
- Folder Structure
- Coding Guidelines

database.md

Contains

- Database Design
- Relationships
- Authentication
- Multi Tenant Notes

features.md

Contains

- CRM Features
- Future Modules

roles.md

Contains

- Owner
- Salesperson
- Accountant

routes.md

Contains

- Application Routes

roadmap.md

Contains

- Future Development Plan

coding-standards.md

Contains

- Naming conventions
- File organization
- Best practices

---

# Authentication Decisions

Authentication Provider

Supabase Auth

Login Method

Email + Password

Organization Isolation

organization_id stored in every business table.

Future Authentication

- Owner
- Salesperson
- Accountant

---

# Database Decisions

Database

PostgreSQL

Primary Key

UUID

Every Business Table Contains

organization_id

Reason

Complete isolation between different companies.

No company can ever see another company's data.

---

# Multi Tenant Architecture

Chosen

Shared Database

Shared Schema

Organization Isolation

organization_id

Benefits

- Single deployment
- Easy maintenance
- Easy scaling
- SaaS Ready

---

# Database Tables Planned

organizations

Stores

- Company Name
- Email
- Phone
- Address
- Website

profiles

Stores

- User
- Role
- Organization
- Phone

Future Tables

clients

events

quotations

quotation_items

vendors

vendor_payments

artists

staff

staff_attendance

payments

expenses

notes

activity_logs

---

# Git Workflow

Repository initialized

GitHub connected

Main branch created

Commit strategy

One feature per commit

---

# Supabase Setup

Completed

Supabase CLI Installed

Project Linked

Authentication Configured

Remote Database Connected

RLS Enabled

Environment Variables Configured

---

# Issues Encountered

Issue 1

Docker not starting.

Reason

Docker Desktop was not completely initialized.

Resolution

Restarted Docker.

Verified Docker daemon.

---

Issue 2

Supabase CLI could not inspect Docker.

Error

failed to inspect docker image

Reason

Docker Linux Engine unavailable.

Resolution

Docker restarted.

Docker Desktop verified.

---

Issue 3

Supabase db pull failed.

Error

Docker prerequisite.

Reason

Docker engine not available during command.

Resolution

Docker fixed.

---

Issue 4

Supabase db pull memory error.

Error

fatal error:
out of memory allocating heap arena map

Reason

Temporary Docker initialization issue.

Resolution

Docker restarted.

Retry successful.

---

Issue 5

Migration Failure

Error

relation "organizations" does not exist

Reason

initial_schema.sql was empty.

foundation_updates.sql attempted ALTER TABLE before tables existed.

---

Root Cause

Original tables were created directly inside Supabase SQL Editor.

Later

Supabase migrations were introduced.

Migration history became inconsistent.

---

Important Lesson Learned

Never create database tables directly inside SQL Editor.

Always create

Migration

↓

SQL

↓

db push

↓

Git Commit

---

Correct Workflow

Create Migration

npx supabase migration new create_events

↓

Write SQL

↓

npx supabase db push

↓

git add .

↓

git commit

↓

git push

---

Architecture Decisions

Chosen

Multi Tenant

Reason

Product will be sold to multiple companies.

Chosen

UUID

Reason

Distributed IDs.

Chosen

Row Level Security

Reason

Security.

Chosen

Supabase Auth

Reason

Integrated Authentication.

Chosen

PostgreSQL

Reason

Scalable.

---

Current Progress

Project Structure

100%

Git Setup

100%

Supabase Setup

100%

Authentication Foundation

100%

Database Planning

100%

Architecture

100%

Documentation

100%

Migration Strategy

100%

Initial Schema

Completed

Foundation Updates

Completed

---

Current Modules Completed

Website

Completed

Project Structure

Completed

Authentication Setup

Completed

Database Foundation

Completed

Documentation

Completed

Migration Workflow

Completed

---

Next Development Phase

Authentication Pages

Login

Signup

Forgot Password

Dashboard

Organization Management

User Roles

Clients

Events

Quotations

Vendor Management

Payments

Reports

Settings

---

Engineering Rules

Never modify production database manually.

Every database change must be a migration.

Every migration must be committed.

Never skip Git commits.

Never store secrets inside repository.

Every business table must contain organization_id.

Always enable RLS.

Document every architectural decision.

---

Lessons Learned

A clean migration history is more important than quickly creating tables.

Using SQL Editor for schema creation creates migration inconsistencies.

Docker must be correctly configured before using Supabase local commands.

Database architecture should be finalized before feature development begins.

Documentation reduces future technical debt.

---

Project Status

Current Phase

Foundation Complete

Ready For

Authentication Development

Version

v0.1 Foundation