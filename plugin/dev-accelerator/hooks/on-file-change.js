/**
 * On File Change Hook
 *
 * This hook runs when files are modified during a Claude Code session. (Claude Code modifies files)
 * Use it to automatically run checks, update related files, or provide feedback.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async (context) => {
  const { files, operation } = context;

  const notifications = [];
  const warnings = [];
  const errors = [];

  // Process each changed file
  for (const file of files) {
    const { filePath, changeType } = file;

    // Get file extension
    const ext = path.extname(filePath);

    // Run language-specific checks
    try {
      // JavaScript/TypeScript files
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        await checkJavaScript(filePath, notifications, warnings, errors);
      }

      // Python files
      if (['.py'].includes(ext)) {
        await checkPython(filePath, notifications, warnings, errors);
      }

      // Test files
      if (isTestFile(filePath)) {
        notifications.push(`✅ Test file ${path.basename(filePath)} modified`);
      }

      // Check if corresponding test file exists
      if (!isTestFile(filePath) && isSourceFile(filePath)) {
        const testFilePath = getTestFilePath(filePath);
        if (!fs.existsSync(testFilePath)) {
          warnings.push(`⚠️  No test file found for ${path.basename(filePath)}. Consider creating ${path.basename(testFilePath)}`);
        }
      }

      // Check file size
      if (fs.existsSync(filePath)) {
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n').length;

        if (lines > 600) {
          warnings.push(`⚠️  ${path.basename(filePath)} is ${lines} lines. Consider breaking into smaller modules.`);
        }
      }

    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  // Log changes
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    operation,
    filesChanged: files.length,
    notifications: notifications.length,
    warnings: warnings.length,
    errors: errors.length,
  }));

  // Return feedback to user
  return {
    notifications: notifications.length > 0 ? notifications : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    errors: errors.length > 0 ? errors : undefined,
  };
};

/**
 * Check JavaScript/TypeScript files
 */
async function checkJavaScript(filePath, notifications, warnings, errors) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for console.log statements
  const consoleLogs = (content.match(/console\.log\(/g) || []).length;
  if (consoleLogs > 0) {
    warnings.push(`⚠️  Found ${consoleLogs} console.log statement(s) in ${path.basename(filePath)}`);
  }

  // Check for TODO/FIXME
  const todos = (content.match(/\/\/\s*(TODO|FIXME)/g) || []).length;
  if (todos > 0) {
    notifications.push(`📝 Found ${todos} TODO/FIXME comment(s) in ${path.basename(filePath)}`);
  }

  // Try to run ESLint if available
  try {
    execSync(`npx eslint --quiet "${filePath}"`, { encoding: 'utf-8', stdio: 'pipe' });
    notifications.push(`✅ ESLint: ${path.basename(filePath)} passed`);
  } catch (error) {
    // ESLint found issues or not installed
    if (error.stdout && error.stdout.length > 0) {
      const issueCount = (error.stdout.match(/error/g) || []).length;
      if (issueCount > 0) {
        warnings.push(`⚠️  ESLint found ${issueCount} issue(s) in ${path.basename(filePath)}`);
      }
    }
  }

  // Check for long functions (basic heuristic)
  const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*\{/g) || [];
  for (const func of functions) {
    const funcStart = content.indexOf(func);
    const funcBody = content.slice(funcStart);
    const lines = funcBody.split('\n').slice(0, 100).join('\n');
    const braceCount = (lines.match(/\{/g) || []).length - (lines.match(/\}/g) || []).length;

    if (lines.split('\n').length > 100 && braceCount === 0) {
      warnings.push(`Potentially long function detected in ${path.basename(filePath)}`);
      break; // Only warn once per file
    }
  }
}

/**
 * Check Python files
 */
async function checkPython(filePath, notifications, warnings, errors) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for print statements (potential debug code)
  const prints = (content.match(/print\(/g) || []).length;
  if (prints > 0) {
    warnings.push(`Found ${prints} print statement(s) in ${path.basename(filePath)}`);
  }

  // Try to run pylint if available
  try {
    execSync(`pylint --errors-only "${filePath}"`, { encoding: 'utf-8', stdio: 'pipe' });
    notifications.push(`✅ Pylint: ${path.basename(filePath)} passed`);
  } catch (error) {
    // Pylint found issues or not installed
    if (error.stdout && error.stdout.length > 0) {
      warnings.push(`Pylint found issues in ${path.basename(filePath)}`);
    }
  }
}

/**
 * Check if file is a test file
 */
function isTestFile(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  return fileName.includes('.test.') ||
         fileName.includes('.spec.') ||
         fileName.includes('_test.') ||
         fileName.startsWith('test_') ||
         filePath.includes('/tests/') ||
         filePath.includes('/test/') ||
         filePath.includes('/__tests__/');
}

/**
 * Check if file is a source file (not config, docs, etc.)
 */
function isSourceFile(filePath) {
  const ext = path.extname(filePath);
  const sourceExts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs', '.rb', '.php'];
  return sourceExts.includes(ext) && !isTestFile(filePath);
}

/**
 * Get the expected test file path for a source file
 */
function getTestFilePath(filePath) {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);

  // Try common test file patterns
  const patterns = [
    path.join(dirName, `${baseName}.test${ext}`),
    path.join(dirName, `${baseName}.spec${ext}`),
    path.join(dirName, '__tests__', `${baseName}.test${ext}`),
    path.join(dirName, '..', 'tests', `${baseName}.test${ext}`),
  ];

  // Return first pattern (most common)
  return patterns[0];
}
