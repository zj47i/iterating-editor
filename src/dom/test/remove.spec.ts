import "@testing-library/jest-dom";
import { DomElement } from "../dom-element";

test("remove", () => {
    // 테스트할 DOM 작성
    document.body.innerHTML = `
    <div> 
      <p> stay </p> 
      <p id="target"> remove </p>
      </div>  
    </div>
  `;

  const p = document.getElementById("target");
  DomElement.remove(p);

  expect(document.body).toHaveTextContent("stay");
  expect(document.body).not.toHaveTextContent("remove");
});

test("remove2", () => {
  // 테스트할 DOM 작성
  document.body.innerHTML = `
  <div> 
    <p> stay </p> 
    <div id="target"> 
      <p id="p2"> nested remove </p>
    </div>  
  </div>
`;

const p = document.getElementById("target");

expect(document.body).toHaveTextContent("nested remove");
DomElement.remove(p);

expect(document.body).toHaveTextContent("stay");
expect(document.body).not.toHaveTextContent("nested remove");
});
