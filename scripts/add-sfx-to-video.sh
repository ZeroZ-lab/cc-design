#!/usr/bin/env bash
# Mix SFX timeline + optional BGM into an MP4 video.
#
# Usage:
#   bash add-sfx-to-video.sh <input.mp4> <sfx-timeline.json> [--music=<bgm.mp3>] [--out=<path>]
#
# sfx-timeline.json format:
#   [{"src":"assets/sfx/keyboard/type.mp3","time":1.0,"volume":0.8}, ...]
#
# Behavior:
#   - Each SFX aligned to its cue time via adelay
#   - All SFX merged via amix (normalize=0 preserves dynamic range)
#   - Optional BGM with frequency isolation (lowpass 4kHz for BGM, highpass 800Hz for SFX)
#   - BGM: 0.3s fade in + 1.5s fade out
#   - Output: AAC 192k, video stream copied
#
# Examples:
#   bash add-sfx-to-video.sh demo.mp4 cues.json
#   bash add-sfx-to-video.sh demo.mp4 cues.json --music=assets/bgm-tech.mp3
#   bash add-sfx-to-video.sh demo.mp4 cues.json --music=assets/bgm-tech.mp3 --out=final.mp4
#
set -euo pipefail

# ── Dependency check ────────────────────────────────────────────────────
for cmd in ffmpeg ffprobe jq awk; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "✗ Required command not found: $cmd" >&2
    exit 1
  fi
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/../assets"

# ── Help ────────────────────────────────────────────────────────────────
show_help() {
  cat <<'HELP'
add-sfx-to-video.sh — Mix SFX timeline + optional BGM into an MP4 video

Usage:
  bash add-sfx-to-video.sh <input.mp4> <sfx-timeline.json> [options]

Arguments:
  input.mp4            Input video file
  sfx-timeline.json    JSON array of SFX cues

Options:
  --music=<path>       Optional BGM track (e.g. assets/bgm-tech.mp3)
  --bgm-volume=<val>   BGM volume 0-1 (default: 0.45)
  --out=<path>         Output path (default: <input>-sfx.mp4)
  --help               Show this help

sfx-timeline.json format:
  [
    {"src": "assets/sfx/keyboard/type.mp3", "time": 1.0, "volume": 0.8},
    {"src": "assets/sfx/ui/click.mp3", "time": 2.5}
  ]

  Required fields: src, time
  Optional fields: volume (default: 1.0)
HELP
}

# ── Parse args ──────────────────────────────────────────────────────────
INPUT=""
TIMELINE=""
MUSIC=""
BGM_VOLUME="0.45"
OUTPUT=""
POSITIONAL=()

for arg in "$@"; do
  case "$arg" in
    --help|-h) show_help; exit 0 ;;
    --music=*)      MUSIC="${arg#*=}" ;;
    --bgm-volume=*) BGM_VOLUME="${arg#*=}" ;;
    --out=*)        OUTPUT="${arg#*=}" ;;
    *)              POSITIONAL+=("$arg") ;;
  esac
done

INPUT="${POSITIONAL[0]:-}"
TIMELINE="${POSITIONAL[1]:-}"

# ── Validate inputs ────────────────────────────────────────────────────
if [ -z "$INPUT" ] || [ -z "$TIMELINE" ]; then
  echo "Usage: bash add-sfx-to-video.sh <input.mp4> <sfx-timeline.json> [--music=<bgm>] [--out=<path>]" >&2
  echo "Run with --help for details." >&2
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "✗ Input video not found: $INPUT" >&2
  exit 1
fi

if [ ! -f "$TIMELINE" ]; then
  echo "✗ Timeline JSON not found: $TIMELINE" >&2
  exit 1
fi

# Validate JSON is parseable
if ! jq empty "$TIMELINE" 2>/dev/null; then
  echo "✗ Invalid JSON in timeline file: $TIMELINE" >&2
  exit 1
fi

