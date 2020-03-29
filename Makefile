include .env


start-nodemon:
	docker build -f Dockerfile.dev -t node_server_nodemon . 
	docker run -p $(PORT):$(PORT) node_server_nodemon npm run nodemon

start:
	docker build -f Dockerfile.dev -t sravanreddyguduru7/server-node . 
	docker run -p $(PORT):$(PORT) --name $(conatiner_name) sravanreddyguduru7/server-node 

build:
	docker rm -f $(conatiner_name)
	docker build -f Dockerfile.dev -t sravanreddyguduru7/server-node . 
	docker run -p $(PORT):$(PORT) --name $(conatiner_name) sravanreddyguduru7/server-node 
	docker cp $(conatiner_name):/usr/app/dist .

start-prod:
	docker build -t sravanreddyguduru7/server-node . 
	docker run -p $(PORT):$(PORT) sravanreddyguduru7/server-node npm run startproduction