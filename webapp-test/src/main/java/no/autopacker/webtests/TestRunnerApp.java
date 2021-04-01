package no.autopacker.webtests;

import org.openqa.selenium.InvalidArgumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;

/**
 * Entry point for the tests
 */
public class TestRunnerApp {
    private static TestRunner runner;
    private final static Logger logger = LoggerFactory.getLogger(TestRunnerApp.class);

    public static void main(String[] args) throws InterruptedException {
        TestConfig config = readConfigFile();
        runner = new TestRunner(config);
        if (!runner.openMainPage()) quitTests();
        if (runner.signIn("wronguser", "wrongpassword")) quitTests();
        if (!runner.openMainPage()) quitTests();
        if (!runner.signIn(config.getUsername(), config.getPassword())) quitTests();
        if (!runner.goToDashboard()) quitTests();
        if (!runner.goToYourProjects()) quitTests();

        if (!runner.runTwoTagProjectTest()) quitTests();
        if (!runner.runSingleTagProjectTest()) quitTests();
        if (!runner.runOneCharTagProjectTest()) quitTests();

        if (!runner.runBreadcrumbTest()) quitTests();

        // Last test is to perform a logout()
        if (!runner.tryLogout()) quitTests();

        runner.quit();
        logger.info("All tests succeeded");
    }

    private static void quitTests() {
        logger.error("Some of tests failed!");
        runner.quit();
        System.exit(-1);
    }

    /**
     * Read configuration parameters from a .yml file, throw and exception if it is not found
     *
     * @return TestConfig object with the configuration or null on error
     */
    private static TestConfig readConfigFile() {
        InputStream configFileStream = TestRunner.class.getClassLoader().getResourceAsStream("application.yml");
        if (configFileStream == null) {
            throw new InvalidArgumentException("application.yml resource file not found!");
        }
        Yaml yamlParser = new Yaml();
        return yamlParser.load(configFileStream);
    }

}
