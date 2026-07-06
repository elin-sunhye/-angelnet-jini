# 컴포넌트화 (comp_style.css)

## comp-header

## comp-footer

## comp-sidebar

## comp-list(table)

## comp-tab

# 컴포넌트화가 어려운 항목 기본 레이아웃 (common.css)

## 인풋

#### 내부 버튼은 필요없을 시 제거 가능

<div class="inp_box">
  <input type="text" name="bizNm" title="업체명" />
  <button type="button" class="btn_search" aria-label="검색">
    <img src="./img/ico-search.svg" alt="" />
  </button>
</div>

## 셀렉트 박스

<div class="select_box">
  <select name="category" title="구분 선택">
    <option value="1" selected>방문</option>
    <option value="2">상담</option>
  </select>
</div>

## 팝업

#### - popup\_ 으로 시작하는 클래스명을 사용한다.

#### - 공통 구조: 상단 제목 영역 / 본문 영역 / 하단 버튼 영역

<div class="popup_클래스명">
 <div class="inner_box">
  <!-- 상단 제목 영역 -->
  <div class="pop_top_title flex">
    <h6>팝업 제목</h6>
    <button type="button" class="btn_close" aria-label="팝업 닫기">
      <img src="./img/ico-close.svg" alt="" />
    </button>
  </div>

  <!-- 본문 영역 -->
  <div class="pop_cont">
    팝업 내용
  </div>

  <!-- 하단 버튼 영역 -->
  <div class="pop_bottom_btn flex">
    <button type="button" class="btn_select">선택</button>
    <button type="button" class="btn_confirm">확인</button>
    <button type="button" class="btn_approve">승인</button>
    <button type="button" class="btn_reject">반려</button>
    <button type="button" class="btn_hold">보류</button>
  </div>
 </div>
</div>
