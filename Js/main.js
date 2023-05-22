const GeneratedPassword = document.getElementById("password_Result");
const copyButton = document.getElementById("copyButton");
const copiedTooltip = document.querySelector(".copied");
const rangeSlider = document.getElementById("length");
const passwordLength = document.querySelector(".character-length");
const PasswordOptions = document.querySelectorAll('input[type="checkbox"]');
const strengthBars = document.querySelectorAll(".strengthType span");
const strengthText = document.querySelector("#strength-desc");
const generatePasswordBtn = document.querySelector(".generate-button");

// Password options
const chars = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{},.<>?/|",
};

// Password strength types
const strengthTypes = {
  veryWeak: 1,
  weak: 2,
  medium: 3,
  strong: 4,
};

// Selected password options
let selectedOptions = [];

// helper functions

const getRandomCharacter = (characters) => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};

const updatePasswordLengthslider = () => {
  passwordLength.innerHTML = rangeSlider.value;
  const backgroundSize = (rangeSlider.value / rangeSlider.max) * 100;
  rangeSlider.style.backgroundSize = `${backgroundSize}% 100%`;
};

const updateSelectedOptions = (e) => {
  if (e.target.checked) {
    if (!selectedOptions.includes(e.target.value)) {
      selectedOptions.push(e.target.value);
    }
  } else {
    selectedOptions = selectedOptions.filter((val) => val !== e.target.value);
  }
};

const resetStrengthBarStyles = () => {
  strengthBars.forEach((bar) => {
    bar.className = "";
  });
};

const updateStrengthBar = (type) => {
  resetStrengthBarStyles();

  for (let i = 0; i < strengthTypes[type]; i++) {
    strengthBars[i].classList.add(type);
  }
  strengthText.innerHTML = type;
};

const calculatePasswordStrength = (password) => {
  let strength = 0;

  // Check length of password
  if (password.length >= 8) {
    strength += 1;
  }
  if (password.length >= 12) {
    strength += 1;
  }

  // Check for character types
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[\W_]/.test(password);

  const characterTypes = [hasLowercase, hasUppercase, hasNumber, hasSymbol];
  const numberOfCharacterType = characterTypes.filter((type) => type).length;

  strength += Math.min(numberOfCharacterType, 3);

  return strength;
};

const updatePasswordStrengthBars = (password) => {
  const passwordStrength = calculatePasswordStrength(password);

  switch (passwordStrength) {
    case 1:
    case 2:
      updateStrengthBar("veryWeak");
      break;
    case 3:
      updateStrengthBar("weak");
      break;
    case 4:
      updateStrengthBar("medium");
      break;
    default:
      updateStrengthBar("strong");
      break;
  }
};

// [05]- Generate Password based on selected Options

const getPasswordCharacterSet = () => {
  let characterSet = "";

  if (selectedOptions.includes("uppercase")) characterSet += chars.uppercase;
  if (selectedOptions.includes("lowercase")) characterSet += chars.lowercase;
  if (selectedOptions.includes("numbers")) characterSet += chars.numbers;
  if (selectedOptions.includes("symbols")) characterSet += chars.symbols;

  return characterSet;
};

const generatePassword = () => {
  const passwordLengthValue = parseInt(rangeSlider.value);
  const characterSet = getPasswordCharacterSet();

  let password = "";
  if (characterSet) {
    for (let i = 1; i <= passwordLengthValue; i++) {
      password += getRandomCharacter(characterSet);
    }
  }

  GeneratedPassword.value = password;
  updatePasswordStrengthBars(password);
};

// listners

copyButton.addEventListener("click", async () => {
  try {
    GeneratedPassword.select();
    GeneratedPassword.setSelectionRange(0, 99999);

    await navigator.clipboard.writeText(GeneratedPassword.value);
    copiedTooltip.style.opacity = "1";
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
});

PasswordOptions.forEach((option) => {
  option.addEventListener("change", (e) => {
    updateSelectedOptions(e);
  });
});

rangeSlider.addEventListener("input", updatePasswordLengthslider);
generatePasswordBtn.addEventListener("click", generatePassword);
