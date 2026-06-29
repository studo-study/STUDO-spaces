init-web:
	@echo "installing dependencies for web"
	cd apps/web/ && pnpm install

init-api:
	@echo "installing dependencies for api"
	cd apps/api-node/ && pnpm install

init-rust-workers:
	@echo "compiling rust workers"
	cd apps/services/rust-services && cargo build

init-swift-workers:
	@echo "spinning up vapor"
	cd apps/services/swift-services && swift run App

init-all: init-web init-api
	@echo "installing all dependencies"

start-docker:
	@echo "starting up docker..."
	docker compose up

start-web:
	@echo "starting up web..."
	cd apps/web/ && pnpm run dev

start-api:
	@echo "starting up the api..."
	cd apps/api-node/ && pnpm start dev

clean-frontend:
	@echo "cleaning up cache..."
	rm -rf apps/web/.next

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
	@echo "integration tests..."
	pnpm --filter @studo/api-node db:migrate
	pnpm --filter @studo/api-node exec drizzle-kit check
	pnpm --filter @studo/api-node db:seed

node_modules: package.json package-lock.json
	pnpm install --frozen-lockfile
	@touch node_modules

#analyseren van memory etc
analyze:
	cd apps/web && ANALYZE=true pnpm build


#checken of die outdated zijn of niet
deps:
	pnpm outdated -r
	pnpm audit