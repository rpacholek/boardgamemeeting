HEROKU_APP ?=  

build-app:
	cd app && npm run-script build

build-heroku-docker: build-app
	docker build -f deployment/heroku/Dockerfile -t bgm-heroku:latest .

build-kubectl-docker: build-app
	docker buildx build --platform linux/arm64/v8 -f deployment/kubernetes/front.Dockerfile -t bgm-front-kube:latest --load .
	docker buildx build --platform linux/arm64/v8 -f deployment/kubernetes/backend.Dockerfile -t bgm-back-kube:latest --load .

run-local:
	( cd app && npm start ) &
	( cd api && python app.py ) &
	nginx -c deployment/local/nginx.conf -p ${PWD}

run-local-tmux:
	tmux split-window "cd app && npm start"
	tmux split-window "cd api && python app.py"
	tmux split-window "sleep 15 && firefox localhost:8080"
	nginx -c deployment/local/nginx.conf -p ${PWD}

deploy-heroku: build-heroku-docker
	test -n "${HEROKU_APP}" && \
	docker tag bgm-heroku:latest registry.heroku.com/boardgames-meetup/web && \
	docker push registry.heroku.com/boardgames-meetup/web && \
	heroku container:release -a ${HEROKU_APP} web

deploy-pi: build-kubectl-docker
	docker tag bgm-front-kube:latest pi.local:32000/bgm-front && \
	docker push pi.local:32000/bgm-front	
	docker tag bgm-back-kube:latest pi.local:32000/bgm-back && \
	docker push pi.local:32000/bgm-back	

login-heroku:
	heroku login
