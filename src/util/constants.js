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
export const compoundKey = "compoundMolFile"
export const cidsKey = "cidsKey"
export const structureKey = "structureKey"

export const emptyMol = "\n" +
    "  MJ240402                      \n" +
    "\n" +
    "  0  0  0  0  0  0  0  0  0  0999 V2000\n" +
    "M  END\n"

export const pubChemUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'
export const pubChemPropertiesUrl = (smiles) => pubChemUrl +"smiles/" + smiles + "/property/MolecularFormula,MolecularWeight,IUPACName,Title/JSON"
export const pubChemIsomersUrl = (molFormula) => pubChemUrl + 'fastformula/' + molFormula + '/property/MolecularWeight,IUPACName,Title,SMILES/JSON'

//validation
export const minTestTitleLength = 5;
export const maxTestTitleLength = 30;