import Parser, { SyntaxNode } from "tree-sitter";
const CSharp = require("tree-sitter-c-sharp");

const parser = new Parser();
parser.setLanguage(CSharp);

const sourceCode = `
class Garbage
{
    public void DoSomething() 
    {

    }
}

public enum Season
{
    Spring = 1,
    Summer = 2,
    Autumn = 3,
    Winter = 4
}

class Garbage2
{
    public void DoSomething() 
    {
        
    }
}
`;

const enumDeclaration = "enum_declaration";
const enumMemberDeclaration = "enum_member_declaration";
const enumMemberDeclarationList = "enum_member_declaration_list";

const tree = parser.parse(sourceCode);
const cursor = tree.walk();

let output = "";

const parseEnum = (node: SyntaxNode) => {
  if (node.type !== enumDeclaration) {
    throw new Error("Expected enum declaration");
  }

  const enumName = node.children.find((t) => t.type === "identifier")?.text;
  const enumMembers = node.children.find(
    (n) => n.type === enumMemberDeclarationList
  );

  const enumValues = enumMembers?.children
    .filter((n) => n.type === enumMemberDeclaration)
    .map((n) => n.text);

  output += `enum ${enumName} { ${enumValues?.join(",")} }`;
};

for (const node of cursor.currentNode.children) {
  if (node.type === enumDeclaration) {
    parseEnum(node);
  }
}

console.log(output);
