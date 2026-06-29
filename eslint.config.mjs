import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";

const FrontendLayerDirs = ["./app/**/*", "./components/**/*"];
const ServiceLayerDirs = "./services/domains/**/actions.ts";
const RepositoryLayerDirs = "./services/domains/**/repository.ts";
const PersistenceLayerDirs = ["./services/prisma.ts", "./services/generated/prisma"];

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    languageOptions: {
      parser: tsParser,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      }
    },
    rules: {
      "import/no-restricted-paths": ["warn", {
        zones: [
          {
            "target": FrontendLayerDirs,
            "from": RepositoryLayerDirs,
            "message": "\n프론트엔드 계층에서 repository 계층을 직접 참조거나 의존해서는 안 된다."
          },
          {
            "target": FrontendLayerDirs,
            "from": PersistenceLayerDirs,
            "message": "\n프론트엔드 계층에서 영속성 계층을 직접 참조거나 의존해서는 안 된다."
          },
          {
            "target": ServiceLayerDirs,
            "from": PersistenceLayerDirs,
            "message": "\n서비스 계층에서 영속성 계층을 직접 참조거나 의존해서는 안 된다."
          }
        ]
      }]
    }
  },
];

export default eslintConfig;
