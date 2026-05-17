# SkateSync AI

This repository currently contains:

- the React frontend prototype
- a Python MVP planned-vs-actual video review module

## Python performance review quick start

Install dependencies:

```bash
pip install -r src/vision/requirements.txt
```

Run the review on a video and planned element list:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json
```

By default, the CLI now uses the OpenAI VLM backend with local skating RAG.
Set your API key first:

```powershell
$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

Then run:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json --quality low --language Turkish
```

Write the result to a file:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json --output review_result.json
```

Enable OpenAI-generated coaching text:

```bash
python -m src.vision session.mp4 src/vision/examples/planned_elements.sample.json --quality high --include-llm-feedback --api-key YOUR_OPENAI_API_KEY --language Turkish
```

## Notes

- The system does not classify skating movements automatically.
- The planned movement list is treated as the source of truth.
- Scores are rule-based MVP training metrics, not official judging scores.
- The LLM layer only explains the rule-based output in human language.
- The vision pipeline is now VLM-only; the old MediaPipe path has been removed.
- `--quality low` is the cheaper/faster user-facing mode.
- `--quality high` is the richer/more expensive user-facing mode for demos and coach-facing reviews.
