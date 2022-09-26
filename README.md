# KSmigielski/pr-to-issue
This action connect PR to Issue by adding [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) at the end of PR description with Issue number extracted from las commit messages. In case when PR number will not be present in message, there will not be performed any action.

Supported form of Issue in message:
 - #123
 - \<owner>/\<repo>/#123

# Usage
```yaml
- uses: KSmigielski/pr-to-issue@v1
  with:
    token: ${{ secrets.CLI_TOKEN }}
```