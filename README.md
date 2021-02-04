# AutoPacker
AutoPacker is an automated software packaging and deployment solution.
AutoPacker is a simple, but productive and transparent platform that is cloud-service and hosting independent and offers a way to manage projects, servers, deployment and storage, and being a platform for people to share projects and ideas.
AutoPacker was created by three bachelor students at [NTNU](https://www.ntnu.edu/) as a part of their bachelor thesis project.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Getting Started
AutoPacker consists of several modules, each is a separate sub-project:
- File delivery API - manages projects, modules, dockerfiles and docker-compose blocks.
- General API - REST API for organizations, supported languages and their versions
- Server manager - manages user-owned servers, file upload to servers, etc. 
- User service - User management. Talks to a Keycloak service for authentication. 

Except the Web application, all other sub-projects have a REST API interface. I.e., Web application is a REST client while all other modules are REST servers.

To run the system you need to run all these modules. See the "Installing" section for instructions. 

### Prerequisites
To develop the projects, you need the following services deployed somewhere:
- [KeyCloak](https://www.keycloak.org/) authentication server. Here is a [tutorial on how to set up your own Keycloak authentication server](https://medium.com/@hasnat.saeed/setup-keycloak-server-on-ubuntu-18-04-ed8c7c79a2d9). You can also use [docker to setup a keycloak server](https://www.keycloak.org/getting-started/getting-started-docker). See [here](https://hub.docker.com/r/jboss/keycloak) for documentation on configuring keycloak with external database.
- SMTP server for email delivery (For example, [Google's SMTP server](https://support.google.com/a/answer/176600?hl=en): host=smtp.gmai.com, port:587, username=your-gmail-email-address, password=your-gmail-password, auth=true, use-tls=true).

In addition, you need the following tools on your computer:
- [Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- A Java project editor, such as [IntelliJ](https://www.jetbrains.com/idea/)
- Javascript, HTML, CSS Editor, such as [WebStorm](https://www.jetbrains.com/webstorm/)
- [Yarn package manager](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

### Installing
The first section describes general requirements - for all the modules. The following sections describe setup steps 
for each module of the project. Web application depends on all other modules.
  
#### General install instructions
All the server-side (backend) modules have two requirements which must be met:
1. A [KeyCloak](https://www.keycloak.org/) authentication server. This is needed to authorize users. You can set up your own KeyCloak server. If you want to use a predefined KeyCloak server for testing, take contact with AutoPacker developers.
2. Each module (file delivery, general API, server manager, and user service) use a MySQL for data storage. You must provide a database for each module. It is up to you to choose either to have a single shared DB for all the projects, or to have a separate DB for each project. The important thing is that you must provide a MySQL database - just an empty database, the modules will set up necessary tables. You can choose whether to run a MySQL container in a Docker container, have a Local MySQL installation, or use a remote MySQL database. The modules need only to have a URL to a MySQL server, database name, user and password. 
  
#### Running User Service
To run the User Service:
1. Set up a MySQL database.
2. Create `application.yml` file in the `src/main/resouces` directory (take a copy of the `template.application.yml` file, fill in the values according to your implementation).
3. Run the project with either `mvn spring-boot:run` in the terminal, or launch the `UserServiceApplication` class from your IDE. 

#### Running File Delivery API
File Delivery API has one extra requirement: a [MongoDB](https://www.mongodb.com/) database. Steps for running File Delivery API:
1. Set up a MongoDB database.
2. Set up a MySQL database.
4. Create `application.properties` file in the `src/main/resouces` directory (take a copy of the `template.application.properties` file, fill in the values according to your implementation). In case if you want to run different setups for development and production environments, you can create several property files, for example, `application-dev.properties`. Then you need to add a switch for the maven command when running it: `-Dspring-boot.run.profiles=dev`. 
4. Create `application.yml` file in the `src/main/resouces` directory (take a copy of the `template.application.yml` file, fill in the values according to your implementation).
5. Run the project with either `mvn spring-boot:run` in the terminal, or launch the `FileDeliveryApiApplication` class from your IDE. If you use specific `application.properties` files, for example, `application-dev.properties`, you can specify which `.properties` configuration to use, for example: `mvn spring-boot:run -Dspring-boot.run.profiles=dev` will use `application-dev.properties`.

#### Running Server Manager
To run the User Service:
1. Set up a MySQL database.
2. Create `application.yml` file in the `src/main/resouces` directory (take a copy of the `template.application.yml` file, fill in the values according to your implementation).
3. Run the project with either `mvn spring-boot:run` in the terminal, or launch the `ServerManagerApplication` class from your IDE. 

#### Running Web application
The web module is a React application. You need to install the dependencies (Javascript libraries) for the project first: run `yarn install` in the project directory.

To run a debug-version (during development), run `yarn start` in the project directory.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

Run `yarn build` to get a minified production-ready version of the site, it will be stored in the `build` directory.

#### Alternative to service application.yml configuration
We have created a docker image called autopacker/local-config-server that will distribute application.yml properties to the backend services without needing specify the values yourself. The only requirement to use this option is that the mysql database username is root and the password is left empty. The Mongo database also has the username root, but the password here is: password.

### Docker environment setup (easy way)
If you are using docker you can easily setup the whole working environment with four steps. If you copy paste all the code lines below you should have a fully working development environment running on your machine!

#### Run keycloak server
We have created a local development keycloak server that can be run with: 
```
docker container run -d --name keycloak -p 8080:8080 autopacker/local-keycloak
```
This will setup a local keycloak server on your host computer with the admin credentials (username: admin, password: admin). It also holds an example user (username: user, password: user)

#### Run Mysql container
Just creating a mysql container with a desired database set as environment property:
```
docker container run -d --name mysql-backend -p 3306:3306 -e MYSQL_DATABASE=autopacker -e MYSQL_USER=root -e MYSQL_PASSWORD= -e MYSQL_ALLOW_EMPTY_PASSWORD=1 autopacker/local-mysql-backend
```

#### Run Mongo container
```
docker run --name mongodb -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=password -dp 27017:27017 mongo
```

#### Run local config server
Using this pre-created local config server you don't have to specify any properties unless you use custom values deviating from the database credentials mentioned further up. The config server is run with:
```
docker container run -d --name config-server -p 8888:8888 autopacker/local-config-server
```

#### Backend Services
When you have the four containers (MySQL, Mongo, Keycloak, Config Server) up and running you should be ready to start developing. Just run the backend services and they should be able to connect to the other services without any problems

## Running the tests
TODO - Explain how to run the automated tests for this system


## Deployment
TODO Add additional notes about how to deploy this on a live system.


## Authors
* Aron Mar Nicholasson
* Liban Bashir Nor
* Bendik Uglem Nogva
* Girts Strazdins

See also the list of [contributors](https://github.com/AutoPacker-OSS/autopacker/graphs/contributors) who participated in this project.


## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/AutoPacker-OSS/autopacker/blob/develop/LICENSE) file for details

