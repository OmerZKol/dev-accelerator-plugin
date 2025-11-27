/**
 * On Prompt Submit Hook
 *
 * This hook runs before user prompts are sent to Claude.
 * It gives tips if the user is submitting a request that can be enhanced with commands.
 */

module.exports = async (context) => {
  const { prompt, files, metadata } = context;

  // Track prompt patterns for analytics
  const patterns = {
    codeReview: /review|check|analyze.*code/i,
    refactoring: /refactor|clean|improve/i,
    testing: /test|spec|coverage/i,
  };

  // Detect intent
  let detectedIntent = 'general';
  for (const [intent, pattern] of Object.entries(patterns)) {
    if (pattern.test(prompt)) {
      detectedIntent = intent;
      break;
    }
  }

  // Add helpful context for specific intents
  let enhancedPrompt = prompt;
  let suggestions = [];

  switch (detectedIntent) {
    case 'codeReview':
      suggestions.push('💡 Tip: Use /smart-review command for structured code review');
      suggestions.push('💡 Smart review checks for bugs, security issues, and best practices');
      break;

    case 'refactoring':
      suggestions.push('💡 Tip: The safe-refactoring skill ensures you refactor safely with tests');
      suggestions.push('💡 Remember: refactor in small steps, running tests after each change');
      break;

    case 'testing':
      suggestions.push('💡 Tip: Use /gen-tests command to generate comprehensive test suites');
      suggestions.push('💡 The test-generator subagent can autonomously create tests');
      break;
  }

  // console.log('Prompt submitted:', prompt);

  // Log analytics data
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    intent: detectedIntent,
    promptLength: prompt.length,
    filesContext: files.length,
  }));

  // Return enhanced context
  return {
    prompt: enhancedPrompt,
    metadata: {
      ...metadata,
      detectedIntent,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    },
  };
};
