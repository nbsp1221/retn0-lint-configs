# 의존성 업그레이드 실험 및 검토

검토 기준 시각은 **2026-10-09 04:08:57 KST**이다. 시작 커밋은 `daf2893`이며, 원본 `main` 작업 트리를 보존하고 `codex/trusted-dependency-upgrade`의 별도 작업 트리에서 실험했다. anti-slop 도입은 이번 변경에 포함하지 않았다.

## 결론

배포 후 **7일(10,080분)** 이상 지난 정식 릴리스 가운데 피어 의존성을 만족하는 최신 조합으로 업그레이드할 수 있다. TypeScript는 최신 정식 버전 7.0.2 대신 **6.0.3**을 유지해야 한다. 최신 허용 `typescript-eslint@8.71.0`의 피어 범위가 `>=4.8.4 <6.1.0`이기 때문이다.

이 결과는 모든 패키지를 npm의 `latest` 태그로 설치한 결과가 아니다. 릴리스 경과 시간, 호환성, 공개 보안 공지, 레지스트리 서명과 publication trust 정보를 확인한 결과이다. 검토 시점 이후의 릴리스에는 이 결론을 그대로 적용할 수 없다.

## 최종 버전

- `@changesets/changelog-github`: 0.7.0 → **1.0.1**.
- `@changesets/cli`: 2.31.0 → **3.0.3**.
- `@types/node`: 26.0.0 → **26.6.3**.
- `@types/react`: 19.2.17 → **19.3.0**.
- `eslint`: 10.5.0 → **10.11.0**.
- `oxfmt`: 0.56.0 → **0.71.0**.
- `oxlint`: 1.71.0 → **1.86.0**.
- `oxlint-tsgolint`: 0.23.0 → **7.0.2003**.
- `tsdown`: 0.22.3 → **0.23.0**.
- `typescript`: 6.0.3 → **6.0.3** (유지).
- `vitest`: 4.1.9 → **5.0.3**.
- `eslint-plugin-oxlint`: 1.71.0 → **1.86.0**.
- `es-toolkit`: 1.49.0 → **1.52.0**.
- `@eslint-react/eslint-plugin`: 5.9.1 → **5.23.3**.
- `@eslint/js`: 10.0.1 → **10.0.1** (유지).
- `eslint-plugin-perfectionist`: 5.9.1 → **5.12.1**.
- `eslint-plugin-react-hooks`: 7.1.1 → **7.1.1** (유지).
- `globals`: 17.6.0 → **17.13.0**.
- `typescript-eslint`: 8.61.1 → **8.71.0**.
- `pnpm`: 10.34.3 → **12.8.2**.

`@eslint/js`와 `eslint-plugin-react-hooks`는 이미 최신 정식 릴리스였으므로 유지했다. 나머지 보류된 `latest` 버전은 아래에 이유를 기록했다.

## 최신 버전을 보류한 이유

- **TypeScript 7.0.2**: 엄격한 피어 검사로 실제 설치 실패를 재현했다. `typescript-eslint`, parser, plugin, utils, project-service 등 8개 패키지가 `<6.1.0`을 요구했다. 피어 검사를 끄거나 지원 범위를 강제로 덮어쓰지 않았다.
- **ESLint 10.12.0**: 2026-10-03 05:08 KST 배포로, 기준 시각에 7일이 지나지 않았다. 10.11.0을 선택했다.
- **Oxlint / eslint-plugin-oxlint 1.87.0, Oxfmt 0.72.0**: 2026-10-05 배포로 유예 기간 중이었다. 각각 1.86.0, 1.86.0, 0.71.0을 선택했다.
- **typescript-eslint 8.71.1**: 2026-10-06 02:08 KST 배포로 유예 기간 중이었다. 8.71.0을 선택했다.
- **@eslint-react/eslint-plugin 5.24.9**: 2026-10-08 19:58 KST 배포로 유예 기간 중이었다. 7일 기준을 만족하는 가장 높은 버전은 5.23.3이었다.
- **@types/node 26.6.4**: 2026-10-02 07:39 KST 배포로, 기준 시각에 정확히 7일이 지나지 않았다. 26.6.3을 선택했다.
- **pnpm 12.10.1**: 2026-10-07 02:35 KST 배포로 유예 기간 중이었다. 12.8.2를 선택했다.

