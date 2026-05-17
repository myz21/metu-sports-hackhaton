# SkateSync AI Performance Review Contract

This document defines the JSON contract between the Python video-review module
and the frontend or backend layer that consumes its result.

## Input

`video_path`

- Local or server-side path to the athlete practice video.

`planned_elements`

```json
[
  {
    "name": "Sit Spin",
    "type": "spin",
    "start_time": 55.0,
    "end_time": 61.0,
    "music_peak_time": 55.0
  }
]
```

## Output shape

Top-level fields:

- `analysis_type`
- `video_path`
- `video_fps`
- `video_duration_seconds`
- `planned_element_count`
- `overall`
- `elements`
- optional `llm_feedback`

### `overall`

```json
{
  "overall_match_score": 78.4,
  "average_start_score": 74.2,
  "average_duration_score": 81.0,
  "average_stability_score": 76.5,
  "average_music_alignment_score": 83.8,
  "summary": "Element entries are mostly staying close to the planned timeline. Music-peak alignment is generally strong. Center control looks stable enough for an MVP training pass."
}
```

### `elements[]`

Each element contains:

- `name`
- `type`
- `planned_window`
- `actual_window`
- `scores`
- `timing_comparison`
- `motion_metrics`
- `local_feedback`
- `window_feedback`

Important fields for the frontend:

- `scores.execution_match_score`
- `scores.start_score`
- `scores.duration_score`
- `scores.stability_score`
- `scores.music_alignment_score`
- `timing_comparison.start_offset_seconds`
- `timing_comparison.duration_offset_seconds`
- `timing_comparison.timing_offset_seconds`
- `local_feedback.short_feedback`
- `local_feedback.next_action`
- `local_feedback.confidence_note`

### Optional `llm_feedback`

This is generated only when the OpenAI explanation layer is enabled.

```json
{
  "overall_summary": "The routine follows the planned structure reasonably well, but several element entries are still late.",
  "overall_coach_feedback": "The strongest quality in this run is music alignment. The main weakness is that some planned elements begin slightly after their intended musical moment.",
  "priority_actions": [
    "Prepare the sit spin entry earlier.",
    "Hold the final pose longer.",
    "Stabilize the landing line after the jump."
  ],
  "element_feedback": [
    {
      "name": "Sit Spin",
      "summary": "The spin is close to the planned musical accent but still begins late.",
      "timing_note": "You are entering this section after the intended peak.",
      "stability_note": "Center control is usable but can become cleaner.",
      "next_action": "Set the entry edge earlier and hold the center more firmly.",
      "confidence_note": "High-confidence analysis."
    }
  ]
}
```

## Example CLI

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json
```

With LLM explanation:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json ^
  --include-llm-feedback ^
  --api-key YOUR_OPENAI_API_KEY ^
  --language Turkish
```
