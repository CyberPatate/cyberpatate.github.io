#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_PDF="${1:-${SCRIPT_DIR}/../user-guide.pdf}"

echo "=== Generating AlphaFloor EFB User Guide PDF ==="

# Check for pandoc
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is required to generate the PDF." >&2
    echo "Please install pandoc (e.g. brew install pandoc)." >&2
    exit 1
fi

# Detect PDF engine (prefer typst or xelatex, fallback to pdflatex, lualatex, weasyprint, or wkhtmltopdf)
PDF_ENGINE="${PDF_ENGINE:-}"
if [ -z "${PDF_ENGINE}" ]; then
    if command -v typst &> /dev/null; then
        PDF_ENGINE="typst"
    elif command -v xelatex &> /dev/null; then
        PDF_ENGINE="xelatex"
    elif command -v pdflatex &> /dev/null; then
        PDF_ENGINE="pdflatex"
    elif command -v lualatex &> /dev/null; then
        PDF_ENGINE="lualatex"
    elif command -v weasyprint &> /dev/null; then
        PDF_ENGINE="weasyprint"
    elif command -v wkhtmltopdf &> /dev/null; then
        PDF_ENGINE="wkhtmltopdf"
    else
        echo "Error: No suitable PDF engine found (typst, xelatex, pdflatex, or weasyprint)." >&2
        exit 1
    fi
fi

echo "Using PDF engine: ${PDF_ENGINE}"

mkdir -p "$(dirname "${OUTPUT_PDF}")"

# Ordered list of chapters
DOCS=(
    "${SCRIPT_DIR}/index.md"
    "${SCRIPT_DIR}/installation.md"
    "${SCRIPT_DIR}/licensing.md"
    "${SCRIPT_DIR}/interface.md"
    "${SCRIPT_DIR}/apps/simbrief.md"
    "${SCRIPT_DIR}/apps/takeoff-perf.md"
    "${SCRIPT_DIR}/apps/landing-perf.md"
    "${SCRIPT_DIR}/apps/weight-balance.md"
    "${SCRIPT_DIR}/apps/charts.md"
    "${SCRIPT_DIR}/apps/documents.md"
    "${SCRIPT_DIR}/apps/checklists.md"
    "${SCRIPT_DIR}/apps/aircraft-ground.md"
    "${SCRIPT_DIR}/apps/settings.md"
    "${SCRIPT_DIR}/troubleshooting.md"
)

EXTRA_ARGS=()
if [ "${PDF_ENGINE}" = "typst" ]; then
    # Typst requires hex color strings without leading hash for pandoc's template rgb(...) function
    EXTRA_ARGS=(
        -V linkcolor="0066cc"
    )
elif [ "${PDF_ENGINE}" = "xelatex" ] || [ "${PDF_ENGINE}" = "pdflatex" ] || [ "${PDF_ENGINE}" = "lualatex" ]; then
    EXTRA_ARGS=(
        -V geometry:margin=1in
        -V linkcolor=blue
        -V urlcolor=blue
        -V toccolor=black
    )
fi

pandoc "${DOCS[@]}" \
    --output="${OUTPUT_PDF}" \
    --pdf-engine="${PDF_ENGINE}" \
    --resource-path="${SCRIPT_DIR}:${SCRIPT_DIR}/apps" \
    --toc \
    --toc-depth=2 \
    --number-sections \
    --metadata title="AlphaFloor EFB Pilot User Guide" \
    --metadata subtitle="Modern Electronic Flight Bag for ToLiss Aircrafts in X-Plane 12" \
    --metadata author="CyberPatate" \
    --metadata date="$(date +'%B %Y')" \
    "${EXTRA_ARGS[@]}"

echo "=== Successfully generated: ${OUTPUT_PDF} ==="
