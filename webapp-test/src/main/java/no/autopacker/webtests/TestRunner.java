package no.autopacker.webtests;

import no.autopacker.webtests.helpers.ChromiumDriverHelper;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Iterator;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Runs end-to-end web-app tests
 */
public class TestRunner {
    private static final Logger logger = LoggerFactory.getLogger(TestRunner.class);
    private static final String DASHBOARD_LINK_SELECTOR = "#main-dashboard-link b";
    private static final String YOUR_PROJECTS_LINK_SELECTOR = "#sidebar-link-projects";
    private static final String YOUR_SERVERS_LINK_SELECTOR = "#sidebar-link-servers";
    private static final String TAG_CLASS = ".ant-tag";
    private static final String USER_DROPDOWN_MENU_SELECTOR = "#user-menu-link";
    private static final String LOGOUT_SELECTOR = "#logout-link";
    private static final String SIGN_IN_SELECTOR = "#sign-in-link";
    private WebDriver driver;
    private final Actions actions;
    private final String mainPageUrl;
    private static final String WEBDRIVER_INIT_ERROR = "WebDriver not initialized";

    /**
     * Instantiates test runner with a new chrome driver.
     *
     * @param config Test configuration parameters
     */
    public TestRunner(TestConfig config) {
        if (config == null) throw new IllegalArgumentException("Can't run tests without a configuration");
        driver = ChromiumDriverHelper.getWebDriver(config.isHeadless());
        if (driver == null) throw new IllegalArgumentException("Could not find WebDriver for Selenium");
        // Set timeout for expected "elements" to appear
        driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);
        mainPageUrl = config.getUrl();
        this.actions = new Actions(driver);
    }

    /**
     * Quits the test runner, shuts down WebDriver. This object can't be used anymore after this step.
     */
    public void quit() {
        logger.info("Quiting WebDriver for the runner...");
        driver.quit();
        driver = null;
    }

    /**
     * Creates a project with a single tag, checks if the tag is visible, then deletes the project
     * Assumes that we start in the dashboard page. Finishes test in the dashboard page.
     *
     * @return True on success, false on failure
     */
    public boolean runSingleTagProjectTest() throws InterruptedException {
        if (driver == null) throw new IllegalStateException(WEBDRIVER_INIT_ERROR);

        String[] tags = new String[]{"tag1"};
        final String projectName = "OneTagProject";
        if (!createNewProject(projectName, "A project with a single tag", tags)) return false;
        if (!goToProjectOverview(projectName)) return false;
        int tagCount = checkElementCount(TAG_CLASS);
        if (tagCount != 1) {
            logger.error("Single project test failed: did not find the tag!");
        }
        if (!goToProjectSettings()) return false;
        if (!deleteProject()) return false;
        return tagCount == 1;
    }

    /**
     * Creates a project with two tags, checks if these tags are visible, then deletes the project.
     * Assumes that we start in the dashboard page. Finishes test in the dashboard page.
     *
     * @return True on success, false on failure
     */
    public boolean runTwoTagProjectTest() throws InterruptedException {
        if (driver == null) throw new IllegalStateException(WEBDRIVER_INIT_ERROR);

        String[] tags = new String[]{"tag1", "tag2"};
        final String projectName = "TwoTagProject";
        if (!createNewProject(projectName, "A project with two tags", tags)) return false;
        if (!goToProjectOverview(projectName)) return false;
        int tagCount = checkElementCount(TAG_CLASS);
        if (tagCount != 2) {
            logger.error("Expected two tags, got {}", tagCount);
        }
        if (!goToProjectSettings()) return false;
        if (!deleteProject()) return false;
        return tagCount == 2;
    }

    /**
     * Creates a project with a tag consisting of a single character, checks if the tag is displayed correctly, then deletes the project.
     * Assumes that we start in the dashboard page. Finishes test in the dashboard page.
     *
     * @return True on success, false on failure
     */
    public boolean runOneCharTagProjectTest() throws InterruptedException {
        if (driver == null) throw new IllegalStateException(WEBDRIVER_INIT_ERROR);
        final String TAG = "t";
        String[] tags = new String[]{TAG};
        final String projectName = "OneCharTagProject";
        if (!createNewProject(projectName, "A project with single-char tag", tags)) return false;
        WebElement listTag = getElementWithText(TAG_CLASS, "t");
        if (listTag == null) {
            logger.error("Tag {} not shown in the overview page", TAG);
        }
        if (!goToProjectOverview(projectName)) return false;
        WebElement overviewTag = getElementWithText(TAG_CLASS, "t");
        if (overviewTag == null) {
            logger.error("The tag not shown in project overview page");
        }
        if (!goToProjectSettings()) return false;
        if (!deleteProject()) return false;
        return listTag != null && overviewTag != null;
    }

    /**
     * Checks if breadcrumb menu has correct links
     * Assumes that we start in Your Projects page. Finishes in Your Project page.
     *
     * @return True on success, false on failure
     */
    public boolean runBreadcrumbTest() throws InterruptedException {
        if (driver == null) throw new IllegalStateException(WEBDRIVER_INIT_ERROR);

        boolean linksOK = true;

        // If no projects exist, create one
        if (!haveProjects()) {
            createNewProject("StaticProj", "This project is needed for testing", new String[]{});
        }

        // Check links in project overview page first
        if (goToFirstProjectOverview()) {
            linksOK = checkBreadcrumbLinks();
            if (linksOK) {
                logger.info("Breadcrumb links OK on project overview page");
            }
            // Then go to settings page and check links there
            goToProjectSettings();
            linksOK = checkBreadcrumbLinks() && linksOK;
            if (linksOK) {
                logger.info("Breadcrumb links OK on project setting page");
            }
        } else {
            logger.warn("User has no projects, can't check breadcrumb links");
        }

        goToYourServers();
        if (!haveServers()) {
            createNewServer("StaticServer", "This server is needed for testing",
                    "10.11.12.13", "igarj");
        }

        if (goToFirstServerOverview()) {
            linksOK = checkBreadcrumbLinks() && linksOK;
            if (linksOK) {
                logger.info("Breadcrumb links OK on server overview page");
            }

            goToServerSettings();
            linksOK = checkBreadcrumbLinks() && linksOK;
            if (linksOK) {
                logger.info("Breadcrumb links OK on server setting page");
            }
        } else {
            logger.warn("User has no servers, can't check breadcrumb links");
        }

        goToYourProjects();
        return linksOK;
    }

    /**
     * Check if the user currently has any projects
     * Assumes that we start in Your Projects page. Finishes test in Your Project page.
     *
     * @return True if the user has at least one project visible, false otherwise
     */
    private boolean haveProjects() {
        return !driver.findElements(By.cssSelector(".project-card")).isEmpty();
    }

    /**
     * Check all breadcrumb links currently present on the page
     *
     * @return True if all links OK, false if at least one of them is broken
     */
    private boolean checkBreadcrumbLinks() {
        List<WebElement> links = driver.findElements(By.cssSelector(".ant-breadcrumb-link a"));
        boolean linksOK = true;
        for (WebElement link : links) {
            String text = link.getText();
            String expectedUrl = null;
            if (text.contains("Your Projects")) {
                expectedUrl = "/profile/projects";
            } else if (text.contains("Dashboard")) {
                expectedUrl = "/profile";
            } else if (text.contains("Your Servers")) {
                expectedUrl = "/profile/servers";
            }
            if (expectedUrl != null) {
                expectedUrl = mainPageUrl + expectedUrl;
            }
            String presentUrl = link.getAttribute("href");
            if (expectedUrl != null && !expectedUrl.equals(presentUrl)) {
                logger.error("Breadcrumb link error: should be {}, but got {}", expectedUrl, presentUrl);
                linksOK = false;
            }
        }

        return linksOK;
    }

    /**
     * Open the main AutoPacker page.
     */
    public boolean openMainPage() {
        logger.info("Navigating to main page {}", mainPageUrl);
        driver.navigate().to(mainPageUrl);
        return true;
    }

    /**
     * Tries to sign in with given username and password.
     * Assumes that we are on the main (public) AutoPacker page.
     *
     * @param username Username to use for Sign-in
     * @param password Password to use for Sign-in
     * @return True when successfully logged in, false otherwise
     * @throws InterruptedException When thread-sleep interrupted
     */
    public boolean signIn(String username, String password) throws InterruptedException {
        logger.info("Click Sign in");
        if (!clickOnElement(".ant-menu-item > div")) return false;
        Thread.sleep(500);
        logger.info("Fill in username and password, sign in");
        if (!clickAndEnterText("#username", username)) return false;
        if (!clickAndEnterText("#password", password)) return false;
        if (!clickOnElement("#kc-login")) return false;
        Thread.sleep(1000);
        if (checkElementCount(DASHBOARD_LINK_SELECTOR) != 1) {
            logger.info("Expected Dashboard link on the page after sign-in, did not see it!");
            return false;
        }
        return true;
    }

    /**
     * Go to the Dashboard page. Assume that we were signed in and on the page somewhere.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    public boolean goToDashboard() throws InterruptedException {
        logger.info("Click on the AutoPacker logo");
        if (!clickOnElement(DASHBOARD_LINK_SELECTOR)) return false;
        Thread.sleep(1000);
        return true;
    }

    /**
     * Go to "Your Projects" page. Assume that we were signed in and on the page somewhere.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    public boolean goToYourProjects() throws InterruptedException {
        logger.info("Go to Your Projects");
        if (!clickOnElement(YOUR_PROJECTS_LINK_SELECTOR)) return false;
        Thread.sleep(1000);
        return true;
    }

    /**
     * Go to "Your Servers" page. Assume that we were signed in and on the page somewhere.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    public boolean goToYourServers() throws InterruptedException {
        logger.info("Go to Your Servers");
        if (!clickOnElement(YOUR_SERVERS_LINK_SELECTOR)) return false;
        Thread.sleep(1000);
        return true;
    }

    /**
     * Attempts to perform a logout
     *
     * @return true if user is unauthenticated, false if not
     * @throws InterruptedException When thread-sleep interrupted
     */
    public boolean tryLogout() throws InterruptedException {
        logger.info("Attempting logout...");
        WebElement userDropdownMenu = driver.findElement(By.cssSelector(USER_DROPDOWN_MENU_SELECTOR));
        if (userDropdownMenu != null) {

            moveMouseOver(userDropdownMenu);
            Thread.sleep(500);
            driver.findElement(By.cssSelector(LOGOUT_SELECTOR)).click();

            logger.info("Clicking logout button");
            Thread.sleep(1000);

            if (this.checkElementCount(SIGN_IN_SELECTOR) == 1) {
                logger.info("Logout success...");
                return true;
            } else {
                logger.error("Logout attempt failed...");
                return false;
            }
        } else {
            logger.error("Logout attempt failed...");
            return false;
        }
    }

    /**
     * Simulates a mouse over/hover functionality
     *
     * @param webElement the element to "hover over"
     */
    private void moveMouseOver(WebElement webElement) {
        this.actions.moveToElement(webElement).perform();
    }

    /**
     * Creates a new project. Assumes that we are on Your Projects page.
     *
     * @param name        Project name
     * @param description Project description
     * @param tags        Project tags
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean createNewProject(String name, String description, String[] tags) throws InterruptedException {
        logger.info("Create a new project");
        if (!clickOnElement("#new-project-link")) return false;
        if (!clickAndEnterText("#projectName", name)) return false;
        if (!clickAndEnterText("#project-description", description)) return false;
        final String TAG_SELECTOR = "#project-tags";
        if (checkElementCount(TAG_SELECTOR) != 1) return false;
        for (String tag : tags) {
            driver.findElement(By.cssSelector(TAG_SELECTOR)).sendKeys(tag);
            driver.findElement(By.cssSelector(TAG_SELECTOR)).sendKeys(Keys.ENTER);
        }
        if (!clickOnElement("#create-project-btn")) return false;

        Thread.sleep(1000);
        return true;
    }

    /**
     * Open project overview page for a project with given name. Assumes that we are on Your Projects page.
     *
     * @param projectName Name of the project to open
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean goToProjectOverview(String projectName) throws InterruptedException {
        logger.info("Open project details");
        if (!clickOnXPathElement("//div[@class='ant-card-meta-title' and text() = '" + projectName + "']")) {
            return false;
        }
        Thread.sleep(1000);
        return true;
    }

    /**
     * Open project overview page for the first available project. It assumes that we are on Your projects page.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean goToFirstProjectOverview() throws InterruptedException {
        logger.info("Open first project details");
        if (!clickOnElement(".project-card")) {
            return false;
        }
        Thread.sleep(1000);
        return true;
    }

    /**
     * Opens project setting page. Assumes that we are on project overview page.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean goToProjectSettings() throws InterruptedException {
        logger.info("Go to project settings");
        if (clickOnElement("#project-settings-link")) {
            Thread.sleep(1000);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Deletes a project. Assumes that we are on project setting page. Ends up in Your Projects page.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean deleteProject() throws InterruptedException {
        logger.info("Deleting project...");
        if (!clickOnElement("#delete-project-button")) return false;
        Thread.sleep(500);
        if (!clickAndEnterText(".ant-input:nth-child(3)", "delete")) return false;
        if (!clickOnElement(".ant-btn:nth-child(2)")) return false;
        Thread.sleep(1000);
        return true;
    }

    /**
     * Open server overview page for the first available server. It assumes that we are on Your Servers page.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean goToFirstServerOverview() throws InterruptedException {
        logger.info("Open first server details");
        if (!clickOnElement(".server-card")) {
            return false;
        }
        Thread.sleep(1000);
        return true;
    }

    /**
     * Check if the user currently has any servers
     * Assumes that we start in Your Servers page. Finishes in Your Servers page.
     *
     * @return True if the user has at least one server visible, false otherwise
     */
    private boolean haveServers() {
        return !driver.findElements(By.cssSelector(".server-card")).isEmpty();
    }

    /**
     * Creates a new server. Assumes that we are on Your Servers page.
     *
     * @param title       Server title
     * @param description Server description
     * @param ipAddress   IP address
     * @param username    Username
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean createNewServer(String title, String description, String ipAddress, String username) throws InterruptedException {
        logger.info("Create a new server");
        if (!clickOnElement("#new-server-link")) return false;
        if (!clickAndEnterText("#serverTitle", title)) return false;
        if (!clickAndEnterText("#server-description", description)) return false;
        if (!clickAndEnterText("#ipAddress", ipAddress)) return false;
        if (!clickAndEnterText("#username", username)) return false;
        if (!clickOnElement("#create-server-btn")) return false;

        Thread.sleep(1000);
        return true;
    }

    /**
     * Opens server setting page. Assumes that we are on server overview page.
     *
     * @return True on success, false on failure.
     * @throws InterruptedException When thread-sleep interrupted
     */
    private boolean goToServerSettings() throws InterruptedException {
        logger.info("Go to server settings");
        if (clickOnElement("#server-settings-link")) {
            Thread.sleep(1000);
            return true;
        } else {
            return false;
        }
    }


    /**
     * Try to click on a DOM element.
     *
     * @param cssSelector CSS selector for the element
     * @return True on success, false if element was not found (and hence was not clicked)
     */
    private boolean clickOnElement(String cssSelector) {
        WebElement element = driver.findElement(By.cssSelector(cssSelector));
        if (element != null) {
            element.click();
        }
        return element != null;
    }

    /**
     * Try to find an element with given CSS selector and containing a text.
     *
     * @param cssSelector CSS selector for the element
     * @return The first matching WebElement or null if none found
     */
    private WebElement getElementWithText(String cssSelector, String text) {
        List<WebElement> elements = driver.findElements(By.cssSelector(cssSelector));
        WebElement element = null;
        Iterator<WebElement> it = elements.iterator();
        while (element == null && it.hasNext()) {
            element = it.next();
            if (element == null || !text.equals(element.getText())) {
                element = null;
            }
        }
        return element;
    }

    /**
     * Try to click on a DOM element, identified by an XPath expression
     *
     * @param xpath XPath expression for the element
     * @return True on success, false if element was not found (and hence was not clicked)
     */
    private boolean clickOnXPathElement(String xpath) {
        WebElement element = driver.findElement(By.xpath(xpath));
        if (element != null) {
            element.click();
        }
        return element != null;
    }

    /**
     * Try to click on an input element and enter text in it.
     *
     * @param cssSelector CSS selector for the element
     * @param textValue   Text to enter in the input element
     * @return True on success, false if element was not found (and hence was not clicked)
     */
    private boolean clickAndEnterText(String cssSelector, String textValue) {
        WebElement element = driver.findElement(By.cssSelector(cssSelector));
        if (element != null) {
            element.click();
            element.sendKeys(textValue);
        }
        return element != null;
    }

    /**
     * Check count of currently available elements on the page.
     *
     * @param cssSelector CSS selector for the elements
     * @return Count of the elements, 0 if none found.
     */
    private int checkElementCount(String cssSelector) {
        return driver.findElements(By.cssSelector(cssSelector)).size();
    }

    /**
     * Check count of currently available elements on the page.
     *
     * @param xpath XPath expression for the elements
     * @return Count of the elements, 0 if none found.
     */
    private int checkXPathElementCount(String xpath) {
        return driver.findElements(By.xpath(xpath)).size();
    }
}
