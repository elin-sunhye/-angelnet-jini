// HTML 문서의 DOM 구조가 전부 만들어진 뒤에 내부 코드를 실행 -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 헤더 컴포넌트 로드
  loadHeader();

  // 푸터 컴포넌트 로드
  loadFooter();

  // 사이드바 컴포넌트 로드
  loadSidebar();

  // 내용 좌측 리스트 컴포넌트 로드
  loadLeftList();

  // 탭 컴포넌트 로드
  loadTab();
});
// -------------------------------------------------------

// 헤더 컴포넌트 -------------------------------------------------------
function loadHeader() {
  fetch('comp-header.html')
    .then((response) => response.text())
    .then((data) => (document.getElementById('compHeader').innerHTML = data));
}
// -------------------------------------------------------

// 푸터 컴포넌트 -------------------------------------------------------
function loadFooter() {
  fetch('comp-footer.html')
    .then((response) => response.text())
    .then((data) => (document.getElementById('compFooter').innerHTML = data));
}
// -------------------------------------------------------

// 사이드바 컴포넌트 -------------------------------------------------------
function loadSidebar() {
  fetch('comp-sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('compSidebar').innerHTML = data;

      // 사이드바가 들어간 후 active 처리
      setActiveMenu();

      // 사이드바가 들어간 후 캘린더 처리
      loadFullCalendar();
    });
}

// 현재 페이지에 맞는 사이드바 메뉴 active 처리
function setActiveMenu() {
  const currentPage = window.location.pathname.split('/').pop();

  const menuItems = document.querySelectorAll('#compSidebar nav li');
  const menuLinks = document.querySelectorAll('#compSidebar nav a');

  menuItems.forEach((li) => li.classList.remove('active'));

  menuLinks.forEach((a) => {
    const href = a.getAttribute('href');
    const linkPage = href.split('/').pop();

    if (currentPage == linkPage) a.closest('li').classList.add('active');
  });
}
// -------------------------------------------------------

// FullCalendar -------------------------------------------------------
// 캘린더 CND 로드
function loadFullCalendar() {
  const calendarEl = document.getElementById('calendar');

  // comp-sidebar.html 안에 #calendar가 없으면 실행 안 함
  if (!calendarEl) return;

  // 이미 FullCalendar가 로드되어 있으면 바로 캘린더 실행
  if (window.FullCalendar) {
    initCalendar();
    return;
  }

  const script = document.createElement('script');
  script.src =
    'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.21/index.global.min.js';
  script.onload = initCalendar;

  document.head.appendChild(script);
}

// 캘린더 실행
function initCalendar() {
  const calendarEl = document.getElementById('calendar');

  if (!calendarEl) return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'en',

    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,next',
    },

    titleFormat: {
      year: 'numeric',
      month: 'long',
    },

    dayHeaderFormat: {
      weekday: 'narrow',
    },

    fixedWeekCount: false,
    showNonCurrentDates: true,

    dayCellContent: function (arg) {
      return arg.date.getDate();
    },

    dayCellClassNames: function (arg) {
      const day = arg.date.getDay();

      if (day === 0) return ['is-sunday'];
      if (day === 6) return ['is-saturday'];

      return [];
    },

    dayHeaderClassNames: function (arg) {
      const day = arg.date.getDay();

      if (day === 0) return ['is-sunday'];
      if (day === 6) return ['is-saturday'];

      return [];
    },

    height: 'auto',
    contentHeight: 'auto',
    eventDisplay: 'none',
  });

  calendar.render();
}
// -------------------------------------------------------

// 리스트 컴포넌트 -------------------------------------------------------
function loadLeftList() {
  const compLeftList = document.getElementById('compLeftList');

  if (!compLeftList) return;

  fetch('comp-list.html')
    .then((response) => response.text())
    .then((data) => {
      compLeftList.innerHTML = data;

      // 리스트 컴포넌트가 들어간 후 동적 데이터 로드
      loadLeftListData();
    });
}

// 리스트 동적 데이터 로드
function loadLeftListData() {
  fetch('./data/employee-list.json')
    .then((response) => response.json())
    .then((data) => renderTable(data.columns, data.rows));
}

// 리스트 칩 클래스 추가
function getChipClass(value) {
  if (value == '연차') return 'day_off';
  if (value == '반차') return 'half_day_off';
  if (value == '외근') return 'out_of_office';

  return '';
}

