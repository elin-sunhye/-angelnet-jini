// HTML 문서의 DOM 구조가 전부 만들어진 뒤에 내부 코드 실행
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadHeader(),
      loadFooter(),
      loadSidebar(),
      loadLeftList(),
      loadTab(),
    ]);
  } catch (error) {
    console.error('공통 컴포넌트 로드 오류:', error);
  }
});

// 헤더 컴포넌트 -------------------------------------------------------
async function loadHeader() {
  const target = document.getElementById('compHeader');

  if (!target) return;

  const response = await fetch('comp-header.html');

  if (!response.ok) throw new Error('comp-header.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// 푸터 컴포넌트 -------------------------------------------------------
async function loadFooter() {
  const target = document.getElementById('compFooter');

  if (!target) return;

  const response = await fetch('comp-footer.html');

  if (!response.ok) throw new Error('comp-footer.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// 사이드바 컴포넌트 -------------------------------------------------------
async function loadSidebar() {
  const target = document.getElementById('compSidebar');

  if (!target) return;

  const response = await fetch('comp-sidebar.html');

  if (!response.ok) throw new Error('comp-sidebar.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;

  // 사이드바가 들어간 후 active 처리
  setActiveMenu();

  // 사이드바가 들어간 후 캘린더 처리
  loadFullCalendar();
}

// 현재 페이지에 맞는 사이드바 메뉴 active 처리
function setActiveMenu() {
  const currentPage = window.location.pathname.split('/').pop();

  const menuItems = document.querySelectorAll('#compSidebar nav li');
  const menuLinks = document.querySelectorAll('#compSidebar nav a');

  menuItems.forEach((item) => {
    item.classList.remove('active');
  });

  menuLinks.forEach((link) => {
    const href = link.getAttribute('href');

    if (!href) return;

    const linkPage = href.split('/').pop();
    const menuItem = link.closest('li');

    if (!menuItem) return;

    if (currentPage === linkPage) {
      menuItem.classList.add('active');
      return;
    }

    if (
      currentPage.includes('request') &&
      menuItem.textContent.trim().includes('전자결재')
    ) {
      menuItem.classList.add('active');
    }
  });
}

// FullCalendar -------------------------------------------------------
// FullCalendar CDN 로드
function loadFullCalendar() {
  const calendarEl = document.getElementById('calendar');

  // comp-sidebar.html 안에 #calendar가 없으면 실행 안 함
  if (!calendarEl) return;

  // 이미 FullCalendar가 로드되어 있으면 바로 실행
  if (window.FullCalendar) {
    initCalendar();
    return;
  }

  // 중복 로드 방지
  const existingScript = document.querySelector('script[data-full-calendar]');

  if (existingScript) return;

  const script = document.createElement('script');

  script.src =
    'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.21/index.global.min.js';

  script.dataset.fullCalendar = 'true';

  script.onload = initCalendar;

  script.onerror = () => console.error('FullCalendar CDN 로드 실패');

  document.head.appendChild(script);
}

// 캘린더 실행
function initCalendar() {
  const calendarEl = document.getElementById('calendar');

  if (!calendarEl || !window.FullCalendar) return;

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
    height: 'auto',
    contentHeight: 'auto',
    eventDisplay: 'none',

    dayCellContent(arg) {
      return arg.date.getDate();
    },

    dayCellClassNames(arg) {
      const day = arg.date.getDay();

      if (day === 0) return ['is-sunday'];
      if (day === 6) return ['is-saturday'];

      return [];
    },

    dayHeaderClassNames(arg) {
      const day = arg.date.getDay();

      if (day === 0) return ['is-sunday'];
      if (day === 6) return ['is-saturday'];

      return [];
    },
  });

  calendar.render();
}

// 리스트 컴포넌트 -------------------------------------------------------
async function loadLeftList() {
  const compLeftList = document.getElementById('compLeftList');

  if (!compLeftList) return;

  const response = await fetch('comp-list.html');

  if (!response.ok) throw new Error('comp-list.html 로드 실패');

  const data = await response.text();

  compLeftList.innerHTML = data;

  // 리스트 컴포넌트가 들어간 후 페이지별 데이터 로드
  await loadLeftListData(compLeftList);

  // 리스트 렌더링 완료 알림
  document.dispatchEvent(new CustomEvent('leftListLoaded'));
}

// 페이지별 리스트 동적 데이터 로드
async function loadLeftListData(compLeftList) {
  const dataSrc = compLeftList.dataset.listSrc;

  if (!dataSrc) {
    console.error('#compLeftList에 data-list-src가 없습니다.');
    return;
  }

  const response = await fetch(dataSrc);

  if (!response.ok) throw new Error(`${dataSrc} 로드 실패`);

  const data = await response.json();

  if (!Array.isArray(data.columns))
    throw new Error(`${dataSrc}의 columns가 배열이 아닙니다.`);

  if (!Array.isArray(data.rows))
    throw new Error(`${dataSrc}의 rows가 배열이 아닙니다.`);

  renderTable(data.columns, data.rows, '#compLeftList .list_table');
}

// 리스트 칩 클래스 추가
function getChipClass(value) {
  if (value === '연차') return 'day_off';
  if (value === '반차') return 'half_day_off';
  if (value === '외근') return 'out_of_office';

  return '';
}

// 리스트 내용 출력
function renderTable(
  columns,
  rows,
  targetSelector = '#compLeftList .list_table',
) {
  const table = document.querySelector(targetSelector);

  if (!table) {
    console.error(`${targetSelector}를 찾을 수 없습니다.`);
    return;
  }

  const colgroup = table.querySelector('.list_colgroup');
  const header = table.querySelector('.list_header');
  const body = table.querySelector('.list_body');

  if (!colgroup || !header || !body) {
    console.error('리스트 테이블 내부 요소를 찾을 수 없습니다.');
    return;
  }

  colgroup.innerHTML = '';
  header.innerHTML = '';
  body.innerHTML = '';

  // 첫 번째 컬럼은 50px 고정, 나머지는 자동 분할
  columns.forEach((column, index) => {
    if (index === 0) {
      colgroup.innerHTML += '<col style="width: 50px" />';
    } else {
      colgroup.innerHTML += '<col />';
    }

    header.innerHTML += `<th>${column.label}</th>`;
  });

  rows.forEach((row) => {
    let tr = '<tr>';

    columns.forEach((column) => {
      const value = row[column.key] ?? '';
      const chipClass = getChipClass(value);

      if (chipClass) {
        tr += `
          <td>
            <span class="chip ${chipClass}">
              ${value}
            </span>
          </td>
        `;
      } else {
        tr += `<td>${value}</td>`;
      }
    });

    tr += '</tr>';

    body.innerHTML += tr;
  });

  // 등록 페이지가 아닌 경우에만 첫 번째 행 active 처리
  const isRequestPage = window.location.pathname.includes('request-');

  if (!isRequestPage) {
    const firstRow = body.querySelector('tr');

    firstRow?.classList.add('active');
  }
}

// 탭 컴포넌트 -------------------------------------------------------
async function loadTab() {
  const compTab = document.getElementById('compTab');

  if (!compTab) return;

  const response = await fetch('comp-tab.html');

  if (!response.ok) {
    throw new Error('comp-tab.html 로드 실패');
  }

  const data = await response.text();

  compTab.innerHTML = data;

  // 탭 컴포넌트가 들어간 후 페이지별 데이터 로드
  await loadTabData(compTab);
}

// 페이지별 탭 동적 데이터 로드
async function loadTabData(compTab) {
  const dataSrc = compTab.dataset.tabSrc;

  if (!dataSrc) {
    console.error('#compTab에 data-tab-src가 없습니다.');
    return;
  }

  const response = await fetch(dataSrc);

  if (!response.ok) throw new Error(`${dataSrc} 로드 실패`);

  const data = await response.json();

  if (!Array.isArray(data.menu))
    throw new Error(`${dataSrc}의 menu가 배열이 아닙니다.`);

  renderTab(compTab, data.menu);
}

// 탭 버튼 출력
function renderTab(compTab, menu) {
  const tabList = compTab.querySelector('.tab_list');

  if (!tabList) {
    console.error('comp-tab.html 내부에 .tab_list가 없습니다.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const currentTabId = urlParams.get('tab');

  let activeTabId = '';

  tabList.innerHTML = '';

  menu.forEach((item, index) => {
    const itemId = String(item.id);

    const isActive = currentTabId
      ? itemId === String(currentTabId)
      : index === 0;

    if (isActive) {
      activeTabId = itemId;
    }

    tabList.innerHTML += `
      <li
        class="${isActive ? 'active' : ''}"
        data-tab-id="${itemId}"
      >
        <button type="button" class="tab_btn">
          ${item.name}
        </button>
      </li>
    `;
  });

  // URL tab 값이 잘못됐으면 첫 번째 탭 선택
  if (!activeTabId && menu.length > 0) {
    activeTabId = String(menu[0].id);

    const firstTab = tabList.querySelector('li');

    if (firstTab) firstTab.classList.add('active');
  }

  // 처음 로드 시 탭 내용도 처리
  setActiveTabContent(activeTabId);
}

// 탭 내용 display 처리
function setActiveTabContent(tabId) {
  const tabContents = document.querySelectorAll(
    '.tab_content[data-tab-content]',
  );

  tabContents.forEach((content) => {
    const contentTabId = String(content.dataset.tabContent);
    const isActive = contentTabId === String(tabId);

    content.style.display = isActive ? 'block' : 'none';
  });
}

// 탭 URL 파라미터 변경
function updateTabUrl(tabId) {
  const url = new URL(window.location.href);

  url.searchParams.set('tab', tabId);

  window.history.pushState({}, '', url);
}

// 공통 클릭 이벤트 -------------------------------------------------------
document.addEventListener('click', (event) => {
  // 좌측 리스트 tr active 처리
  const clickedLeftRow = event.target.closest('#compLeftList tbody tr');

  if (clickedLeftRow) {
    const clickData =
      clickedLeftRow.querySelector('td:nth-child(2)')?.textContent.trim() ?? '';

    const rows = document.querySelectorAll('#compLeftList tbody tr');

    rows.forEach((row) => row.classList.remove('active'));
    clickedLeftRow.classList.add('active');

    const addButton = document.querySelector('.btn_add_doc');

    if (addButton) {
      addButton.onclick = () => {
        if (clickData.includes('대여금')) {
          location.href = './request-loan.html';
        } else if (clickData.includes('신규')) {
          location.href = './request-new-vendor.html';
        } else {
          location.href = './request-equipment.html';
        }
      };
    }

    return;
  }

  // 탭 active 처리
  const clickedTab = event.target.closest('#compTab .tab_list li[data-tab-id]');

  if (clickedTab) {
    const tabId = clickedTab.dataset.tabId;

    if (!tabId) return;

    const tabItems = document.querySelectorAll('#compTab .tab_list li');

    tabItems.forEach((item) => item.classList.remove('active'));
    clickedTab.classList.add('active');

    setActiveTabContent(tabId);
    updateTabUrl(tabId);

    return;
  }

  // 업체 리스트 팝업 tr active 처리
  const clickedPopupRow = event.target.closest('#compPopupBizList tbody tr');

  if (clickedPopupRow) {
    const rows = document.querySelectorAll('#compPopupBizList tbody tr');

    rows.forEach((row) => row.classList.remove('active'));
    clickedPopupRow.classList.add('active');
  }
});
