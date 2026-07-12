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
    ]);

    initBizPopup();
  } catch (error) {
    console.error('컴포넌트 로드 오류:', error);
  }
});

// tab01 컴포넌트
async function loadTab01() {
  const response = await fetch('approval/tab01.html');

  if (!response.ok) throw new Error('tab01.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab01').innerHTML = data;
}

// tab02 컴포넌트
async function loadTab02() {
  const response = await fetch('approval/tab02.html');

  if (!response.ok) throw new Error('tab02.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab02').innerHTML = data;
}

// tab03 컴포넌트
async function loadTab03() {
  const response = await fetch('approval/tab03.html');

  if (!response.ok) throw new Error('tab03.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab03').innerHTML = data;
}
// tab04 컴포넌트
async function loadTab04() {
  const response = await fetch('approval/tab04.html');

  if (!response.ok) throw new Error('tab04.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab04').innerHTML = data;
}
// tab05 컴포넌트
async function loadTab05() {
  const response = await fetch('approval/tab05.html');

  if (!response.ok) throw new Error('tab05.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab05').innerHTML = data;
}
// tab06 컴포넌트
async function loadTab06() {
  const response = await fetch('approval/tab06.html');

  if (!response.ok) throw new Error('tab06.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab06').innerHTML = data;
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

// 일정관리 날짜 active 처리
document.addEventListener('click', (event) => {
  const clickedCell = event.target.closest('#compTab02 tbody tr td');

  if (!clickedCell) return;

  const cells = document.querySelectorAll('#compTab02 tbody tr td');

  cells.forEach((cell) => cell.classList.remove('active'));

  clickedCell.classList.add('active');
});
