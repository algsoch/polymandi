# PolyMandi - AI-Powered Multilingual Plastic Granules Marketplace

## Overview

PolyMandi is a comprehensive B2B/B2C marketplace platform for plastic granules trading in India. The platform features AI-powered recommendations, multilingual support (Hindi, English, Hinglish), and a modern cloud-native architecture.

## Architecture

- **Backend**: FastAPI with modular architecture
- **Frontend**: Static HTML/CSS/JS with Tailwind CSS
- **Database**: PostgreSQL with async SQLAlchemy
- **AI/ML**: LangChain with OpenAI/Ollama integration
- **Infrastructure**: Azure Container Apps, PostgreSQL, Redis, Storage, Key Vault
- **Deployment**: Azure Developer CLI (azd)

## Features

### Core Functionality

- ✅ Multilingual product catalog (Hindi/English/Hinglish)
- ✅ AI-powered chat assistant for product discovery
- ✅ Smart product recommendations
- ✅ Seller onboarding and product management
- ✅ Order management with payment integration (Razorpay)
- ✅ Real-time analytics and reporting
- ✅ Secure authentication and authorization

### Technical Features

- ✅ Modular FastAPI backend with async/await
- ✅ Complete database schema with relationships
- ✅ Dockerized microservices architecture
- ✅ Azure infrastructure as code (Bicep)
- ✅ Key Vault integration for secrets management
- ✅ Container Apps with auto-scaling
- ✅ Comprehensive API documentation

## Project Structure

```
PolyMandi/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database setup
│   │   ├── auth.py         # Authentication
│   │   └── main.py         # FastAPI app
│   ├── Dockerfile          # Container definition
│   └── requirements.txt    # Python dependencies
├── frontend/               # Static web app
│   ├── index.html         # Main UI
│   ├── styles.css         # Tailwind styles
│   ├── script.js          # Frontend logic
│   └── nginx.conf         # Nginx configuration
├── infra/                 # Azure infrastructure
│   ├── main.bicep         # Main infrastructure
│   ├── app.bicep          # Container app
│   ├── main.parameters.json
│   └── abbreviations.json
├── database/              # Database setup
│   ├── schema.sql         # Database schema
│   └── demo_data.sql      # Sample data
├── langchain_agent/       # AI agent
│   └── handler.py         # LangChain integration
├── azure.yaml             # AZD configuration
└── docker-compose.yml     # Local development
```

## Quick Start

### Prerequisites

- Azure subscription
- Azure Developer CLI (azd)
- Docker Desktop
- Python 3.9+
- Node.js (for frontend development)

### Local Development

1. **Clone and setup**:

   ```bash
   git clone <repository>
   cd PolyMandi
   cp .env.example .env
   # Edit .env with your configuration
   ```
2. **Start with Docker Compose**:

   ```bash
   docker-compose up -d
   ```
3. **Access the application**:

   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Azure Deployment

1. **Initialize AZD**:

   ```bash
   azd init
   azd auth login
   ```
2. **Set environment variables**:

   ```bash
   azd env set DATABASE_ADMIN_PASSWORD "your-secure-password"
   azd env set OPENAI_API_KEY "your-openai-key"
   azd env set RAZORPAY_KEY_ID "your-razorpay-key"
   azd env set RAZORPAY_KEY_SECRET "your-razorpay-secret"
   azd env set JWT_SECRET_KEY "your-jwt-secret"
   ```
3. **Deploy**:

   ```bash
   azd up
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

### Products

- `GET /api/v1/products/` - List products
- `POST /api/v1/products/search` - Search products
- `GET /api/v1/products/{id}` - Get product details

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/orders` - Order history

### Sellers

- `POST /api/v1/sellers/register` - Seller registration
- `GET /api/v1/sellers/products` - Seller products
- `POST /api/v1/sellers/products` - Create product

### Orders

- `POST /api/v1/orders/create` - Create order
- `GET /api/v1/orders/{id}` - Order details
- `POST /api/v1/orders/{id}/payment` - Payment

### Analytics

- `GET /api/v1/analytics/platform/overview` - Platform metrics
- `GET /api/v1/analytics/products/popular` - Popular products
- `GET /api/v1/analytics/sales/monthly` - Sales data

## Database Schema

### Core Tables

- **users**: User accounts and profiles
- **sellers**: Seller business information
- **products**: Product catalog with multilingual content
- **orders**: Order transactions
- **order_items**: Order line items
- **chat_messages**: AI chat history

### Key Features

- Multilingual product names and descriptions
- Comprehensive seller verification
- Order tracking and payment status
- AI chat message history
- Analytics and reporting data

## Environment Variables

### Required

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key
- `RAZORPAY_KEY_ID`: Payment gateway key
- `RAZORPAY_KEY_SECRET`: Payment gateway secret

### Optional

- `OPENAI_API_KEY`: For AI features
- `AZURE_STORAGE_ACCOUNT_NAME`: For file uploads
- `AZURE_KEY_VAULT_URL`: For secrets management
- `REDIS_URL`: For caching

## Security Features

- JWT-based authentication
- Azure Key Vault for secrets
- SQL injection prevention
- CORS configuration
- Rate limiting
- Input validation
- Secure password hashing

## Monitoring and Observability

- Application Insights integration
- Log Analytics workspace
- Container Apps monitoring
- Database performance metrics
- Custom analytics dashboard

## Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Voice assistant integration
- [ ] Advanced ML recommendations
- [ ] Logistics integration
- [ ] Multi-vendor marketplace
- [ ] Affiliate program
- [ ] Advanced analytics
- [ ] International expansion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- GitHub Issues: [Repository Issues](link)
- Email: support@polymandi.com
- Documentation: [Wiki](link)

---

Built with ❤️ for the Indian plastic industry
