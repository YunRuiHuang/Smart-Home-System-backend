# Sample Interface

Include A MYSQL database and a Express JS web API interface 

## database

### MYSQL setup

**we will set up the database in the docker**

```shell
docker network create <network-name>
#setup a local network for docker

docker run --name <container-name> --network <network-name> -p <host-port>:3306 -e MYSQL_ROOT_PASSWORD=<password> -d mysql 
#set up the last version mysql
```

**Sample**

```shell
docker network create sample-network
#setup a local network for docker

docker run --name mysql --network sample-network -p 3000:3306 --restart always -e MYSQL_ROOT_PASSWORD=password -d mysql 
#set up the last version mysql at port 3000
```

**Fast reset**

```shell
docker rm sample-app
docker rmi sample-app

```





## Interface

### Docker setup

```shell
docker build -t bill-app .
#using the dockerfile to build a image in docker

docker run --name bill-app --network sample-network -p 3003:3000 -d --restart always bill-app
#set up the interface at port 3001, now you access localhost:3001/ you should see a test:"success" which means success setup the interface server

```





































