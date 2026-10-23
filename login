curl -c cookies.txt -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"username":"john","password":"password123"}'
{"message":"Login successful!"}
