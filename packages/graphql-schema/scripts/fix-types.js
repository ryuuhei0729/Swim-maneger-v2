#!/usr/bin/env node

/**
 * GraphQL型定義の自動修正スクリプト
 * 生成された型定義ファイルの既知の問題を自動修正
 */

const fs = require('fs');
const path = require('path');

const TYPES_FILE_PATH = path.join(__dirname, '../generated/types.ts');

function fixTypesFile() {
  console.log('🔧 GraphQL型定義ファイルを修正中...');
  
  if (!fs.existsSync(TYPES_FILE_PATH)) {
    console.error('❌ 型定義ファイルが見つかりません:', TYPES_FILE_PATH);
    process.exit(1);
  }

  let content = fs.readFileSync(TYPES_FILE_PATH, 'utf8');
  
  // 修正前の内容をバックアップ
  const backupPath = TYPES_FILE_PATH + '.backup';
  fs.writeFileSync(backupPath, content);
  console.log('📋 バックアップを作成:', backupPath);

  // 修正1: GraphQLインポートの型エラーを修正
  if (content.includes("import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';")) {
    content = content.replace(
      "import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';",
      "// @ts-ignore\nimport { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'"
    );
    console.log('✅ GraphQLインポートの型エラーを修正');
  }

  // 修正2: Record型の競合を修正
  if (content.includes('Record<string, any>')) {
    content = content.replace(/Record<string, any>/g, '{ [key: string]: any }');
    console.log('✅ Record型の競合を修正');
  }

  // 修正3: セミコロンの統一
  content = content.replace(/from 'graphql';/g, "from 'graphql'");
  console.log('✅ セミコロンを統一');

  // 修正4: 不要な空行を削除
  content = content.replace(/\n\n\n+/g, '\n\n');
  console.log('✅ 不要な空行を削除');

  // 修正された内容を書き込み
  fs.writeFileSync(TYPES_FILE_PATH, content);
  console.log('✅ 型定義ファイルを修正完了');
  
  // バックアップファイルを削除
  fs.unlinkSync(backupPath);
  console.log('🗑️ バックアップファイルを削除');
}

function main() {
  try {
    fixTypesFile();
    console.log('🎉 型定義の修正が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixTypesFile };
