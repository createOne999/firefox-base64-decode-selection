# Firefox Base64 Decode Selection

[English](README.md) | **한국어** 

선택한 Base64 인코딩된 텍스트를 컨텍스트 메뉴(우클릭 메뉴)를 통해 간편하게 디코딩하는 Firefox 브라우저 확장 프로그램입니다.

## 주요 기능

*   웹 페이지에서 Base64로 인코딩된 텍스트를 마우스로 드래그하여 선택합니다.
*   선택된 텍스트 위에서 마우스 오른쪽 버튼을 클릭합니다.
*   컨텍스트 메뉴에 나타나는 "Base64 Decode" 항목을 클릭합니다.
*   디코딩된 텍스트가 원본 텍스트 근처(위 또는 아래)의 잘리지 않는 위치에 오버레이 형태로 표시됩니다.
*   오버레이 영역 바깥을 클릭하면 디코딩 결과 창이 사라집니다.

## 설치 방법

두 가지 방법으로 설치할 수 있습니다:

**1. Firefox 공식 Add-ons 스토어 (권장)**

*   [https://addons.mozilla.org/ko/firefox/addon/base64-decoder-on-selection/](https://addons.mozilla.org/ko/firefox/addon/base64-decoder-on-selection/)

**2. 수동 설치 (개발 및 테스트용)**

이 방법은 개발 중이거나 스토어 등록 전에 테스트할 때 유용합니다.

1.  **저장소 다운로드 또는 복제:** 이 Git 저장소를 로컬 컴퓨터에 다운로드하거나 복제합니다.
    ```bash
    git clone https://github.com/your-username/firefox-base64-decode-selection.git
    # 또는 ZIP 파일 다운로드 후 압축 해제
    ```
2.  **Firefox 실행:** Firefox 브라우저를 엽니다.
3.  **디버깅 페이지 이동:** 주소창에 `about:debugging` 을 입력하고 Enter 키를 누릅니다.
4.  **"This Firefox" 선택:** 왼쪽 메뉴에서 "This Firefox" (또는 "이 Firefox")를 클릭합니다.
5.  **임시 부가 기능 로드:** "Load Temporary Add-on..." (또는 "임시 부가 기능 로드...") 버튼을 클릭합니다.
6.  **manifest.json 선택:** 파일 탐색기 창이 열리면, 1단계에서 다운로드하거나 복제한 확장 기능 폴더로 이동하여 `manifest.json` 파일을 선택하고 "열기"를 클릭합니다.
7.  확장 기능이 로드되고 목록에 표시됩니다.

*   **참고:** 임시 부가 기능은 Firefox 브라우저를 닫으면 제거되므로, 다시 사용하려면 브라우저를 실행할 때마다 이 과정을 반복해야 합니다.

## 사용 방법

1.  웹 페이지에서 Base64로 인코딩된 텍스트를 마우스로 드래그하여 선택합니다.
2.  선택된 텍스트 위에서 마우스 오른쪽 버튼을 클릭하여 컨텍스트 메뉴를 엽니다.
3.  메뉴 항목 중 "Base64 Decode"를 클릭합니다.
4.  선택 영역 근처에 디코딩된 텍스트가 담긴 작은 오버레이 창이 나타납니다.
5.  페이지의 다른 곳을 클릭하면 오버레이 창이 닫힙니다.
