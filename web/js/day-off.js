document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadTab01(),
      loadTab02(),
      loadTab03(),
      loadTab04(),
      loadTab05(),
      loadTab06(),
      loadAddFrom(),
    ]);

    removeaddForm();
  } catch (error) {
    console.error('컴포넌트 로드 오류:', error);
  }
});

// tab01 컴포넌트
async function loadTab01() {
  const response = await fetch('dayOff/tab01.html');

  if (!response.ok) throw new Error('tab01.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab01').innerHTML = data;
}

// tab02 컴포넌트
async function loadTab02() {
  const response = await fetch('dayOff/tab02.html');

  if (!response.ok) throw new Error('tab02.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab02').innerHTML = data;
}

// tab03 컴포넌트
async function loadTab03() {
  const response = await fetch('dayOff/tab03.html');

  if (!response.ok) throw new Error('tab03.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab03').innerHTML = data;
}
// tab04 컴포넌트
async function loadTab04() {
  const response = await fetch('dayOff/tab04.html');

  if (!response.ok) throw new Error('tab04.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab04').innerHTML = data;
}

// tab05 컴포넌트
async function loadTab05() {
  const response = await fetch('dayOff/tab05.html');

  if (!response.ok) throw new Error('tab05.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab05').innerHTML = data;
}

// tab06 컴포넌트
async function loadTab06() {
  const response = await fetch('dayOff/tab06.html');

  if (!response.ok) throw new Error('tab06.html 로드 실패');

  const data = await response.text();
  document.getElementById('compTab06').innerHTML = data;
}

// 등록폼 컴포넌트
async function loadAddFrom() {
  const response = await fetch('./comp-request-day-off.html');

  if (!response.ok) throw new Error('comp-request-day-off.html 로드 실패');

  const data = await response.text();
  document.getElementById('compRequestDayOff').innerHTML = data;
}

function removeaddForm() {
  const addForm = document.querySelector('#compRequestDayOff');

  if (!addForm) return;

  addForm.style.display = 'none';
}

// 클릭 이벤트
document.addEventListener('click', async (event) => {
  // tr 클릭 시 active 클래스 추가
  const clickRow = event.target.closest('.tab_box table tbody tr');

  if (clickRow) {
    const rows = document.querySelectorAll('.tab_box table tbody tr');
    rows.forEach((row) => row.classList.remove('active'));
    clickRow.classList.add('active');

    return;
  }

  // btn_add_day_off 클릭 시 버튼 제어 등록폼 open
  const clickBtnAddDayOff = event.target.closest(
    '.tab_content_wrap .btn_add_day_off',
  );

  if (clickBtnAddDayOff) {
    const addForm = document.querySelector('#compRequestDayOff');
    const compTab = document.querySelector('#compTab');
    const tabContentWrap = document.querySelector('.tab_content_wrap');

    if (!addForm || !compTab || !tabContentWrap) return;

    compTab.style.display = 'none';
    tabContentWrap.style.display = 'none';
    addForm.style.display = '';

    return;
  }

  // btn_cancel 클릭 시 버튼 제어
  const clickBtnCancel = event.target.closest('.btn_cancel');

  if (clickBtnCancel) {
    const addForm = document.querySelector('#compRequestDayOff');
    const compTab = document.querySelector('#compTab');
    const tabContentWrap = document.querySelector('.tab_content_wrap');

    if (!addForm || !compTab || !tabContentWrap) return;

    compTab.style.display = '';
    tabContentWrap.style.display = '';
    removeaddForm();

    return;
  }
});
