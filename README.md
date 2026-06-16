# 편의점 보충진열 체크리스트

편의점 매대 보충진열 업무를 돕는 **모바일 웹 체크리스트** 앱입니다.  
AI 없이 직접 상품을 입력하고, 보충할 때마다 체크합니다.

## 기능

- 상품명·카테고리·메모·우선순위 입력
- 보충진열 체크리스트 (체크/삭제)
- 진행률 표시 (완료 %)
- 브라우저에 자동 저장 (새로고침해도 유지)

## 사전 준비

[Node.js LTS](https://nodejs.org) 설치 후 PowerShell에서 확인:

```powershell
node -v
npm -v
```

## 실행 방법

### 1. 프로젝트 폴더로 이동

```powershell
cd C:\Users\gkskf\Projects\shelf-restock-app
```

### 2. 패키지 설치 (처음 한 번)

```powershell
npm install
```

### 3. 개발 서버 실행

```powershell
npm run dev
```

브라우저에서 **http://localhost:3000** 접속

> `npm`은 **Cursor 터미널**(Ctrl + `)에서 실행하세요. 브라우저 F12 콘솔이 아닙니다.

## 사용 방법

1. **항목 추가** — 보충이 필요한 상품 정보 입력
2. **체크리스트** — 보충 완료 시 체크
3. **완료 삭제** — 체크한 항목 일괄 제거
4. **전체 삭제** — 목록 초기화

## 프로젝트 구조

```
shelf-restock-app/
├── app/
│   ├── page.tsx           # 메인 화면
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ItemForm.tsx       # 항목 추가 폼
│   └── RestockChecklist.tsx
└── lib/
    ├── types.ts
    └── storage.ts         # localStorage 저장
```

## 빌드 (배포용)

```powershell
npm run build
npm start
```
