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
}

// 네이게이션 컴포넌트 -------------------------------------------------------
async function loadNav() {
  const target = document.getElementById('compNav');

  if (!target) return;

  const response = await fetch('comp-nav.html');

  if (!response.ok) throw new Error('comp-nav.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;

  // 네이게이션 들어간 후 active 처리
  setActiveMenu();
}

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

    if (currentPage === linkPage) {
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

    if (
      currentPage.includes('request') &&
      menuItem.textContent.trim().includes('전자결재')
    ) {
      menuItem.classList.add('active');
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