배포 시각은 npm registry의 `time[version]`을 사용했다. 날짜만 비교하지 않고 UTC 타임스탬프 간 차이가 604,800초 이상인지 확인했다. 직접 의존성의 prerelease와 deprecated 버전은 후보에서 제외했다. 전이 의존성에는 상위 패키지가 요구하는 오래된 prerelease가 포함될 수 있으며, 전이 의존성 전체에도 동일한 7일 기준을 확인했다.

## 피어 의존성 및 런타임 변경

- `@retn0/eslint-config`는 전이 의존성에 이미 존재하던 TypeScript 범위 `>=4.8.4 <6.1.0`을 명시적인 피어 의존성으로 표시한다. 실제로 검증한 TypeScript는 6.0.3이며, 이 범위의 모든 과거 버전을 검사한 것은 아니다.
- `@retn0/oxlint-config`의 Oxlint 범위는 `^1.86.0`, oxlint-tsgolint 범위는 `>=7.0.2003 <7.1.0`이다. Oxlint 1.86.0 자체의 피어 요구사항도 oxlint-tsgolint 7.0.2003 이상으로 바뀌었다.
- `@retn0/eslint-config-oxlint`는 `eslint-plugin-oxlint@1.86.0`의 피어 요구사항에 맞춰 Oxlint를 **1.86.x**로 제한한다. 기본 Oxlint 프리셋의 범위와 구분해야 한다.
- `@retn0/oxfmt-config`의 Oxfmt 범위는 **0.71.x**이다.
- 저장소 개발 환경의 Node 범위는 `^24.11.0 || >=26.0.0`이다. tsdown 0.23.0의 요구사항에 맞췄으며, 25.x는 개발 도구의 지원 범위에 포함되지 않는다.
- 공개 프리셋의 Node 최소 버전 **24.0.0**은 유지했고, 압축 패키지를 설치한 별도 소비자 환경에서 실제로 검사했다.

피어 범위 변경에 대한 Changeset을 추가했다. 다음 정상 릴리스 계획은 ESLint 설정 **2.0.1**, ESLint/Oxlint 호환 설정 **1.0.0**, Oxfmt 설정 **0.2.0**, Oxlint 설정 **3.0.0**이다. 이 검토에서는 버전 태그나 패키지를 실제로 배포하지 않았다.

## 공급망 검토

잠금 파일에 있는 **358개 외부 패키지·버전 조합**을 확인했다. 여기에는 다른 플랫폼의 optional native 패키지와 pnpm 도구 패키지도 포함된다.

- **358/358**의 배포 시간이 7일 기준을 만족했다.
- **358/358**의 잠금 파일 integrity가 npm registry 메타데이터와 일치했다.
- npm registry 공개 키로 **358/358**의 패키지 서명을 암호학적으로 검증했다. 이는 registry가 해당 integrity를 서명했다는 뜻이며, 패키지 소스가 안전하다는 증명은 아니다.
- provenance 정보는 **228/358**, trusted publisher 정보는 **225/358**에서 확인했다. 이 두 수치는 메타데이터의 존재를 확인한 수치이고, Sigstore provenance 번들의 전체 검증 수치가 아니다.
- 기존 잠금 파일에는 **14개 패키지**, **27개 고유 보안 공지**, **30개 버전·공지 조합**이 매칭됐다. 조합 기준으로 critical 2, high 19, moderate 8, low 1이었다.
- 최종 잠금 파일에 대한 npm 공개 보안 공지 bulk API 응답은 **빈 객체**, 알려진 공지 매칭 **0개**였다.

