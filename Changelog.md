### v4.1.6
- Add PostgreSQL UUID support

### v4.1.5
- Update packages to resolve security vulnerabilities

### v4.1.4
- Allow specifying custom file extensions ([#1](../../pull/1)) eg `extensions: ['ts']`
- Update packages to resolve security vulnerabilities

### v4.1.3
- Someone deleted this repo... it's back.
- Fix security vulnerability (y18n)
- Use Github Actions for CI
- If using NodeJS v14+ & Postgres, you must use `pg` >= 8.1.

### v4.1.2
- Fix security vulnerabilities

### v4.1.1
- Fix security vulnerabilities

### v4.1.0
- Allow to add foreign keys with custon constraint name and on delete action

### v4.0.5
- Update packages to fix security vulnerabilities

### v4.0.4
- Remove `git` reference to `sql-ddl-sync` - use npm version instead ([#35](../../pull/35))

### v4.0.3
- Update packages to clear security warnings ([#34](../../pull/34))

### v4.0.2 (nothing)

### v4.0.1
- Make below changes work with mysql ([#33](../../pull/33))

### v4.0.0
- Support all existing migrations when switching from coffee to js and vice versa
  ( using migration file name without extension for checking if migration
  is applied and on deleting migration record from orm_migrations table )

  **Example**: project with already executed migration `001-migration.coffee`
  ```
  > SELECT * from orm_migrations;
  | migration                                              |
  |--------------------------------------------------------|
  | 001-migration.coffe                                |
  ```
  After conversion `001-migration.coffee` to `001-migration.js`
  **node-migrate-orm2** will identify converted file as executed and will not
  re-run this migration again.

### v3.0.0
- Add Promises support to migration methods
- Add Promiess support to `Task` methods(`generate`, `up`, `down`).

### v2.0.1
- Correctly load `sql-ddl-sync` dialect - fixes for npm 5

### v2.0.0
- Migrate to new `orm_migrations` table format
- Add `Task.ensureMigrationsTable` to allow a manual migration to v2
- Fix rollback issues
- `down` default behaviour is to rollback the last migration ( use to rollback every migrations )

### v1.2.14
- Add custom types support

### v1.2.13
- Add missing 'var' declarations (#18)

### v1.2.11 - 14 May 2014
- Fix sqlite create table duplicate primary key (#13, #14)
- Update examples

### v1.2.10 - 13 May 2014
- Fix Dialect.getType call (#14)
- Deprecate `.primary` in favour of `.key`
