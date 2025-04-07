import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

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
    const parent = new DomNode(p.parentElement);
    const domNode = new DomNode(p);
    parent.detach(domNode);

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
    const domNode = new DomNode(p);

    expect(document.body).toHaveTextContent("nested remove");
    p.remove();

    expect(document.body).toHaveTextContent("stay");
    expect(document.body).not.toHaveTextContent("nested remove");
});
