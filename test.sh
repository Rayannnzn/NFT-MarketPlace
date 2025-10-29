curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer TEST_API_KEY:e120d8cc4116e6568ce4ae5e5386ecc1:0b6c5e23b7fe165d7dc71f2972cf7ac0' \
  --data '
{
  "idempotencyKey": "86212444-edfa-4224-978d-a5865add4da2",
  "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "chain": "ETH-SEPOLIA"
}
'