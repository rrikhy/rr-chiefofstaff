/**
 * Configuration Manager
 * Handles loading and validation of application configuration
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from '../utils/constants.js';

/**
 * Configuration Manager Class
 */
export class ConfigManager {
  constructor() {
    this.config = null;
  }

  /**
   * Load configuration from config.json
   * @returns {object} Configuration object
   * @throws {Error} If config file not found or invalid
   */
  loadConfig() {
    const configPath = path.join(process.cwd(), PATHS.CONFIG_FILE);

    if (!fs.existsSync(configPath)) {
      throw new Error(
        `Error: ${PATHS.CONFIG_FILE} not found!\nPlease copy ${PATHS.CONFIG_EXAMPLE} to ${PATHS.CONFIG_FILE} and configure it.`
      );
    }

    try {
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('Configuration loaded successfully');
      return this.config;
    } catch (error) {
      throw new Error(`Error loading ${PATHS.CONFIG_FILE}: ${error.message}`);
    }
  }

  /**
   * Get configuration value
   * @returns {object|null} Current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get default days setting from config
   * @returns {number} Default days to look back
   */
  getDefaultDays() {
    return this.config?.settings?.defaultDays || 7;
  }
}

/**
 * Validate environment variables
 * Supports: Direct Anthropic API or AWS Bedrock
 * @throws {Error} If required environment variables are missing
 */
export function validateEnvironment() {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasAwsBedrock = !!(process.env.AWS_REGION && (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE));

  if (!hasAnthropicKey && !hasAwsBedrock) {
    throw new Error(
      'Error: No Claude API configuration found!\n\n' +
      'Option 1: Direct Anthropic API\n' +
      '  Set ANTHROPIC_API_KEY in your .env file\n\n' +
      'Option 2: AWS Bedrock\n' +
      '  Set AWS_REGION and either:\n' +
      '  - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY, or\n' +
      '  - AWS_PROFILE (to use ~/.aws/credentials)\n' +
      '  Also run: npm install @anthropic-ai/bedrock-sdk'
    );
  }

  if (hasAwsBedrock) {
    console.log('Environment validated (AWS Bedrock)');
  } else {
    console.log('Environment validated');
  }
}
