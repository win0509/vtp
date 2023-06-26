// 번역 API Document : https://mymemory.translated.net/
// 번역이 불안정함 : 유료 api(인공지능)으로 전환하여 해결 - 무료로는 파파고를 많이 사용
// 모바일에서 구동 시 설정 언어 변경 불가능 : 앱 개발을 통해 네이티브 기능을 수정할 수 있음

const requestUrl = "https://api.mymemory.translated.net/get?q=";

const selectedBtns = document.querySelectorAll(".select-btns button");
const toElmt = document.querySelector(".to");
const toTextArea = document.querySelector(".lang-to textarea");
const fromTextArea = document.querySelector(".lang-from textarea");
const translateBtn = document.querySelector(".translate");
const loaderRing = document.querySelector(".lds-ring");
const resetBtn = document.querySelector(".reset-btn");

// 언어 선택 버튼 활성화 및 기능 실행
selectedBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    selectedBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");

    const toLang = this.textContent;
    const langForm = this.getAttribute("id");
    toElmt.textContent = toLang;
    toElmt.setAttribute("value", langForm);
    toTextArea.setAttribute("placeholder", `${toLang}로 번역 됩니다.`);
  });
});

async function translateLanguage() {
  const fromTextValue = fromTextArea.value;
  const langFromPair = document.querySelector(".from").getAttribute("value");
  const langTopair = document.querySelector(".to").getAttribute("value");

  await fetch(
      `/vtp/php/controller.php?txt=${fromTextValue}&from=${langFromPair}&to=${langTopair}`
  )
    .then((data) => data.json())
    .then((result) => {
      console.log(result);
      toTextArea.value = result.message.result.translatedText;
      loaderRing.classList.remove("loading");
    });
}

translateBtn.addEventListener("click", function () {
  if (!fromTextArea.value) {
    alert("번역할 말을 입력해 주세요.");
    fromTextArea.focus();
    return;
  }

  loaderRing.classList.add("loading");
  translateLanguage();
});

resetBtn.addEventListener("click", function () {
  window.location.reload();
});

$(function () {
  // switch function here...
  $(".switch-btns").click(function () {
    const fromSpan = $(".from");
    const toSpan = $(".to");
    const tempValue = fromSpan.html();
    const tempAttr = fromSpan.attr("value");

    const fromText = $(".lang-from textarea");
    const toText = $(".lang-to textarea");

    fromSpan.html(toSpan.html());
    fromSpan.attr("value", toSpan.attr("value"));
    fromText.attr("placeholder", `${toSpan.text()} 음성을 입력해 주세요.`);

    toSpan.html(tempValue);
    toSpan.attr("value", tempAttr);
    toText.attr("placeholder", `${tempValue}로 번역 됩니다.`);
  });
});

// /*************** Voice Recieve Code ***************/ //
const searchConsole = document.getElementById("search_console");

// ----- 현재 브라우저에서 API 사용이 유효한가를 검증
function availabilityFunc() {
  //현재 SpeechRecognition을 지원하는 크롬 버전과 webkit 형태로 제공되는 버전이 있으므로 둘 중 해당하는 생성자를 호출한다.

  const switchBtn = document.querySelector(".switch-btns");

  switchBtn.addEventListener("click", function () {
    const pair = document.querySelector(".from").getAttribute("value");
    recognition.lang = pair; // 음성인식에 사용되고 반환될 언어를 설정한다.
  });

  recognition = new webkitSpeechRecognition() || new SpeechRecognition();

  recognition.maxAlternatives = 5; //음성 인식결과를 5개 까지 보여준다.

  if (!recognition) {
    alert("현재 브라우저는 사용이 불가능합니다.");
  }
}

// --- 음성녹음을 실행하는 함수
function startRecord() {
  console.log("시작");

  const changePair = document.querySelector(".from").getAttribute("value");
  console.log(changePair);

  // 클릭 시 음성인식을 시작한다.
  recognition.addEventListener("speechstart", () => {
    console.log("인식");
  });

  //음성인식이 끝까지 이루어지면 중단된다.
  recognition.addEventListener("speechend", () => {
    console.log("인식2");
  });

  //음성인식 결과를 반환
  // SpeechRecognitionResult 에 담겨서 반환된다.
  recognition.addEventListener("result", (e) => {
    searchConsole.value = e.results[0][0].transcript;
  });

  recognition.start();
}
// 클릭 시 종료(안 눌러도 음성인식은 알아서 종료됨)
function endRecord() {
  console.log("종료");
  recognition.stop(); // 음성인식을 중단하고 중단까지의 결과를 반환
}

window.addEventListener("load", availabilityFunc);

// /*************** Voice Reading Code ***************/ //
function speak(text, opt_prop) {
  const readlangPair = document.querySelector(".to").getAttribute("value");
  if (
    typeof SpeechSynthesisUtterance === "undefined" ||
    typeof window.speechSynthesis === "undefined"
  ) {
    alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
    return;
  }

  window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

  const prop = opt_prop || {};

  const speechMsg = new SpeechSynthesisUtterance();
  speechMsg.rate = prop.rate || 1; // 속도: 0.1 ~ 10
  speechMsg.pitch = prop.pitch || 1; // 음높이: 0 ~ 2
  speechMsg.lang = prop.lang || readlangPair;
  speechMsg.text = text;

  // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
  window.speechSynthesis.speak(speechMsg);
}

// 이벤트 영역
const selectLang = document.getElementById("select-lang");
const text = document.getElementById("text");
const btnRead = document.querySelector(".read-text");

btnRead.addEventListener("click", (e) => {
  const readlangPair = document.querySelector(".to").getAttribute("value");
  speak(text.value, {
    rate: 1,
    pitch: 1.2,
    lang: readlangPair,
  });
});
