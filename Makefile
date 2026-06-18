init-web:
	@echo "installing dependencies for web"
	cd apps/web/ && pnpm install

start-web:
	@echo "starting up web..."
	cd apps/web/ && pnpm run dev

start-api:
	@echo "starting up the api..."
	cd apps/api-node/ && pnpm start dev

start-docker:
	@echo "starting up docker..."
	docker compose up

clean-frontend:
	@echo "cleaning up cache..."
	rm -rf apps/web/.next