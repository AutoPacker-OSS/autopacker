# Web-app tests

End-to-end tests for the web application. Uses [Selenium](https://www.selenium.dev/documentation/en/) and [ChromeDriver](https://chromedriver.chromium.org/downloads).

To run the tests, execute `mvn compile exec:java`.

To run the tests inside Docker, wun the following commands inside the webapp-test project directory:
```
docker build --tag webapptest:1.0 .
docker container run -it --rm --name webtest webapptest:1.0
```
