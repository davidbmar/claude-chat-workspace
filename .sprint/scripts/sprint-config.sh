#!/usr/bin/env bash
# Bridge — source the canonical config from .sprint/config.sh
SCRIPT_DIR_BRIDGE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
source "${SCRIPT_DIR_BRIDGE}/../config.sh"
