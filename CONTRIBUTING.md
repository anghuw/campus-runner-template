# Contributing to Campus Runner

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

- Check [existing issues](https://github.com/anghuw/campus-runner-template/issues) first
- Use the **Bug Report** issue template
- Include steps to reproduce, expected behavior, and screenshots if applicable

### Suggesting Features

- Use the **Feature Request** issue template
- Explain the use case and why it would be valuable

### Submitting Code

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and ensure they follow the existing code style
4. **Run type checking**:
   ```bash
   npm run type-check
   ```
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push** to your fork and open a **Pull Request**

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `chore:` — maintenance tasks
- `refactor:` — code refactoring
- `style:` — formatting, missing semicolons, etc.
- `test:` — adding or updating tests

### Code Style

- TypeScript with strict mode
- Functional components with hooks
- Use the existing UI patterns (colors, spacing, typography)

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/campus-runner-template.git
cd campus-runner-template

# Install dependencies
npm install

# Start Expo
npm start
```

## Questions?

Open a discussion in the [Issues](https://github.com/anghuw/campus-runner-template/issues) section.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