# Validate BGM volume
if ! awk "BEGIN { v=$BGM_VOLUME+0; exit !(v >= 0 && v <= 1) }"; then
  echo "✗ BGM volume must be 0-1, got: $BGM_VOLUME" >&2
  exit 1
fi

# ── Resolve output path ────────────────────────────────────────────────
INPUT_DIR="$(cd "$(dirname "$INPUT")" && pwd)"
INPUT_NAME="$(basename "$INPUT" .mp4)"
[ -z "$OUTPUT" ] && OUTPUT="$INPUT_DIR/$INPUT_NAME-sfx.mp4"

# ── Measure video duration ─────────────────────────────────────────────
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT")
if [ -z "$DURATION" ]; then
  echo "✗ Could not read video duration" >&2
  exit 1
fi

# ── Read and validate SFX cues ─────────────────────────────────────────
CUE_COUNT=$(jq 'length' "$TIMELINE")
if [ "$CUE_COUNT" -eq 0 ]; then
  echo "⚠ No SFX cues in timeline — outputting with BGM only (if provided)" >&2
fi

# Build validated cue list (skip invalid entries with warnings)
VALID_CUES=()
for i in $(seq 0 $((CUE_COUNT - 1))); do
  SRC=$(jq -r ".[$i].src // empty" "$TIMELINE")
  TIME=$(jq -r ".[$i].time // empty" "$TIMELINE")
  VOL=$(jq -r ".[$i].volume // 1.0" "$TIMELINE")

  # Validate src path
  if [ -z "$SRC" ]; then
    echo "⚠ Cue #$i: missing 'src' field — skipping" >&2
    continue
  fi
  if ! echo "$SRC" | grep -qE '^assets/(sfx|bgm)/.+\.mp3$'; then
    echo "⚠ Cue #$i: invalid src path '$SRC' (must match assets/sfx/...mp3 or assets/bgm/...mp3) — skipping" >&2
    continue
  fi

  # Validate time
  if [ -z "$TIME" ]; then
    echo "⚠ Cue #$i: missing 'time' field — skipping" >&2
    continue
  fi
  if ! echo "$TIME" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
    echo "⚠ Cue #$i: invalid time '$TIME' (must be a number) — skipping" >&2
    continue
  fi

  # Check file exists (resolve relative to script dir)
  FULL_PATH="$SCRIPT_DIR/../$SRC"
  if [ ! -f "$FULL_PATH" ]; then
    echo "⚠ Cue #$i: file not found '$SRC' — skipping" >&2
    continue
  fi

  VALID_CUES+=("$i|$FULL_PATH|$TIME|$VOL")
done

if [ "${#VALID_CUES[@]}" -eq 0 ] && [ -z "$MUSIC" ]; then
  echo "✗ No valid SFX cues and no BGM provided — nothing to mix" >&2
  exit 1
fi

# ── Build ffmpeg command ───────────────────────────────────────────────
echo "▸ Mixing audio into video"
echo "  input:    $INPUT"
echo "  timeline: $TIMELINE (${#VALID_CUES[@]} valid cues)"
echo "  duration: ${DURATION}s"
if [ -n "$MUSIC" ]; then
  echo "  bgm:      $MUSIC (volume: $BGM_VOLUME)"
fi
echo "  output:   $OUTPUT"

# Input array: always start with video
INPUT_ARGS=(-i "$INPUT")

# Filter complex building blocks
FILTER_PARTS=()
MIX_INPUTS=()
INPUT_IDX=1  # 0 = video, 1+ = audio inputs

# Add each SFX as a delayed input
for cue in "${VALID_CUES[@]}"; do
  IFS='|' read -r _ path time vol <<< "$cue"
  DELAY_MS=$(awk "BEGIN { printf \"%.0f\", $time * 1000 }")

  INPUT_ARGS+=(-i "$path")

  # Apply delay and volume per cue
  LABEL="s${INPUT_IDX}"
  FILTER_PARTS+=("[${INPUT_IDX}:a]adelay=${DELAY_MS}|${DELAY_MS},volume=${vol}[${LABEL}]")
  MIX_INPUTS+=("[${LABEL}]")
  INPUT_IDX=$((INPUT_IDX + 1))
