document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([loadMyPlan()]);
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
