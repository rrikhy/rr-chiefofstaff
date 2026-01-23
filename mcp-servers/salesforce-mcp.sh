#!/bin/bash
exec /usr/local/bin/npx -y @salesforce/mcp \
  --orgs=rrikhy@thousandeyes.com \
  --toolsets=all \
  --allow-non-ga-tools \
  --no-telemetry
