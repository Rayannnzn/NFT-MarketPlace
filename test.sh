curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer TEST_API_KEY:08f6bf75dd34894bab5d16844bdde993:743f49590eaf3c155502886b13ddc008' \
  --data '
{
  "idempotencyKey": "fb1f61c0-4a87-43b1-85a3-1ec22238fa96",
  "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "chain": "ETH-SEPOLIA"
}
'