#!/bin/bash
# ============================================================
# init.sh — Clean restart: backup, drop, migrate, seed
# ============================================================
# Usage:
#   bash init.sh              # Full reset (backup + drop + migrate + seed)
#   bash init.sh --no-seed    # Reset without seeding
#   bash init.sh --backup     # Backup only
# ============================================================

set -e

# --- Config ---
DB_NAME="lmr_stories"
DB_USER="lmr"
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# --- Docker container names ---
PG_CONTAINER="lmr_stories-postgres-1"
REDIS_CONTAINER="lmr_stories-redis-1"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; }
info() { echo -e "${CYAN}[>>]${NC} $1"; }

# Helper: run psql via Docker
dpsql() {
  docker exec "$PG_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" "$@"
}

# --- Check prerequisites ---
check_prereqs() {
  if ! docker ps --format '{{.Names}}' | grep -q "$PG_CONTAINER"; then
    err "PostgreSQL container '${PG_CONTAINER}' is not running."
    echo "  Start it with: docker-compose up -d"
    exit 1
  fi

  # Test DB connection
  if ! dpsql -c "SELECT 1;" &> /dev/null; then
    err "Cannot connect to PostgreSQL inside container"
    exit 1
  fi
  log "Database connection OK (via Docker)"
}

# --- Step 1: Backup ---
backup_database() {
  info "Backing up database to ${BACKUP_FILE}..."
  mkdir -p "$BACKUP_DIR"

  docker exec "$PG_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" \
    --no-owner --no-acl \
    > "$BACKUP_FILE" 2>/dev/null

  if [ -s "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Backup saved: ${BACKUP_FILE} (${SIZE})"
  else
    warn "Backup file is empty (database may have no data)"
  fi
}

# --- Step 2: Drop all tables ---
drop_all_tables() {
  info "Dropping all tables..."

  dpsql -q -c "
DO \$\$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
  FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typtype = 'e') LOOP
    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
  END LOOP;
END \$\$;
"

  log "All tables and types dropped"
}

# --- Step 3: Clear Redis ---
clear_redis() {
  info "Flushing Redis cache..."
  if docker ps --format '{{.Names}}' | grep -q "$REDIS_CONTAINER"; then
    docker exec "$REDIS_CONTAINER" redis-cli FLUSHALL &> /dev/null && log "Redis flushed"
  else
    warn "Redis container not running — skipping"
  fi
}

# --- Step 4: Install deps + Run migrations ---
run_migrations() {
  info "Installing server dependencies..."
  cd server
  npm install --silent
  log "Dependencies installed"

  info "Running TypeORM migrations..."
  npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts
  cd ..
  log "Migrations complete"
}

# --- Step 5: Seed ---
run_seed() {
  info "Seeding database (this may take a while — translating to EN/FR/AR)..."
  cd server
  npx ts-node -r reflect-metadata src/data/seed.ts
  cd ..
  log "Seeding complete"
}

# --- Main ---
main() {
  echo ""
  echo "========================================="
  echo "  LMR Stories — Database Reset"
  echo "========================================="
  echo ""

  MODE="${1:-full}"

  check_prereqs

  # Always backup first
  backup_database

  if [ "$MODE" = "--backup" ]; then
    log "Backup-only mode. Done!"
    exit 0
  fi

  drop_all_tables
  clear_redis
  run_migrations

  if [ "$MODE" = "--no-seed" ]; then
    warn "Skipping seed (--no-seed flag)"
  else
    run_seed
  fi

  echo ""
  echo "========================================="
  log "All done! Database is fresh."
  echo "  Backup at: ${BACKUP_FILE}"
  echo "========================================="
  echo ""
}

main "$@"
