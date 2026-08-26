# Secure Production Deployment Setup

Production deployment is intentionally blocked until these GitHub Actions secrets are configured. Do not restore password-based SSH deployment.

## Required GitHub Secrets

- `SSH_HOST`: production server hostname or IP address
- `SSH_PORT`: production SSH port
- `SSH_USER`: restricted deployment user
- `SSH_PRIVATE_KEY`: dedicated ED25519 private key for the deployment user
- `SSH_KNOWN_HOSTS`: the verified `known_hosts` line for that exact host and port

## One-Time Host Setup

1. Rotate the previously exposed hosting password immediately.
2. Create a dedicated, non-personal deployment user with the minimum permissions needed for this application.
3. Generate a new ED25519 key pair locally. Put only the public key in that user's `~/.ssh/authorized_keys` on the server.
4. Verify the server host key out-of-band with the hosting provider, then save the verified `known_hosts` entry as `SSH_KNOWN_HOSTS`.
5. Save the private key only in GitHub Actions as `SSH_PRIVATE_KEY`; never place it in the repository, `.env`, or a local script.
6. Use the `workflow_dispatch` workflow with `deploy=true` only after the CI checks have passed and a release has been explicitly approved.

## Release Safety

- A push to `main` runs verification only and cannot deploy production.
- Missing secrets cause the manually requested deployment to fail closed.
- SSH uses key authentication, batch mode, and strict host-key verification.
