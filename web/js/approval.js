document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadTab01(),
      loadTab02(),
      loadTab03(),
      loadTab04(),
      loadTab05(),
      loadTab06(),
      loadPopupBizList(),
      initRequestTableCell(),
    ]);

    initBizPopup();
  } catch (error) {
    console.error('컴포넌트 로드 오류:', error);
  }
});

// tab01 컴포넌트
async function loadTab01() {
  const target = document.getElementById('compTab01');

  if (!target) return;

  const response = await fetch('approval/tab01.html');

  if (!response.ok) throw new Error('tab01.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// tab02 컴포넌트
async function loadTab02() {
  const target = document.getElementById('compTab02');

  if (!target) return;

  const response = await fetch('approval/tab02.html');

  if (!response.ok) throw new Error('tab02.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// tab03 컴포넌트
async function loadTab03() {
  const target = document.getElementById('compTab03');

  if (!target) return;

  const response = await fetch('approval/tab03.html');

  if (!response.ok) throw new Error('tab03.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}
// tab04 컴포넌트
async function loadTab04() {
  const target = document.getElementById('compTab04');

  if (!target) return;

  const response = await fetch('approval/tab04.html');

  if (!response.ok) throw new Error('tab04.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}
// tab05 컴포넌트
async function loadTab05() {
  const target = document.getElementById('compTab05');

  if (!target) return;

  const response = await fetch('approval/tab05.html');

  if (!response.ok) throw new Error('tab05.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}
// tab06 컴포넌트
async function loadTab06() {
  const target = document.getElementById('compTab06');

  if (!target) return;

  const response = await fetch('approval/tab06.html');

  if (!response.ok) throw new Error('tab06.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// common.js의 좌측 리스트 렌더링이 끝난 후 실행
document.addEventListener('leftListLoaded', activeRequest);

// 등록 화면 이동 시 현재 URL에 해당하는 좌측 메뉴 활성화
function activeRequest() {
  const pathname = window.location.pathname;
  const rows = document.querySelectorAll('#compLeftList tbody tr');

  if (!rows.length) return;

  const menuName = pathname.includes('request-equipment')
    ? '기자재'
    : pathname.includes('request-loan')
      ? '대여금'
      : pathname.includes('request-new-vendor')
        ? '신규'
        : '';

  if (!menuName) return;

  const activeRow = [...rows].find((row) =>
    row.textContent.trim().includes(menuName),
  );

  if (!activeRow) return;

  rows.forEach((row) => row.classList.remove('active'));
  activeRow.classList.add('active');
}

// 업체 팝업 컴포넌트
async function loadPopupBizList() {
  const response = await fetch('comp-popup-biz-list.html');

  if (!response.ok) throw new Error('comp-popup-biz-list.html 로드 실패');

  const data = await response.text();
  document.getElementById('compPopupBizList').innerHTML = data;
}

// 업체 검색 팝업
function initBizPopup() {
  const popup = document.querySelector('.popup_search_biz');

  if (!popup) {
    console.error('업체 검색 팝업을 찾을 수 없습니다.');
    return;
  }

  document.addEventListener('click', (event) => {
    // 업체 검색 팝업 열기
    if (event.target.closest('.btn_open_popup')) {
      popup.classList.remove('closed');
      return;
    }

    // 업체 검색 팝업 닫기
    if (
      event.target.closest('.btn_closed') ||
      event.target.closest('.btn_selected_biz_nm')
    ) {
      popup.classList.add('closed');
    }
  });
}

// request-로 시작하는 페이지의 vertical 테이블 td 활성화
function initRequestTableCell() {
  if (!window.location.pathname.includes('request-')) return;

  const cells = [...document.querySelectorAll('table.vertical tr td')].filter(
    (td) => !td.closest('[id^="compTab"]'),
  );

  if (!cells.length) return;

  cells[0].classList.add('td_insert');

  cells.forEach((td) => {
    td.addEventListener('click', () => {
      cells.forEach((cell) => cell.classList.remove('td_insert'));
      td.classList.add('td_insert');
    });
  });
}
