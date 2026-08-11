document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([loadWorkList(), loadPopupBizList()]);

    initBizPopup();
  } catch (error) {
    console.error('컴포넌트 로드 오류:', error);
  }
});

// 업무 리스트 컴포넌트
async function loadWorkList() {
  const targets = document.querySelectorAll('.tab_content[data-tab-content]');

  if (!targets.length) return;

  const response = await fetch('work/work-list.html');

  if (!response.ok) throw new Error('work-list.html 로드 실패');

  const template = await response.text();

  targets.forEach((target) => {
    target.innerHTML = template;
  });

  // 컴포넌트가 들어간 후 요일별 데이터 로드
  await loadWorkListData(targets);
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

// 탭별 업무 리스트 동적 데이터 로드
async function loadWorkListData(targets) {
  const response = await fetch('data/approval-conts.json');

  if (!response.ok) throw new Error('approval-conts.json 로드 실패');

  const data = await response.json();

  targets.forEach((target) => {
    const list = data[target.dataset.tabContent];

    if (!Array.isArray(list)) return;

    renderApprovalkList(target, list);
  });
}

// 기안서 종류별 제목/등록 링크
const APPROVAL_SECTIONS = [
  {
    type: 'equipment',
    title: '기자재 지급/회수 기안서',
    href: './request-equipment.html',
  },
  { type: 'loan', title: '대여금 대여 기안서', href: './request-loan.html' },
  {
    type: 'new-vendor',
    title: '신규 업체 기안서',
    href: './request-new-vendor.html',
  },
];

// 기안서 종류별 목록 섹션(제목 + 목록) 출력
function renderApprovalSection({ type, title, href }, list) {
  return `
    <div class="title_wrap flex">
      <h6 class="title flex">
        <span>
          <img src="./img/ico-doc.svg" alt="문서 아이콘" />
        </span>
        ${title}
      </h6>
      <div class="btn_box flex">
        <button
          type="button"
          class="btn_regist"
          onclick="location.href = '${href}'"
        >
          등록
        </button>
      </div>
    </div>
    <ul class="cont_list flex">
      ${list
        .filter((item) => item.type == type)
        .map(
          (item) => `
            <li class="cont_box flex" onClick="location.href = './detail-${item.type}.html'">
              <span class="chip ${item.chip}">${getChipLabel(item.chip)}</span>
              <p>${item.title}</p>
            </li>
          `,
        )
        .join('')}
    </ul>
  `;
}

// 업무 리스트 내용 출력
function renderApprovalkList(target, list) {
  const workCont = target.querySelector('.work_cont');

  if (!workCont) {
    console.error('comp-wrok-list.html 내부에 .work_cont가 없습니다.');
    return;
  }

  workCont.innerHTML = APPROVAL_SECTIONS.map((section) =>
    renderApprovalSection(section, list),
  ).join('');
}

// 공통 클릭 이벤트 -------------------------------------------------------
document.addEventListener('click', (event) => {
  // 업무 리스트 클릭
  const clickedLi = event.target.closest('.cont_list > li');

  if (clickedLi) {
    document
      .querySelectorAll('.cont_list li')
      .forEach((li) => li.classList.remove('active'));
    clickedLi.classList.add('active');
  }
});
