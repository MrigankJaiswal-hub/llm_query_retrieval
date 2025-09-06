curl -X POST https://your-deployment-url/api/v1/hackrx/run \
  -H "Authorization: Bearer 2c83d62bd7f13e929bcffb25b8861087ab3fd8ddd5f536df4721c4d455923695" \
  -H "Content-Type: application/json" \
  -d '{
    "documents": "https://hackrx.blob.core.windows.net/assets/policy.pdf",
    "questions": [
      "Does this policy cover knee surgery, and what are the conditions?"
    ]
  }'