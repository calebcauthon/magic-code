# magic-code README

## Tests

```
npm run test-quick
```

## Features

Use chatGPT to suggest code changes.

## Requirements

Your own OpenAI API Key is required.

## Extension Settings

Add prompt options like this:
```
"magic-code.templates": {
    "SnarkyComments": "Add snarky in-line comments to the following javascript code.",
    "Uncle Bob": "Use long, descriptive names for each variable."
}
```