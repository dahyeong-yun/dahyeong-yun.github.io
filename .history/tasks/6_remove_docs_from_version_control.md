# #6 내부 문서(.report/) 이동 및 Git 추적 제외

이 문서는 실서버 배포본과 소스코드 버전에 포함될 필요가 없는 개발 전용 내부 문서(`HANDOFF.md`, `MIGRATION_GUIDE.md`)를 `.report/` 폴더로 이관하고, Git 버전 관리 대상에서 공식적으로 제외하기 위한 작업 계획과 실행 내역입니다.

---

## 1. 계획 (Plan)
1. **파일 이관**:
   * 본체 저장소 루트에 있는 `HANDOFF.md` 및 `MIGRATION_GUIDE.md` 파일을 `.report/` 디렉토리 아래로 이동합니다.
2. **Git 추적 해제**:
   * `git rm --cached` 명령어를 사용해 두 문서의 Git 인덱스 추적 상태를 제거합니다.
   * `.gitignore`에 `.report/` 폴더가 정상 제외 처리되어 있으므로 폴더 이관 시 자동으로 추가 추적에서 배제됨을 확인합니다.
3. **아카이브 저장소 동기화**:
   * 로컬 백업용 저장소(`polymorlog-blog`)에도 동일한 파일 이관 및 Git 추적 해제 작업을 수행하여 구조 정합성을 동기화합니다.
4. **결과 검증 및 커밋**:
   * `git status`를 수행해 두 문서가 삭제 대기 상태(추적 해제) 및 `.report/` 내부가 Git 추적 대상에 포함되지 않는지 확인하고 본 문서(`6_remove_docs_from_version_control.md`)를 완성하여 함께 커밋 및 푸시합니다.

---

## 2. 실행 (Execution)
1. **파일 이관 완료**:
   * 본체 저장소와 아카이브 저장소 모두에서 `HANDOFF.md` 및 `MIGRATION_GUIDE.md` 파일을 `.report/` 디렉토리 하위로 안전히 이동시켰습니다.
2. **Git 인덱스 추적 해제**:
   * `git rm --cached HANDOFF.md MIGRATION_GUIDE.md` 명령을 통해 Git의 버전 추적 목록에서 제외 완료했습니다.
3. **제외 상태 검증**:
   * `git status` 검사 시 이전 경로의 파일들은 삭제 대기 상태(`deleted`)로 감지되고, `.report/` 폴더 하위로 이동한 파일들은 `.gitignore` 규칙에 의해 신규 추적 대상(`Untracked`)에 전혀 잡히지 않는 정상 차단 상태를 확인 완료했습니다.
