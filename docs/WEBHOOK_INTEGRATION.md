# [DEPRECATED] Integrating with NOVARIC<sup>®</sup> Fact-Check API via Webhook

**This webhook endpoint (`/api/verifyClaim`) is deprecated and no longer functional. The application has been updated to call the Gemini API directly from the frontend. This document is retained for historical purposes only.**

---

This document provides instructions for developers who wish to integrate their external tools, applications, or services (such as chatbots or other content platforms) with the NOVARIC<sup>®</sup> AI-Powered News Fact-Check API.

## Tool Metadata Summary

For platforms that support structured tool definitions (like AI agent builders), you can use the following summary:

-   **Tool Name:** `verifyClaim`
-   **Description:** Verifies the factual accuracy of user-submitted claims using NOVARIC<sup>®</sup> AI Fact-Check API.

## Webhook Configuration

- **Method:** `POST`
- **Endpoint URL:** `https://novaric-news-api.azurewebsites.net/api/verifyClaim`

### Request Headers:
```json
{
  "Content-Type": "application/json"
}
```

### Request Body:
```json
{
  "claim": "${inputs.claim}"
}
```

### Example Tool Invocation (for AI Agents)

This shows how an AI agent might be prompted to use the tool.

```
User says: "${claim}"

Tool call:
  call verifyClaim with claim = "${claim}"
```

### Successful Response

If the request is successful, the API will respond with a `200 OK` status and a JSON object containing the analysis.

**Response Body Example:**
```json
{
  "originalClaim": "Një studim i ri tregon se konsumimi i çokollatës çdo ditë përmirëson kujtesën.",
  "summary": "Analiza e burimeve tregon se ndërsa disa komponentë të kakaos mund të kenë përfitime konjitive, pretendimi se çokollata 'përmirëson kujtesën' është një ekzagjerim. Shumica e studimeve tregojnë një efekt modest dhe theksojnë se çokollata komerciale përmban sasi të larta sheqeri që mund të kenë efekte negative.",
  "verdict": "Pjesërisht e Vërtetë",
  "sources": [
    {
      "uri": "https://www.health.harvard.edu/blog/cocoa-sweet-treat-for-the-brain-201502057673",
      "title": "Cocoa: a sweet treat for the brain? - Harvard Health"
    },
    {
      "uri": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5432604/",
      "title": "The effect of cocoa and chocolate consumption on cognitive function"
    }
  ]
}
```

### Error Handling

-   **400 Bad Request:** This will be returned if the `claim` field is missing or invalid in your request body.
-   **500 Internal Server Error:** This indicates an issue on our end, either with the AI service or the server itself.

By following these instructions, you can successfully integrate the power of NOVARIC<sup>®</sup>'s fact-checking into your own applications.