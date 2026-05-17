# SkateSync AI

This repository currently contains:

- the React frontend prototype
- an OpenAI-based voice coaching pipeline under `src/voice`
- an OpenAI VLM-based planned-vs-actual video review pipeline under `src/vision`

## Set the API key

PowerShell:

```powershell
$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

## Voice quick start

Install voice dependencies:

```bash
pip install -r src/voice/requirements.txt
```

Run cue generation with an existing plan:

```bash
python -m src.voice "C:\path\to\your-music-file.mp3" --plan "src/voice/examples/planned_elements.sample.json" --output-dir "src/voice/output/demo"
```

Generate TTS clips too:

```bash
python -m src.voice "C:\path\to\your-music-file.mp3" --plan "src/voice/examples/planned_elements.sample.json" --include-tts --output-dir "src/voice/output/demo_tts"
```

Mix the cue clips back over the music:

```bash
python -m src.voice "C:\path\to\your-music-file.mp3" --plan "src/voice/examples/planned_elements.sample.json" --include-tts --mix-audio --output-dir "src/voice/output/demo_mix"
```

## Vision quick start

Install vision dependencies:

```bash
pip install -r src/vision/requirements.txt
```

Run the review on a video and planned element list:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json --quality low --language Turkish
```

Write the result to a file:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json --output review_result.json
```

Enable OpenAI-generated coaching text:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json --quality high --include-llm-feedback --language Turkish
```

## Notes

- Both pipelines use planned movement timelines rather than automatic full movement classification.
- Voice uses the same movement vocabulary style as vision, but the knowledge folders are still separate in this integration branch.
- Vision scores are MVP training metrics, not official judging scores.
- `src/voice` is optimized for movement planning, short coaching cues, and optional TTS.
- `src/vision` is optimized for frame-based review and deterministic scoring.
