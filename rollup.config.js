import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import * as meta from "./package.json";

const config = {
  input: "src/index.js",
  external: Object.keys(meta.dependencies || {}).filter(key =>
    /^d3-/.test(key)
  ),
  output: {
    file: `dist/${meta.name}.js`,
    name: "d3",
    format: "umd",
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${
      meta.version
    } Copyright ${new Date().getFullYear()} ${meta.author.name}`,
    globals: Object.assign(
      {},
      ...Object.keys(meta.dependencies || {})
        .filter(key => /^d3-/.test(key))
        .map(key => ({ [key]: "d3" }))
    )
  },
  plugins: []
};

const moduleConfig = {
  ...config,
  output: {
    name: config.name,
    extend: config.extend,
    banner: config.banner,
    globals: config.globals
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**"
    })
  ]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  },
  {
    ...moduleConfig,
    ...{
      output: { format: "esm", dir: "dist/esm" }
    }
  },
  {
    ...moduleConfig,
    ...{
      output: { format: "cjs", dir: "dist/cjs" }
    }
  }
];
