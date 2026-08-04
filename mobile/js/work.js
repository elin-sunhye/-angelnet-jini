document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadWorkList();
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

// 탭별 업무 리스트 동적 데이터 로드
async function loadWorkListData(targets) {
  const response = await fetch('data/work-conts.json');

  if (!response.ok) throw new Error('work-conts.json 로드 실패');

  const data = await response.json();

  targets.forEach((target) => {
    const list = data[target.dataset.tabContent];

    if (!Array.isArray(list)) return;

    renderWorkList(target, list);
  });
}

// 업무 리스트 내용 출력
function renderWorkList(target, list) {
  const workCont = target.querySelector('.work_cont');

  if (!workCont) {
    console.error('comp-wrok-list.html 내부에 .work_cont가 없습니다.');
    return;
  }

  workCont.innerHTML = `
    <ul class="cont_list flex">
      ${list
        .map(
          (item) => `
        <li class="cont_box flex">
          <div class="flex">
            <span class="time">${item.time}</span>
            <p>${item.title}</p>
            <span class="chip${item.chip == '방문' ? ' visit' : item.chip == '상담' ? ' consulting' : ''}">${item.chip}</span>
          </div>
          <div class="flex">
            <span class="time time_bar flex"></span>
            <p class="flex">
              <span>
                <img src="./img/ico-location.svg" alt="주소 아이콘" />
                <img src="./img/ico-location-w.svg" alt="주소 아이콘" />
              </span>
              ${item.addr}
            </p>
          </div>
        </li>
      `,
        )
        .join('')}
    </ul>
  `;
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
