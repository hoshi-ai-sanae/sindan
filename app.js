"use strict";
(() => {
  const results = globalThis.HOSHI_RESULTS;
  const sectionLabels = [
    ["strength", "あなたの強み"], ["approach", "あなたらしい進み方"],
    ["hint", "強みを活かすヒント"], ["message", "迷ったときのメッセージ"]
  ];
  function renderSections(container, result) {
    container.replaceChildren();
    sectionLabels.forEach(([key, title], index) => {
      const section = document.createElement("article");
      section.className = "result-section" + (key === "message" ? " message" : "");
      const heading = document.createElement("h3");
      const number = document.createElement("span");
      number.className = "number";
      number.textContent = "0" + (index + 1);
      number.setAttribute("aria-hidden", "true");
      heading.append(number, document.createTextNode(title));
      const paragraph = document.createElement("p");
      paragraph.textContent = result[key];
      section.append(heading, paragraph);
      container.append(section);
    });
  }
  if (document.querySelector("#all-results")) {
    const container = document.querySelector("#all-results");
    const index = document.querySelector("#review-index");
    results.forEach(result => {
      const link = document.createElement("a");
      link.href = "#" + result.id;
      link.textContent = result.name;
      index.append(link);
      const card = document.createElement("section");
      card.className = "result-panel review-card";
      card.id = result.id;
      const header = document.createElement("div");
      header.className = "result-header";
      const sign = document.createElement("p");
      sign.className = "sign-heading";
      sign.textContent = result.name + " ／ 守護星：" + result.ruler;
      const title = document.createElement("h2");
      title.textContent = result.title;
      header.append(sign, title);
      const meta = document.createElement("div");
      meta.className = "review-meta";
      meta.textContent = "STEP1参照：視点「" + result.view + "」／前提「" + result.premise + "」";
      const body = document.createElement("div");
      body.className = "result-sections";
      renderSections(body, result);
      card.append(header, meta, body);
      container.append(card);
    });
    return;
  }
  const form = document.querySelector("#diagnosis-form");
  const options = document.querySelector("#sign-options");
  const selection = document.querySelector("#selection");
  const resultPanel = document.querySelector("#result");
  const submit = document.querySelector("#show-result");
  history.scrollRestoration = "manual";
  let selected = null;
  results.forEach(result => {
    const label = document.createElement("label");
    label.className = "sign-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "sign";
    input.value = result.id;
    input.required = true;
    input.setAttribute("aria-label", result.name);
    const face = document.createElement("span");
    face.className = "sign-face";
    const symbol = document.createElement("span");
    symbol.className = "sign-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = result.symbol;
    face.append(symbol, document.createTextNode(result.name));
    label.append(input, face);
    options.append(label);
    input.addEventListener("change", () => {
      selected = result;
      submit.disabled = false;
      document.querySelector("#selection-status").textContent = result.name + "を選択しています。";
    });
  });
  function showSelection() {
    selection.hidden = false;
    resultPanel.hidden = true;
    const input = options.querySelector("input:checked") || options.querySelector("input");
    input.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:"instant"});
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!selected) return;
    document.querySelector("#result-symbol").textContent = selected.symbol;
    document.querySelector("#result-sign").textContent = selected.name;
    document.querySelector("#result-ruler").textContent = "守護星：" + selected.ruler;
    document.querySelector("#result-heading").textContent = selected.title;
    renderSections(document.querySelector("#result-sections"), selected);
    selection.hidden = true;
    resultPanel.hidden = false;
    history.pushState({screen:"result"}, "");
    document.querySelector("#result-heading").focus({preventScroll:true});
    window.scrollTo({top:0,behavior:"instant"});
  });
  // ブラウザーの「戻る」でも選択画面へ。選択内容はURLや永続領域へ保存しない。
  history.replaceState({screen:"selection"}, "");
  document.querySelector("#choose-again").addEventListener("click", () => history.back());
  window.addEventListener("popstate", event => {
    if (event.state?.screen === "result" && selected) {
      selection.hidden = true;
      resultPanel.hidden = false;
      document.querySelector("#result-heading").focus({preventScroll:true});
      window.scrollTo({top:0,behavior:"instant"});
    } else showSelection();
  });
})();
