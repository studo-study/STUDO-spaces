init-web:
	@echo "installing dependencies for web"
	cd apps/web/ && pnpm install

init-api:
	@echo "installing dependencies for api"
	cd apps/api-node/ && pnpm install

init-workers:
	@echo "compiling rust workers"
	cd workers && cargo build

init-dev-tools:
	@echo "intalling dependencies for devtools"
	cd apps/dev-tools && pnpm install

init-all: init-web init-api init-dev-tools init-workers
	@echo "installing all dependencies"

start-docker:
	@echo "starting up docker..."
	docker compose up

start-docker-api:
	@echo "starting up full api in docker container..."
	docker compose -f docker-compose-backend.yml up

start-docker-api-seeded:
	@echo "starting up full seeded api in docker container... "
	docker compose -f docker-compose-backend.yml --profile seed up

stop-docker:
	docker compose down


start-web:
	@echo "starting up web..."
	cd apps/web/ && pnpm run dev

start-api:
	@echo "starting up the api..."
	cd apps/api-node/ && pnpm start dev

start-dev-tools:
	@echo "starting up the api..."
	cd apps/dev-tools/ && pnpm run dev

start-rust-workers:
	@echo "starting up the api..."
	cd workers/ && cargo run

clean-frontend:
	@echo "cleaning up cache..."
	rm -rf apps/web/.next

clippy:
	@echo "running Clippy check..."
	cd workers && cargo clippy --all-targets --all-features -- -D warnings

ci:
	@echo "running ci tests..."
	@echo "running ESLint..."
	pnpm turbo lint
	@echo "running prettier..."
	pnpm exec prettier --check "apps/**/*.{ts,tsx,js,jsx}" "packages/**/*.{ts,tsx}"
	@echo "running typecheck..."
	pnpm turbo typecheck
	@echo "testing build..."
	pnpm --filter @studo/types build
	@echo "running tests..."
	pnpm --filter @studo/api-node test
	pnpm --filter @studo/api-node test:e2e
	@echo "installing dependencies..."
	pnpm install --frozen-lockfile
	@echo "clippy"
	cd workers && cargo clippy --all-targets --all-features -- -D warnings
	@echo "integration tests..."
	pnpm --filter @studo/api-node db:migrate
	pnpm --filter @studo/api-node exec drizzle-kit check
	pnpm --filter @studo/api-node db:seed

node_modules: package.json pnpm-lock.yaml
	pnpm install --frozen-lockfile
	@touch node_modules

#analyseren van memory etc
analyze:
	cd apps/web && ANALYZE=true pnpm build


#checken of die outdated zijn of niet
deps:
	pnpm outdated -r
	pnpm audit

count-lines:
	cloc --vcs=git --exclude-dir=node_modules,.next,dist,build,target \
         --not-match-f='(package-lock|pnpm-lock)\.(json|yaml)|\.gen\.ts$'