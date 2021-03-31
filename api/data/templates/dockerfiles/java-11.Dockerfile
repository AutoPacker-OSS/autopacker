FROM openjdk:11
COPY . /usr/src/java-app
WORKDIR /usr/src/java-app
ENTRYPOINT [ "javac", "Main.java" ]