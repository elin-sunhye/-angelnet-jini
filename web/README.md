# WEB 컴포넌트 스타일 (/web/css/comp_style.css)

## comp-header

## comp-footer

## comp-sidebar

## comp-list(table)

## comp-tab

# 컴포넌트화가 어려운 항목 기본 레이아웃 스타일 (/web/css/common.css)

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

## 탭

<!-- 텝 컴포넌트 -->
<div id="compTab" data-tab-src=""></div>

<!-- 탭 내용 -->
<div class="tab_content_wrap">
  <div class="tab_content" data-tab-content="01"></div>
  <div class="tab_content" data-tab-content="02"></div>
</div>

<!-- 기안서 공통 -->
<td>
<!-- 기안서 등록 시 입력 위치 -->
  <div class="inp_box">
    <input type="text" name="ceo" title="대표자" />
  </div>
  <p></p> <!-- 기안서 읽기 전용 텍스트 위치 -->
</td>