// 리스트 내용 출력
function renderTable(columns, rows, targetSelector = '.list_table') {
  const table = document.querySelector(targetSelector);

  if (!table) return;

  const colgroup = table.querySelector('.list_colgroup');
  const header = table.querySelector('.list_header');
  const body = table.querySelector('.list_body');

  if (!colgroup || !header || !body) return;

  colgroup.innerHTML = '';
  header.innerHTML = '';
  body.innerHTML = '';

  const columnWidth = `${100 / columns.length}%`;

  columns.forEach((column) => {
    colgroup.innerHTML += `<col style="width: ${columnWidth}" />`;
    header.innerHTML += `<th>${column.label}</th>`;
  });

  rows.forEach((row) => {
    let tr = '<tr>';

    columns.forEach((column) => {
      const value = row[column.key] ?? '';
      const chipClass = getChipClass(value);

      if (chipClass !== '') {
        tr += `
          <td>
            <span class="chip ${chipClass}">${value}</span>
          </td>
        `;
      } else {
        tr += `<td>${value}</td>`;
      }
    });

    tr += '</tr>';

    body.innerHTML += tr;
  });

  // 최초 렌더링 시 첫 번째 tr active 처리
  const firstRow = body.querySelector('tr');

  if (firstRow) firstRow.classList.add('active');
}

// 좌측 리스트 tr active 처리
document.addEventListener('click', (event) => {
  const clickedRow = event.target.closest('#compLeftList tbody tr');

  if (!clickedRow) return;

  const rows = document.querySelectorAll('#compLeftList tbody tr');

  rows.forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});
// -------------------------------------------------------

// 탭 컴포넌트 -------------------------------------------------------
function loadTab() {
  const compTab = document.getElementById('compTab');

  if (!compTab) return;

  fetch('comp-tab.html')
    .then((response) => response.text())
    .then((data) => {
      compTab.innerHTML = data;

      // 탭 컴포넌트가 들어간 후 탭 데이터 로드
      loadTabData();
    });
}

// 탭 동적 데이터 로드
function loadTabData() {
  fetch('./data/work.json')
    .then((response) => response.json())
    .then((data) => {
      renderTab(data.menu);
    });
}

// 탭 버튼 출력
function renderTab(menu) {
  const tabList = document.querySelector('#compTab .tab_list');

  if (!tabList) return;

  const urlParams = new URLSearchParams(window.location.search);
  const currentTabId = urlParams.get('tab');

  tabList.innerHTML = '';

  let activeTabId = '';

  menu.forEach((item, index) => {
    const isActive = currentTabId ? item.id == currentTabId : index == 0;

    if (isActive) activeTabId = item.id;

    tabList.innerHTML += `
      <li class="${isActive ? 'active' : ''}" data-tab-id="${item.id}">
        <button type="button" class="tab_btn">${item.name}</button>
      </li>
    `;
  });

  // URL에 tab 파라미터가 없거나, 잘못된 tab 값이면 첫 번째 탭으로 처리
  if (!activeTabId && menu.length > 0) {
    activeTabId = menu[0].id;

    const firstTab = tabList.querySelector('li');

    if (firstTab) firstTab.classList.add('active');
  }

  // 처음 로드 시 탭 내용도 같이 처리
  setActiveTabContent(activeTabId);
}

// 탭 내용 display 처리
function setActiveTabContent(tabId) {
  const tabContents = document.querySelectorAll('[data-tab-content]');

  tabContents.forEach((content) => {
    if (content.dataset.tabContent == tabId) content.style.display = 'block';
    else content.style.display = 'none';
  });
}

// 탭 active 처리 + URL 파라미터 변경
document.addEventListener('click', (event) => {
  const clickedTab = event.target.closest('#compTab .tab_list li');

  if (!clickedTab) return;

  const tabId = clickedTab.dataset.tabId;

  if (!tabId) return;

  const tabItems = document.querySelectorAll('#compTab .tab_list li');

  tabItems.forEach((item) => item.classList.remove('active'));

  clickedTab.classList.add('active');

  // 탭 내용 변경
  setActiveTabContent(tabId);

  // URL 파라미터 변경
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tabId);

  window.history.pushState({}, '', url);
});
// -------------------------------------------------------

// 팝업 -------------------------------------------------------
// 업체 리스트 팝업 tr active 처리
document.addEventListener('click', (event) => {
  const clickedRow = event.target.closest('#compPopupBizList tbody tr');

  if (!clickedRow) return;

  const rows = document.querySelectorAll('#compPopupBizList tbody tr');

  rows.forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});
// -------------------------------------------------------
