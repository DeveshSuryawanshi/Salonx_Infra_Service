# Salonx_Infra_Service
This is a infrastructure service for common items for salon_x application

```
infra-service/
├── src/                              # Source code
│   ├── exports/                      # Exported modules for other services
│   │   ├── healthCheck.mjs           # Exports health-check functions
│   │   ├── metrics.mjs               # Exports metrics-related logic
│   │   ├── serviceDiscovery.mjs      # Exports service discovery utilities
│   │   ├── logging.mjs               # Exports logging setup and utilities
│   │   └── commonDBModels.mjs        # Exports common database models
│   │
│   ├── config/                       # Configuration files
│   │   ├── default.mjs               # Default configurations
│   │   ├── production.mjs            # Production-specific configurations
│   │   ├── development.mjs           # Development-specific configurations
│   │   └── index.mjs                 # Unified configuration loader
│   │
│   ├── services/                     # Core logic for infra services
│   │   ├── loadBalancerService.mjs   # Logic for load balancing requests
│   │   ├── discoveryService.mjs      # Service discovery implementation
│   │   ├── loggingService.mjs        # Centralized logging service logic
│   │   ├── metricsService.mjs        # Metrics collection and exposure
│   │   └── healthCheckService.mjs    # Health monitoring service logic
│   │
│   ├── auth/                         # Authentication and authorization logic
│   │   ├── jwt.mjs                   # JWT creation and verification logic
│   │   ├── hashPassword.mjs          # Password hashing utilities
│   │   ├── validateUser.mjs          # User validation logic
│   │   └── authUtils.mjs             # Helper methods for authentication
│   │
│   ├── middleware/                   # Middleware for request handling
│   │   ├── authMiddleware.mjs        # Middleware to enforce authentication
│   │   ├── errorHandler.mjs          # Middleware for centralized error handling
│   │   ├── rateLimiter.mjs           # Middleware for rate limiting
│   │   └── requestLogger.mjs         # Middleware to log incoming requests
│   │
│   ├── db/                           # Common database models and schema
│   │   ├── serviceRegistry.mjs       # Model for storing service registry data
│   │   ├── metrics.mjs               # Model for storing metrics data
│   │   ├── logs.mjs                  # Model for centralized logging
│   │   ├── user.mjs                  # Common user model
│   │   └── appointment.mjs           # Common appointment model
│   │
│   ├── utils/                        # Utility and helper functions
│   │   ├── dbConnection.mjs          # Database connection logic
│   │   ├── constants.mjs             # Constants used across the app
│   │   ├── helper.mjs                # Generic helper methods
│   │   └── validators.mjs            # Input validation logic
│   │
│   ├── logger/                       # Centralized logging setup
│   │   └── logger.mjs                # Configures logging (e.g., Winston/Pino)
│   │
│   └── index.mjs                     # Central export hub
│
├── tests/                            # Unit and integration tests
│   ├── exports/                      # Tests for exported modules
│   ├── services/                     # Tests for service logic
│   ├── auth/                         # Tests for authentication logic
│   ├── middleware/                   # Tests for middleware functions
│   └── utils/                        # Tests for utility functions
│
├── .github/workflows/                # GitHub Actions workflows for CI/CD
│   └── deploy.yml                    # Workflow for publishing to GitHub Packages
│
├── .npmrc                            # Customizes npm's behavior, including registry settings, authentication, and caching.
├── .gitignore                        # Files and directories to ignore in git
├── package.json                      # Project metadata and dependencies
├── package-lock.json                 # Exact dependency versions
├── README.md                         # Documentation for the infra service
├── Dockerfile                        # Dockerfile for containerization
└── docker-compose.yml                # Docker Compose file for local testing
```