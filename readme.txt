realtime-order-tracking/
├── backend-springboot/
│   ├── src/
│   └── Dockerfile (optional)
├── frontend-react/
│   ├── public/
│   ├── src/
│   └── package.json
└── docker-compose.yml (for Kafka, Zookeeper)





✅ Backend
🔐 JWT Authentication (token generation + validation)

🛢 MySQL Database persistence via JPA

🐳 Docker Compose with:

Kafka + Zookeeper

MySQL

Spring Boot App


✅ Frontend
📝 Order form now posts to /order

📦 Dockerized frontend for full-stack deployment





Run from backend-springboot root:

bash
Copy
Edit
docker-compose up --build
Access:

React App: http://localhost:3000

Backend: http://localhost:8080

MySQL: localhost:3306 (user: root, pass: root)

