export const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
export const groups = ["Alkanes", "Alkenes", "Alkynes", "Arenes", "Alcohols", "Ethers", "Amines", "Aldehydes", "Ketones", "HaloAlkanes", "CarboxylicAcid", "Amides"]
export const grades = ["7", "8", "9", "10", "11", "12"]
export const formChoiceIdentifier = "&";
export const sortingOptions = ["Test takers", "Avg. score", "questions"]
export const closedQuestion = {
  text: "",
  options: ["", "", "", ""],
  isOpen: false,
  answerIndexes: [false, false, false, false],
  imagePath: "",
  maxScore: 1
};
export const openQuestion = {
  text: "",
  answer: "",
  maxScore: 1,
  isOpen: true,
  imagePath: ""
};

//validation
export const minTestTitleLength = 5;
export const maxTestTitleLength = 30;