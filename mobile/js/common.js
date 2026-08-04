// HTML 문서의 DOM 구조가 전부 만들어진 뒤에 내부 코드 실행
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([loadSplash(), loadHeader(), loadNav(), loadTab()]);
  } catch (error) {
    console.error('공통 컴포넌트 로드 오류:', error);
  }
});

// 스플래시 컴포넌트 -------------------------------------------------------
async function loadSplash() {
  const target = document.getElementById('compSplash');

  if (!target) return;

  const response = await fetch('comp-splash.html');

  if (!response.ok) {
    throw new Error('comp-splash.html 로드 실패');
  }

  const data = await response.text();

  target.innerHTML = data;

  // 스플래시가 화면에 표시된 후 3초 뒤 페이드아웃
  setTimeout(() => {
    target.classList.add('is-hidden');

    // CSS transition이 끝난 뒤 DOM에서 제거
    target.addEventListener(
      'transitionend',
      () => {
        target.remove();
      },
      { once: true },
    );
  }, 1000);
}

// 헤더 컴포넌트 -------------------------------------------------------
async function loadHeader() {
  const target = document.getElementById('compHeader');

  if (!target) return;

  const response = await fetch('comp-header.html');

  if (!response.ok) throw new Error('comp-header.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;

  // data-title이 있으면 로고 이미지 대신 텍스트로 교체 + 설정 버튼 제거
  const title = target.dataset.title;

  if (title) {
    const h1 = target.querySelector('header h1');
    const button = target.querySelector('header button');

    if (h1)
      h1.innerHTML = `
      <button type="button" onclick="history.back()">
        <img src="./img/ico-back.svg" alt="뒤로가기 아이콘"/>
      </button>
      <p>${title}</p>
    `;

    if (button) button.remove();
  }
}

// 네이게이션 컴포넌트 -------------------------------------------------------
async function loadNav() {
  const target = document.getElementById('compNav');

  if (!target) return;

  const response = await fetch('comp-nav.html');

  if (!response.ok) throw new Error('comp-nav.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;

  // 리스트 컴포넌트가 들어간 후 데이터 로드
  await loadNavData();

  // 데이터 로드 후 active 처리
  await setActiveMenu();
}

// 페이지별 리스트 동적 데이터 로드
async function loadNavData() {
  const dataSrc = 'data/nav.json';

  const response = await fetch(dataSrc);

  if (!response.ok) throw new Error(`${dataSrc} 로드 실패`);

  const data = await response.json();

  if (!Array.isArray(data)) throw new Error(`${dataSrc}가 배열이 아닙니다.`);

  renderNav(data, '#compNav nav ul');
}

// 네비 내용 출력
function renderNav(menu, targetSelector = '#compNav nav ul') {
  const list = document.querySelector(targetSelector);

  if (!list) {
    console.error(`${targetSelector}를 찾을 수 없습니다.`);
    return;
  }

  list.innerHTML = '';

  menu.forEach((item) => {
    list.innerHTML += `
      <li>
        <a href="${item.href}">
          <span><img src="${item.icon}" alt="${item.menu} 아이콘" /></span>
          <p>${item.menu}</p>
        </a>
      </li>
    `;
  });
}

// 메뉴 페이지와 함께 active 처리할 하위 페이지 목록
const RELATED_PAGES = {
  'work.html': ['work.html', 'request-work.html', 'modify-work.html'],
  'approval.html': [
    'approval.html',
    'request-approval.html',
    'modify-approval.html',
  ],
};

// 현재 페이지에 맞는 메뉴 active 처리
function setActiveMenu() {
  const currentPage = window.location.pathname.split('/').pop();

  const menuItems = document.querySelectorAll('#compNav nav li');
  const menuLinks = document.querySelectorAll('#compNav nav a');

  menuItems.forEach((item) => {
    item.classList.remove('active');
  });

  menuLinks.forEach((link) => {
    const href = link.getAttribute('href');

    if (!href) return;

    const linkPage = href.split('/').pop();
    const menuItem = link.closest('li');

    if (!menuItem) return;

    const relatedPages = RELATED_PAGES[linkPage] || [linkPage];

    if (relatedPages.includes(currentPage)) {
      menuItem.classList.add('active');
      const img = menuItem.querySelector('img');

      if (img) {
        const src = img.getAttribute('src');

        if (src) {
          const activeSrc = src.replace(
            /(\.[^./?#]+)([?#].*)?$/,
            '-active$1$2',
          );

          img.setAttribute('src', activeSrc);
        }
      }
      return;
    }
  });
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

  if (!Array.isArray(data.tabs))
    throw new Error(`${dataSrc}의 tabs가 배열이 아닙니다.`);

  renderTab(compTab, data.tabs);
}

// 탭 버튼 출력
function renderTab(compTab, tabs) {
  const tabList = compTab.querySelector('.tab_list');

  if (!tabList) {
    console.error('comp-tab.html 내부에 .tab_list가 없습니다.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const currentTabId = urlParams.get('tab');

  let activeTabId = '';

  tabList.innerHTML = '';

  tabs.forEach((item, index) => {
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
        <button type="button" class="tab_btn flex">
          ${item.name}
          <span>${item.number}</span>
        </button>
      </li>
    `;
  });

  // URL tab 값이 잘못됐으면 첫 번째 탭 선택
  if (!activeTabId && tabs.length > 0) {
    activeTabId = String(tabs[0].id);

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
