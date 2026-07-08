// HTML 문서의 DOM 구조가 전부 만들어진 뒤에 내부 코드를 실행 -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // tab01 컴포넌트 로드
  loadHeader();

  const openBtn = document.querySelector('.search_biz_nm_box');
  const closeBtns = document.querySelectorAll(
    '.btn_closed, .btn_selected_biz_nm',
  );
  const popup = document.querySelector('.popup_search_biz');

  // 팝업 열기
  openBtn.addEventListener('click', () => popup.classList.remove('closed'));

  // 팝업 닫기
  closeBtns.forEach((button) =>
    button.addEventListener('click', () => popup.classList.add('closed')),
  );
});

// tab01 컴포넌트 -------------------------------------------------------
function loadHeader() {
  fetch('work/tab01.html')
    .then((response) => response.text())
    .then((data) => (document.getElementById('compTab01').innerHTML = data));
}
