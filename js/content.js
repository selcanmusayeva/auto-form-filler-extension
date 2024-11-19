const nameDiv = document.querySelector(".npiJhzMllNjLdTFwgmXZfuEGFbcQxAxMiJE");
const nameh1 = nameDiv.querySelector("h1");
console.log(nameh1.textContent);

if (nameh1) {
  const accountName = nameh1.textContent.trim();
  console.log(accountName);

  chrome.runtime.sendMessage({ action: "SET_ACCOUNT_NAME", accountName });
} else {
  console.error(
    "Account name not found. Make sure this is a LinkedIn profile page."
  );
}