기존 공지에는 [Tinypool의 조건부 prototype-pollution 경로](https://github.com/advisories/GHSA-85c8-ppgw-ccpr)와 [Vitest mocker의 파일 접근 문제](https://github.com/advisories/GHSA-82fw-gwwq-j7x9)가 포함된다. 이 수치는 의존성 버전의 공지 매칭 수치이며, 이 저장소에서 공격 경로가 실제로 노출돼 있거나 악용됐다는 뜻은 아니다. 업그레이드는 알려진 취약 버전을 제거하지만 알려지지 않은 공급망 공격까지 보장하지 않는다.

워크스페이스에는 다음 정책을 설정했다.

```yaml
saveExact: true
minimumReleaseAge: 10080
minimumReleaseAgeStrict: true
minimumReleaseAgeIgnoreMissingTime: false
trustPolicy: no-downgrade
trustPolicyExclude:
  - semver@6.3.1
strictPeerDependencies: true
strictDepBuilds: true
```

정확한 버전 저장, 전이 의존성까지 적용되는 배포 유예, 배포 시각이 없는 메타데이터의 거부, publication trust 하락 검사, 피어 충돌 및 미검토 install/build script 거부를 적용했다. pnpm 12 설정에 맞춰 기존 `.npmrc`의 `save-exact=true`는 `pnpm-workspace.yaml`로 옮겼다. 긴급 보안 패치도 유예 정책의 영향을 받으므로, 긴급 업데이트에는 검토 후 정확한 버전에 한정된 예외가 필요할 수 있다.

### semver@6.3.1 예외

예외 없이 새 잠금 파일을 생성해도 pnpm의 trust 정책이 `semver@6.3.1`을 차단했다. Babel 계열 의존성은 여전히 6.x를 요구한다. 이 버전은 **2023-07-10**의 공식 backport이며, 그보다 앞서 provenance를 제공한 7.5.x 릴리스와 비교돼 publication trust 하락으로 판단된다.

공식 [6.3.1 릴리스](https://github.com/npm/node-semver/releases/tag/v6.3.1), npm 배포 시각, repository, 고정 integrity, registry 서명, 공개 보안 공지 응답을 확인했다. 이 버전의 알려진 공지 매칭은 0개였다. 7.x로 강제 덮어써서 상위 패키지의 요구 범위를 위반하거나 trust 정책 전체를 끄는 대신 **semver@6.3.1 한 버전만** 예외로 지정했다. 서명·무결성 검증과 7일 기준에서는 제외하지 않았다.

### Deprecated 전이 의존성

설치 시 **24개 deprecated 플랫폼 패키지** 경고가 남는다. tsdown의 선언 파일 생성 의존성인 `rolldown-plugin-dts`가 사용하는 Yuku 0.10.2의 codegen/parser native bindings다. 상위 프로젝트가 0.14 이후 codegen을 JavaScript로, parser를 yuku-core 기반으로 바꾸면서 이전 native 패키지를 deprecated로 표시했다.

이 경고는 남겨두었으며, 상위 패키지의 `^0.10.1` 범위를 무시하고 최신 Yuku로 강제 교체하지 않았다. 검토한 버전에는 알려진 보안 공지 매칭이 없었다. 상위 선언 파일 플러그인이 의존성을 전환하면 다시 점검해야 한다.

## GitHub Actions 변경

7일 기준을 만족하는 공식 릴리스를 확인하고 mutable 태그 대신 전체 커밋 SHA로 고정했다.

- `actions/checkout`: [v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), `3d3c42e5aac5ba805825da76410c181273ba90b1`.
- `actions/setup-node`: [v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0), `820762786026740c76f36085b0efc47a31fe5020`.
- `pnpm/action-setup`: [v6.1.0](https://github.com/pnpm/action-setup/releases/tag/v6.1.0), `ea17c68df8912ef543352723c149a84f56e3d413`. 이 릴리스는 pnpm 12 지원을 추가한다.
- `changesets/action`: [v2.1.2](https://github.com/changesets/action/releases/tag/v2.1.2), `ae32849d5ba541f9ae29e40e22a623bc13562f51`.

Changesets action 2의 입력 이름 변경에 따라 `commit`, `publish`, `title`, `version`을 각각 `commit-message`, `publish-script`, `pr-title`, `version-script`로 바꿨다. [2.0 마이그레이션 안내](https://github.com/changesets/action/releases/tag/v2.0.0)를 확인했다. GitHub token은 기존의 명시적 입력을 유지한다.

세 action의 후보 커밋은 GitHub API에서 verified 서명을 확인했다. Changesets action v2.1.2의 커밋은 verified가 아니었으며, 공식 repository의 immutable release와 tag의 커밋을 확인하고 SHA로 고정했다. 커밋 SHA 고정은 실행 대상이 바뀌는 것을 방지하며, 소스의 안전성을 증명하는 것은 아니다.

## 실제 실험 결과

1. **원래 상태**: 이전 검토에서 `pnpm check`와 12개 테스트 파일의 28개 테스트가 통과했다.
2. **TypeScript 7 후보**: `pnpm install --lockfile-only --ignore-scripts`가 피어 충돌로 실패했다. 최종 TypeScript 6.0.3 조합은 엄격한 피어 검사로 설치됐다.
3. **업그레이드 전체 검사**: build, TypeScript 검사, Oxlint와 ESLint, Oxfmt, 12개 파일의 28개 테스트가 통과했다. 테스트 fixture와 기대 diagnostics를 수정하지 않았다.
4. **개발 최소 환경**: 별도로 받은 공식 Node.js **24.11.0** 바이너리의 SHA256을 공식 SHASUMS256.txt와 대조하고 같은 전체 검사를 실행했다.
5. **잠금 파일 재설치**: install scripts를 무시하지 않는 `pnpm install --frozen-lockfile`도 피어 충돌과 미검토 build-script 오류 없이 통과했다. Linux 설치에서 필요한 의존성 install scripts는 없었다.
6. **공개 패키지 소비자**: 4개 공개 패키지를 `pnpm pack`으로 만들고 별도 프로젝트에 tarball로 설치했다. 워크스페이스 symlink에 의존하지 않고 Node.js **24.0.0**에서 factory import, 타입 검사, lint, format 검사를 통과했다.
7. **중복 검사 방지**: 소비자 fixture에서 Oxlint의 `eqeqeq`, `no-explicit-any`, `no-unsafe-call` 진단과 ESLint 전용 `no-unreachable-loop` 진단을 확인했다. ESLint의 중복 `eqeqeq` 진단은 없었다.
8. **Changesets 3**: `changeset status --since=main`으로 위 릴리스 계획을 확인했다. 별도 Git 복사본에서 `pnpm changeset:version --snapshot dependency-review`를 실행해 4개 공개 패키지의 snapshot 버전과 changelog 생성, Oxfmt 처리가 성공했다.
9. **설정 비교**: JS, TS, TSX에 대한 ESLint 유효 규칙 이름의 추가·제거는 없었다. 두 규칙에 업스트림의 기본 옵션 표시가 추가됐다. `no-constant-binary-expression`에는 `checkRelationalComparisons: false`, `preserve-caught-error`에는 `errorClassNames: []`가 나타났다. 명시적인 Oxlint 설정은 이전 결과와 같았다.

실험 과정에서 소비자와 릴리스 시뮬레이션 프로젝트를 일회용 디렉터리에 만들었다. 릴리스 시뮬레이션은 독립적인 node_modules로 설치했다. 기존 테스트는 root node_modules symlink를 사용하는 구조이므로 tarball 소비자 실험으로 배포 경로를 별도로 검증했다.

최종 manifest와 문서 변경 뒤 frozen install, 전체 검사, tarball 소비자 검증을 다시 확인했다. GitHub 호스팅 runner와 실제 npm publish는 실행하지 않았다. 워크플로의 입력과 action runtime은 정적으로 확인했고, release의 로컬 version 단계까지 실험했다.

## 이후 anti-slop 도입에 미치는 영향

업그레이드 이후에는 Oxlint 1.86.0을 기준으로 `@oxlint/plugins`도 **1.86.0**에 맞춰 별도로 검토할 수 있다. 이전 검토의 Oxlint 1.71.0 타입 API 문제를 현재 후보에 그대로 적용해서는 안 된다. 이번 작업은 도구 유지보수까지이며 anti-slop 소스, 플러그인 의존성, 프리셋은 추가하지 않았다.

## 검토의 한계와 재현

7일 유예, 서명, provenance 정보, 공개 취약점 검사는 알려지지 않은 악성 코드나 유지보수 계정 침해를 완전히 배제하지 못한다. Linux x64에서 실행했으며 다른 플랫폼의 optional 패키지는 메타데이터·무결성·서명만 확인했다. 현재 결과는 상위 도구의 모든 규칙 동작이나 모든 소비자 코드에 대한 무오류 보장이 아니다.

재현할 기본 명령은 다음과 같다.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm changeset status --since=main
pnpm -r --filter '!@retn0/config-policy' --filter '!retn0-lint-configs' pack --pack-destination=/tmp/retn0-packages
```

원시 실험 로그와 metadata snapshot은 로컬 `/tmp/retn0-dependency-upgrade/`에 보관했다. 영구적인 검토 근거는 이 문서와 커밋의 manifest, workspace 정책, lockfile이다.

배포 유예 및 trust 정책의 동작은 [pnpm dependency resolution 설정](https://pnpm.io/settings/dependency-resolution), install/build script 정책은 [pnpm build 설정](https://pnpm.io/settings/build)을 참조했다.
