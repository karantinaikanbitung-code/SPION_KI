#!/usr/bin/env node
// Script to upload/replace a file in the repository using GitHub API
// Usage:
//   npm install @octokit/rest
//   GITHUB_TOKEN=... node scripts/upload-to-github.js --file ./pdfs/myfile.pdf --targetPath "pdfs/myfile.pdf" --message "Update file"

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

function usage() {
  console.log('Usage: node scripts/upload-to-github.js --file <localPath> [--targetPath <repo/path>] [--message <commit-message>] [--branch <branch>] [--repo <owner/repo>]');
  process.exit(1);
}

const argv = require('minimist')(process.argv.slice(2));
if (!argv.file) usage();

const filePath = path.resolve(argv.file);
const targetPath = argv.targetPath || `pdfs/${path.basename(filePath)}`;
const message = argv.message || `Update file: ${path.basename(filePath)}`;
const branch = argv.branch || 'main';

const repoArg = argv.repo || process.env.GITHUB_REPOSITORY || '';
if (!repoArg.includes('/')) {
  console.error('Repository must be specified as owner/repo via --repo or env GITHUB_REPOSITORY');
  process.exit(1);
}
const [owner, repo] = repoArg.split('/');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN env var is required (give repo write permissions).');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath);
const base64 = content.toString('base64');

(async () => {
  const octokit = new Octokit({ auth: token });

  try {
    // Check if file exists to get sha
    let sha = undefined;
    try {
      const resp = await octokit.repos.getContent({ owner, repo, path: targetPath, ref: branch });
      sha = resp.data.sha;
      console.log('Existing file found (sha)', sha);
    } catch (e) {
      // If not found it's fine — we will create it
      if (e.status === 404) {
        console.log('No existing file — will create new file at', targetPath);
      } else {
        throw e;
      }
    }

    const res = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: targetPath,
      message,
      content: base64,
      sha,
      branch
    });

    console.log('File uploaded ok. Commit:', res.data.commit && res.data.commit.sha);
  } catch (err) {
    console.error('Upload failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