done

# Add BGM if provided
HAS_BGM=false
if [ -n "$MUSIC" ]; then
  if [ ! -f "$MUSIC" ]; then
    echo "✗ BGM file not found: $MUSIC" >&2
    exit 1
  fi
  HAS_BGM=true

  INPUT_ARGS+=(-i "$MUSIC")

  FADE_OUT_START=$(awk "BEGIN { d = $DURATION - 1.5; if (d < 0) d = 0; print d }")

  BGM_LABEL="bgm"
  FILTER_PARTS+=("[${INPUT_IDX}:a]atrim=0:${DURATION},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.3,afade=t=out:st=${FADE_OUT_START}:d=1.5,lowpass=f=4000,volume=${BGM_VOLUME}[${BGM_LABEL}]")
  MIX_INPUTS+=("[${BGM_LABEL}]")
  INPUT_IDX=$((INPUT_IDX + 1))
fi

# Build the amix filter
MIX_COUNT="${#MIX_INPUTS[@]}"
if [ "$MIX_COUNT" -eq 1 ]; then
  # Single source — just use it directly (no amix needed)
  FINAL_LABEL="${MIX_INPUTS[0]}"
  # Remove the brackets for the -map
  FINAL_LABEL="${FINAL_LABEL#\[}"
  FINAL_LABEL="${FINAL_LABEL%\]}"
else
  # Multiple sources — apply highpass to SFX, then amix
  HPASS_INPUTS=()
  for i in "${!MIX_INPUTS[@]}"; do
    LABEL="${MIX_INPUTS[$i]}"
    LABEL_CLEAN="${LABEL#\[}"
    LABEL_CLEAN="${LABEL_CLEAN%\]}"

    # Only apply highpass to SFX (not BGM)
    if [ "$LABEL" = "[bgm]" ]; then
      HPASS_INPUTS+=("$LABEL")
    else
      HP_LABEL="h${i}"
      FILTER_PARTS+=("[${LABEL_CLEAN}]highpass=f=800[${HP_LABEL}]")
      HPASS_INPUTS+=("[${HP_LABEL}]")
    fi
  done

  FINAL_LABEL="amix_out"
  FILTER_PARTS+=("$(IFS=''; echo "${HPASS_INPUTS[*]}")amix=inputs=${MIX_COUNT}:duration=longest:normalize=0[${FINAL_LABEL}]")
fi

# Assemble the full filter_complex string
FILTER_COMPLEX=""
for part in "${FILTER_PARTS[@]}"; do
  FILTER_COMPLEX+="${part};"
done
FILTER_COMPLEX="${FILTER_COMPLEX%;}"

# Run ffmpeg
if [ "$MIX_COUNT" -le 1 ] && [ "$HAS_BGM" = false ]; then
  # Only SFX cues (no BGM) — apply highpass + amix if multiple, or just delay if single
  if [ "$MIX_COUNT" -eq 0 ]; then
    # No cues either — just copy
    ffmpeg -y -loglevel error \
      -i "$INPUT" \
      -c:v copy -c:a copy \
      "$OUTPUT"
  else
    ffmpeg -y -loglevel error \
      "${INPUT_ARGS[@]}" \
      -filter_complex "$FILTER_COMPLEX" \
      -map 0:v -map "[${FINAL_LABEL}]" \
      -c:v copy -c:a aac -b:a 192k -shortest \
      "$OUTPUT"
  fi
else
  ffmpeg -y -loglevel error \
    "${INPUT_ARGS[@]}" \
    -filter_complex "$FILTER_COMPLEX" \
    -map 0:v -map "[${FINAL_LABEL}]" \
    -c:v copy -c:a aac -b:a 192k -shortest \
    "$OUTPUT"
fi

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "✓ Done: $OUTPUT ($SIZE)"
