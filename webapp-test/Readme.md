# Web-app tests

End-to-end tests for the web application. Uses [Selenium](https://www.selenium.dev/documentation/en/) and [ChromeDriver](https://chromedriver.chromium.org/downloads).

## Setup
The tests are using Selenium. Selenium is a cross-platform web testing tool, it supports different drivers. We use ChromeDriver in this project. Therefore, you need two things on your local PC to run the tests:
1. [Chrome browser](https://www.google.com/chrome/), install it if you don't have it yet
2. ChromeDriver

Setup procedure of the ChromeDriver:
1. Check the version of Chrome browser you have: Go to settings (the three-dot menu), Help > About Chrome. There you will see the version (for example, version `89.0.4389.90`). The first number is the important part (`89` in the example).
2. Go to [ChromeDriver downloads](https://chromedriver.chromium.org/downloads) And find the necessary version: same version as you Chrome browser has. In the example, `89` was the version, so [here is the download site for ChromeDriver version 89](https://chromedriver.storage.googleapis.com/index.html?path=89.0.4389.23/).
3. Download the `.zip` archive for your operating system
4. Extract the `.zip` file, inside you will find a file `chromedriver` (`chromedriver.exe` on Windows)
5. Copy that file to this project, folder `src/main/resources/chromedriver/<your-os>`. If you find a file with the same name there already, simply overwrite it.

You should be good to go!

## Running the tests
To run the tests, you can either execute `mvn compile exec:java` or simply run the `TestRunnerApp` in your IDE.

## Testing inside Docker
NOT WORKING YET!

To run the tests inside Docker, wun the following commands inside the webapp-test project directory:
```
docker build --tag webapptest:1.0 .
docker container run -it --rm --name webtest webapptest:1.0
```
