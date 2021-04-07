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

    public static void main(String[] args) {
        try {
            TestConfig config = readConfigFile();
            runner = new TestRunner(config);
            if (!runner.openMainPage()) quitTests();
            if (runner.signIn("wronguser", "wrongpassword")) quitTests();
            if (!runner.openMainPage()) quitTests();
            if (!runner.signIn(config.getRegularUsername(), config.getRegularPassword())) quitTests();
            if (!runner.goToDashboard()) quitTests();

            if (!runProjectTests(runner)) quitTests();

            if (!runner.runBreadcrumbTest()) quitTests();

            // Last test is to perform a logout()
            if (!runner.tryLogout()) quitTests();
        } catch (InterruptedException e) {
            logger.info("Tests interrupted");
        }

        runner.quit();
        logger.info("All tests succeeded");
    }

    /**
     * Run project-related tests. It is assumed that the testing starts on dashboard page.
     * Tests are also finished on the Dashboard page.
     * @param runner Test runner to use
     * @return true on success. Does not return anything (exits) on error
     * @throws InterruptedException Thread.sleep may be used internally, interrupting it throws an exception
     */
    private static boolean runProjectTests(TestRunner runner) throws InterruptedException {
        if (!runner.goToYourProjects()) quitTests();

        if (!runner.runTwoTagProjectTest()) quitTests();
        if (!runner.runSingleTagProjectTest()) quitTests();
        if (!runner.runOneCharTagProjectTest()) quitTests();
        if (!runner.goToDashboard()) quitTests();
        return true;
    }

    /**
     * Run organization-related tests. It is assumed that the testing starts on dashboard page.
     * Tests are also finished on the Dashboard page.
     * @param runner Test runner to use
     * @return true on success. Does not return anything (exits) on error
     * @throws InterruptedException Thread.sleep may be used internally, interrupting it throws an exception
     */
    private static boolean runOrganizationTests(TestRunner runner) throws InterruptedException {
        if (!runner.goToYourOrganizations()) quitTests();
//        if (!runner.createOrganization()) quitTests();
//        if (!runner.deleteOrganization()) quitTests();

        return true;
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
