import type { OxfmtConfig } from 'oxfmt';

const config: OxfmtConfig = {
  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#arrowparens
   */
  arrowParens: 'always',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#bracketsameline
   */
  bracketSameLine: false,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#bracketspacing
   */
  bracketSpacing: true,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#embeddedlanguageformatting
   */
  embeddedLanguageFormatting: 'auto',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#endofline
   */
  endOfLine: 'lf',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#insertfinalnewline
   */
  insertFinalNewline: true,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#jsxsinglequote
   */
  jsxSingleQuote: false,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#objectwrap
   */
  objectWrap: 'preserve',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#printwidth
   */
  printWidth: 100,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#prosewrap
   */
  proseWrap: 'preserve',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#quoteprops
   */
  quoteProps: 'consistent',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#semi
   */
  semi: true,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#singleattributeperline
   */
  singleAttributePerLine: false,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#singlequote
   */
  singleQuote: true,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#sortimports
   */
  sortImports: {
    internalPattern: ['@/', '~/', '#'],
    newlinesBetween: false,
    order: 'asc',
    ignoreCase: false,
    sortSideEffects: false,
    groups: [
      'type-builtin',
      'value-builtin',
      'type-external',
      'value-external',
      'type-internal',
      'value-internal',
      'type-parent',
      'value-parent',
      'type-sibling',
      'value-sibling',
      'type-index',
      'value-index',
      'unknown',
    ],
  },

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#sortpackagejson
   */
  sortPackageJson: true,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#sorttailwindcss
   */
  sortTailwindcss: false,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#tabwidth
   */
  tabWidth: 2,

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#trailingcomma
   */
  trailingComma: 'all',

  /**
   * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference#usetabs
   */
  useTabs: false,
};

export default config;
