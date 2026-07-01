// 헤더 컴포넌트 로드
document.addEventListener('DOMContentLoaded', () => {
  fetch('comp-header.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('compHeader').innerHTML = data;
    });
});

// 푸터 컴포넌트 로드
document.addEventListener('DOMContentLoaded', () => {
  fetch('comp-footer.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('compFooter').innerHTML = data;
    });
});

// 사이드바 컴포넌트 로드
document.addEventListener('DOMContentLoaded', () => {
  fetch('comp-sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('compSidebar').innerHTML = data;
    });
});

// 현재 페이지에 맞는 사이드바 메뉴 active 처리
function setActiveMenu() {
  const currentPage = window.location.pathname.split('/').pop();

  const menuItems = document.querySelectorAll('#compSidebar nav li');
  const menuLinks = document.querySelectorAll('#compSidebar nav a');

  menuItems.forEach((li) => {
    li.classList.remove('active');
  });

  menuLinks.forEach((a) => {
    const href = a.getAttribute('href');
    const linkPage = href.split('/').pop();

    if (currentPage === linkPage) {
      a.closest('li').classList.add('active');
    }
  });
}
