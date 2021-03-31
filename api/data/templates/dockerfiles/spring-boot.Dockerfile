FROM maven:3-jdk-11
COPY . /usr/src/fdapi
ENTRYPOINT ["mvn", "-f", "/usr/src/fdapi", "spring-boot:run", "-DskipTests"]