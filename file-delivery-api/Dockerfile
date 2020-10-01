FROM docker:18

RUN apk add maven openjdk11
COPY . /usr/src/fdapi

ENTRYPOINT ["mvn", "-f", "/usr/src/fdapi", "spring-boot:run", "-DskipTests", "-Dspring-boot.run.profiles=staging"]