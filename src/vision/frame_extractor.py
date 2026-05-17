"""Frame extraction helpers for VLM-based skating review."""

from __future__ import annotations

import base64
from pathlib import Path
from typing import Any

import cv2


def extract_window_frames(
    video_path: str | Path,
    *,
    start_time: float,
    end_time: float,
    padding_seconds: float = 0.75,
    max_frames: int = 6,
    max_dimension: int | None = None,
    jpeg_quality: int = 75,
) -> dict[str, Any]:
    """Extract representative frames for a planned element window."""

    video_path = Path(video_path)
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise ValueError(f"Unable to open video: {video_path}")

    try:
        fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        if fps <= 0 or frame_count <= 0:
            raise ValueError("Could not determine video FPS or frame count.")

        duration = frame_count / fps
        padded_start = max(0.0, start_time - padding_seconds)
        padded_end = min(duration, end_time + padding_seconds)
        sample_times = _sample_times(
            start_time=padded_start,
            end_time=padded_end,
            max_frames=max_frames,
        )

        frames = []
        for sample_time in sample_times:
            frame_index = min(frame_count - 1, max(0, int(round(sample_time * fps))))
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
            ok, frame = cap.read()
            if not ok:
                continue

            encoded, encoded_size = _encode_frame_to_data_url(
                frame,
                max_dimension=max_dimension,
                jpeg_quality=jpeg_quality,
            )
            frames.append(
                {
                    "timestamp_seconds": round(frame_index / fps, 3),
                    "frame_index": frame_index,
                    "image_data_url": encoded,
                    "image_size": encoded_size,
                }
            )

        return {
            "video_path": str(video_path),
            "fps": round(fps, 3),
            "duration_seconds": round(duration, 3),
            "window_start": round(padded_start, 3),
            "window_end": round(padded_end, 3),
            "frames": frames,
        }
    finally:
        cap.release()


def _sample_times(*, start_time: float, end_time: float, max_frames: int) -> list[float]:
    if max_frames <= 1 or end_time <= start_time:
        return [start_time]

    span = end_time - start_time
    step = span / (max_frames - 1)
    return [start_time + (step * index) for index in range(max_frames)]


def _encode_frame_to_data_url(
    frame_bgr: Any,
    *,
    max_dimension: int | None,
    jpeg_quality: int,
) -> tuple[str, dict[str, int]]:
    resized = _resize_frame(frame_bgr, max_dimension=max_dimension)
    success, buffer = cv2.imencode(
        ".jpg",
        resized,
        [int(cv2.IMWRITE_JPEG_QUALITY), int(jpeg_quality)],
    )
    if not success:
        raise ValueError("Could not encode frame to JPEG.")

    encoded = base64.b64encode(buffer.tobytes()).decode("utf-8")
    height, width = resized.shape[:2]
    return (
        f"data:image/jpeg;base64,{encoded}",
        {
            "width": int(width),
            "height": int(height),
        },
    )


def _resize_frame(frame_bgr: Any, *, max_dimension: int | None) -> Any:
    if not max_dimension or max_dimension <= 0:
        return frame_bgr

    height, width = frame_bgr.shape[:2]
    largest_dimension = max(height, width)
    if largest_dimension <= max_dimension:
        return frame_bgr

    scale = max_dimension / float(largest_dimension)
    new_width = max(1, int(round(width * scale)))
    new_height = max(1, int(round(height * scale)))
    return cv2.resize(frame_bgr, (new_width, new_height), interpolation=cv2.INTER_AREA)
