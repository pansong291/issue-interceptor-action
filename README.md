# Issue Interceptor Action

Intercept issues and comments based on regex matching.

## Inputs

### `test-regex`

* **_Required_**
* **_Example_** `"/foo|bar/i"` `"/\btest\.com\b/i"` `${{ secrets.REGEX_ISSUE_INTERCEPTOR }}`
* The regex expression to test title or body of the issue or comment.
* You can keep it in a secret then other bodies don't know what it is.

### `token`

* **_Default_** `${{ github.token }}`
* Github token.

### `title-override`

* **_Default_** `xxx`
* Reset the title of the issue.

### `body-override`

* **_Default_** `xxx`
* Reset the body of the issue or comment.

### `lock-reason`

* **_Default_** `spam`
* The reason for locking the issue conversation.

## Outputs


## Example usage

### close and lock issue when the content match the regex expression
```yaml
name: Lock Issue

on:
  issues:
    types: [opened, edited, reopened]

jobs:
  lock-issue:
    runs-on: ubuntu-latest
    steps:
      - name: lock issue
        uses: pansong291/issue-interceptor-action@v1.0
        with:
          test-regex: '/shite/i'
          token: ${{ secrets.GITHUB_TOKEN }}
          title-override: 'f*ck you'
          body-override: 'b*tch'
          lock-reason: 'spam'
```

### delete comment when the content match the regex expression
```yaml
name: Delete Comment

on:
  issue_comment:
    types: [created, edited]

jobs:
  delete-comment:
    runs-on: ubuntu-latest
    steps:
      - name: delete comment
        uses: pansong291/issue-interceptor-action@v1.0
        with:
          test-regex: '/shite/i'
          token: ${{ secrets.GITHUB_TOKEN }}
```

### both
```yaml
name: Lock Issue And Delete Comment

on:
  issues:
    types: [opened, edited, reopened]
  issue_comment:
    types: [created, edited]

jobs:
  lock-and-delete:
    runs-on: ubuntu-latest
    steps:
      - name: lock issue and delete comment
        uses: pansong291/issue-interceptor-action@v1.0
        with:
          test-regex: '/shite/i'
          token: ${{ secrets.GITHUB_TOKEN }}
          title-override: 'f*ck you'
          body-override: 'b*tch'
          lock-reason: 'spam'
```