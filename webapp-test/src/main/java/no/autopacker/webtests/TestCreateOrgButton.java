package no.autopacker.webtests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TestCreateOrgButton {

    private final static String username = "user";
    private final static String password = "user";
    private final static String mainpage = "http://localhost:3000/";
    private final static Logger logger = LoggerFactory.getLogger(TestCreateOrgButton.class);
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
        boolean createOrgButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/section/section/main/div[2]/main/button")).isDisplayed();
        foundButton(createOrgButton);




    }

    private static void foundButton(boolean result){
        if (result){
            logger.info("Create org button element found!");
        } else {
            logger.info("Create org button element not found!");
        }
    }
}
