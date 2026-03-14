const stepsInput = document.getElementById('steps');
const output = document.getElementById('output');
const generateButton = document.getElementById('generate');

function sanitizeStep(text) {
  return text
    .replace(/^\s*\d+\.\s*/, '')
    .replace(/"/g, '\\"')
    .trim();
}

function mapStepToCode(stepText) {
  const step = stepText.toLowerCase();

  if (step.includes('open chrome')) {
    return 'WebDriver driver = new ChromeDriver();';
  }

  if (step.includes('go to') || step.includes('navigate')) {
    return 'driver.get("https://example.com/login");';
  }

  if (step.includes('username')) {
    return 'driver.findElement(By.id("username")).sendKeys("qa_user");';
  }

  if (step.includes('password')) {
    return 'driver.findElement(By.id("password")).sendKeys("secret123");';
  }

  if (step.includes('click') && step.includes('login')) {
    return 'driver.findElement(By.cssSelector("button[type=submit]")).click();';
  }

  if (step.includes('verify') && step.includes('dashboard')) {
    return 'Assert.assertTrue(driver.findElement(By.id("dashboard")).isDisplayed());';
  }

  return `// TODO: Implement step: ${sanitizeStep(stepText)}`;
}

function generateJavaFromSteps(rawInput) {
  const lines = rawInput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const codeLines = lines.map(mapStepToCode).map((line) => `    ${line}`);

  return `import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginGeneratedTest {

  @Test
  public void generatedLoginTest() {
${codeLines.join('\n')}
    // Best practice: move locators to Page Objects before committing.
  }
}`;
}

function refreshOutput() {
  output.value = generateJavaFromSteps(stepsInput.value);
}

generateButton.addEventListener('click', refreshOutput);

refreshOutput();
