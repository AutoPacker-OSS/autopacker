package no.autopacker.webtests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TestCreateOrg {

    private final static String username = "user";
    private final static String password = "user";
    private final static String orgname = "test";
    private final static String orgdec = "test";
    private final static String orgurl = "user";
    private final static String mainpage = "http://localhost:3000/";
    private final static Logger logger = LoggerFactory.getLogger(TestCreateOrg.class);
    private final static String driver = "C:\\Users\\eirik\\Desktop\\AutoPacker\\AutoPacker\\webapp-test\\src\\main\\resources\\chromedriver\\windows\\chromedriver.exe";



    public static void main(String[] args)  {

       System.setProperty("webdriver.chrome.driver", driver);
       WebDriver driver = new ChromeDriver();

        // Navigating to the webpage and logs in
        driver.get(mainpage);
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/header/ul[2]/li[2]")).click();


        // Submitting username and password to login
        WebElement userTextField = driver.findElement(By.xpath("//*[@id=\"username\"]"));
        WebElement passwordTextField = driver.findElement(By.xpath("//*[@id=\"password\"]"));
        WebElement logInButton = driver.findElement(By.xpath("//*[@id=\"kc-login\"]"));
        userTextField.sendKeys(username);
        passwordTextField.sendKeys(password);
        logInButton.click();

        //  Navigating to the origination page
        WebElement userMenu = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/header/ul[2]/li[2]"));
        WebElement userMenuOrg = driver.findElement(By.xpath("//*[@id=\"item_0$Menu\"]/li[3]"));
        Actions action = new Actions(driver);
        action.moveToElement(userMenu).moveToElement(userMenuOrg).click().build().perform();

        // Detecting the button
        boolean createOrgButtonExist = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/button")).isDisplayed();
        foundButton(createOrgButtonExist);

        //Navigating to Creat Org Page
        WebElement createOrgButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/button"));
        createOrgButton.click();

        // Filling out the form
        WebElement orgName = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/form/div[1]/div[2]/div[1]/div"));
        WebElement orgDec = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/form/div[2]"));
        WebElement orgUrl = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/form/div[3]"));
        orgName.sendKeys(orgname);
        orgDec.sendKeys(orgdec);
        orgUrl.sendKeys(orgurl);

        WebElement radioPublic = driver.findElement(By.xpath("//*[@id=\"organizationVisibility\"]/label[1]/span[1]/input"));
        WebElement radioPrivte = driver.findElement(By.xpath("//*[@id=\"organizationVisibility\"]/label[2]/span[1]/input"));

        //Public button selected
        radioPublic.click();
        boolean publicEnabled = driver.findElement(By.xpath("//*[@id=\"organizationVisibility\"]/label[1]/span[1]/input")).isSelected();
        String result = "public";
        selectedRadio(publicEnabled, result);

        //Private button selected
        radioPrivte.click();
        boolean privateEnabled = driver.findElement(By.xpath("//*[@id=\"organizationVisibility\"]/label[2]/span[1]/input")).isSelected();
        result = "private";
        selectedRadio(privateEnabled, result);

        boolean createButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/form/div[6]/button")).isEnabled();
        canSubmitForm(createButton);
    }

    private static void foundButton(boolean result){
        if (result){
            logger.info("Create org button element found!");
        } else {
            logger.info("Create org button element not found!");
        }
    }

    private static void selectedRadio (Boolean bool, String result){

        if ((bool = true) && (result == "public")) {
            logger.info("Public radio button is selected");
        } else if ((bool = true) && (result == "private")){
            logger.info("Private radio button is selected");
        } else {
            logger.info("No radio button is selected");
        }
    }

    private static void canSubmitForm (boolean result){
        if (result){
            logger.info("Form can be submitted");
        } else {
            logger.info("Form could not be sumbitted");
        }
    }
}
