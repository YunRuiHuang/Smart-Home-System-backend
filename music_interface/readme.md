# Music Interface

## Interface

### Docker setup

```shell
docker build -t music-app .
#using the dockerfile to build a image in docker

docker run --name music-app --network sample-network -p 3002:3000 -d --restart always music-app
#set up the interface at port 3001, now you access localhost:3001/ you should see a test:"success" which means success setup the interface server

```

## Interface

/ -|

​    |-- /folder (get)

​    |-- /folder (put)

​    |-- /update (get)

​    |-- /update (put)

​    |-- /update (post)

​    |-- /folderlist (get)

​    |-- /playing (get)

​    |-- /next (get)

​    |-- /status (get)

​    |-- /status (put)

​    |-- /rand (put)

​    |-- /list (get)

​    |-- /add (put)







































