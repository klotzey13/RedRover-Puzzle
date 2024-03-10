const convertStringToNestedObject = (inputString: string): any => {
  // This stack will hold objects during the parsing process
  const stack: any[] = [];
  // This will point to the current object we are filling
  let currentObject: any = null;

  // Tokenize the input string into an array of words and parentheses
  const stringTokens = inputString.match(/\w+|\(|\)/g) || [];

  stringTokens.forEach((token, index) => {
    if (token === "(") {
      const newObject = {};

      // If there's a currentObject, add the newObject to the currentObject
      // If there's no currentObject, push the newObject onto the stack
      currentObject
          ? (currentObject[stringTokens[index - 1]] = newObject)
          : stack.push(newObject);

      // Push the newObject onto the stack and set it as the currentObject
      stack.push(newObject);
      currentObject = newObject;
    } else if (token === ")") {
      // If the token is a closing parenthesis, pop the top object from the stack
      // set the new top object as the currentObject
      if (stack.length > 1) {
        stack.pop();
        currentObject = stack[stack.length - 1];
      } else {
        throw new Error("Unbalanced parentheses in input string.");
      }
    } else if (stringTokens[index + 1] !== "(") {
      // If the token is a word and the next token is not an opening parenthesis,
      // add an empty object to the currentObject using the token as the key
      currentObject[token] = {};
    }
  });

  return stack[0];
};

const printIndentedStructure = (
    structureToPrint: any,
    indentationLevel: number = 0,
    sortKeys: boolean = false,
): void => {
  const structureKeys = sortKeys
      ? Object.keys(structureToPrint).sort()
      : Object.keys(structureToPrint);

  structureKeys.forEach((key) => {
    console.log(`${"  ".repeat(indentationLevel)}- ${key}`);

    // If the value of the key is an object, recursively call this function with the value
    // incrementing the indentation level
    if (
        typeof structureToPrint[key] === "object" &&
        structureToPrint[key] !== null &&
        !Array.isArray(structureToPrint[key])
    ) {
      printIndentedStructure(structureToPrint[key], indentationLevel + 1, sortKeys);
    }
  });
};

const inputString =
    "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

try {
  const nestedStructure = convertStringToNestedObject(inputString);

  console.log("Output 1:");
  printIndentedStructure(nestedStructure);

  console.log("\nOutput 2 (sorted):");
  printIndentedStructure(nestedStructure, 0, true);

} catch (error: any) {
  console.error(error.message);
}