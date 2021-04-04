FROM docker:18

RUN apk add maven openjdk11
COPY . /usr/src/api

ENTRYPOINT ["mvn", "-f", "/usr/src/api", "spring-boot:run", "-DskipTests"]
