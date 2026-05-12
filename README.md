# Real Grass GitHub Contributions

GitHub README에 넣을 수 있는 2D 잔디형 contribution calendar SVG generator입니다.

기여가 없는 날은 갈색 흙으로 보이고, 기여가 많을수록 해당 날짜 타일에 잔디가 더 많이 자랍니다. README에서는 JavaScript가 실행되지 않기 때문에, 이 프로젝트는 TypeScript API가 SVG 이미지를 직접 만들어 응답하는 방식으로 동작합니다.

## README 사용 예시

배포 후 아래처럼 README에 넣으면 됩니다.

```md
![Real Grass](https://your-deployment.example.com/api/grass?username=YOUR_GITHUB_USERNAME)
```

연도와 범례 표시 여부도 조정할 수 있습니다.

```md
![Real Grass](https://your-deployment.example.com/api/grass?username=YOUR_GITHUB_USERNAME&year=2026&legend=false)
```

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 아래 주소를 열어 확인합니다.

```txt
http://127.0.0.1:4173/api/grass?username=octocat
```

## 배포

Vercel에 올리면 `api/grass.ts`가 서버리스 함수로 동작합니다. 배포 주소만 README 이미지 URL에 넣으면 다른 사람도 자신의 GitHub 사용자명만 바꿔 사용할 수 있습니다.

## 구조

- `api/grass.ts` - README에서 호출할 SVG API 엔드포인트
- `src/handler.ts` - query parsing과 응답 생성
- `src/contributions.ts` - GitHub contribution 데이터 로딩과 정규화
- `src/svg.ts` - 2D 흙/잔디 SVG 렌더링
- `src/server.ts` - 로컬 미리보기 서버
