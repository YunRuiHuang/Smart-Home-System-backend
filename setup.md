# Setup Environments



## setup Docker

### local network

```shell
docker network create <network-name>
```

### Find containers local net ip

```shell
docker ps // find the container first
docker inspect <container_id_or_name> //get the container config
```

```json
"Networks": {
    "mynetwork": {
        "IPAddress": "172.18.0.2", //here is the local network ip
        "Gateway": "172.18.0.1",
        "MacAddress": "02:42:ac:12:00:02",
        "NetworkID": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        "EndpointID": "abcdef1234567890"
    }
}
```



### MySQL

```shell
docker run --name <container-name> --network <network-name> -p <host-port>:3306 -e MYSQL_ROOT_PASSWORD=<password> mysql
```

