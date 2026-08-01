document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadMyPlan(),
      loadAllPlan(),
      loadOpenTalk(),
      loadDayOff(),
    ]);
  } catch (error) {
    console.error('컴포넌트 로드 오류:', error);
  }
});

// my 일정 컴포넌트
async function loadMyPlan() {
  const target = document.getElementById('compMyPlan');

  if (!target) return;

  const response = await fetch('home/comp-my-plan.html');

  if (!response.ok) throw new Error('comp-my-plan.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// 전체 일정 컴포넌트
async function loadAllPlan() {
  const target = document.getElementById('compAllPlan');

  if (!target) return;

  const response = await fetch('home/comp-all-plan.html');

  if (!response.ok) throw new Error('comp-all-plan.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// 공개 톡방 컴포넌트
async function loadOpenTalk() {
  const target = document.getElementById('compOpenTalk');

  if (!target) return;

  const response = await fetch('home/comp-open-talk.html');

  if (!response.ok) throw new Error('comp-open-talk.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// 연월차 컴포넌트
async function loadDayOff() {
  const target = document.getElementById('compDayOff');

  if (!target) return;

  const response = await fetch('home/comp-day-off.html');

  if (!response.ok) throw new Error('comp-day-off.html 로드 실패');

  const data = await response.text();

  target.innerHTML = data;
}

// 공통 클릭 이벤트 -------------------------------------------------------
document.addEventListener('click', (event) => {
  // 아코디언 (전체 일정, 공개 톡방 공통)
  const clickedDt = event.target.closest('.accordion > dt');

  if (clickedDt) {
    const dd = clickedDt.nextElementSibling;

    if (!dd) return;

    const isActive = clickedDt.classList.contains('active');

    if (isActive) {
      dd.style.maxHeight = '0px';
      clickedDt.classList.remove('active');
      dd.classList.remove('active');
    } else {
      clickedDt.classList.add('active');
      dd.classList.add('active');
      dd.style.maxHeight = `${dd.scrollHeight + 20}px`;
    }
  }
});
