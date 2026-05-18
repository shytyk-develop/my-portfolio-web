export const blueprintContent = {
  design: `<span class="code-comment"># System Architecture & Design Philosophy</span>
<span class="code-key">architecture_patterns</span>:
  <span class="code-key">core</span>: <span class="code-string">"Async-First RESTful APIs (FastAPI / Starlette)"</span>
  <span class="code-key">methodology</span>: <span class="code-string">"Domain-Driven Design (DDD) & Clean Architecture"</span>
  <span class="code-key">security</span>: <span class="code-string">"Security-by-Design (JWT, AES, Argon2, OWASP standards)"</span>

<span class="code-key">data_strategy</span>:
  <span class="code-key">relational</span>: <span class="code-string">"PostgreSQL with Async SQLAlchemy & Alembic"</span>
  <span class="code-key">caching</span>: <span class="code-string">"Redis for high-speed data retrieval and session management"</span>

<span class="code-key">philosophy</span>: <span class="code-string">"I focus on KISS and YAGNI principles. My goal is to build robust systems that are human-readable and machine-scalable."</span>`,

  maintain: `<span class="code-comment"># Code Reliability & Maintainability Standards</span>
<span class="code-key">code_quality</span>:
  <span class="code-key">static_analysis</span>: <span class="code-string">"Strict Mypy type-checking, Ruff & Flake8 linting"</span>
  <span class="code-key">data_integrity</span>: <span class="code-string">"Strict Schema Validation with Pydantic V2"</span>
  <span class="code-key">documentation</span>: <span class="code-string">"Self-documenting OpenAPI (Swagger) & technical specifications"</span>

<span class="code-key">stability</span>:
  <span class="code-key">testing</span>: <span class="code-string">"Pytest (Unit & Integration), Test-Driven approach (TDD)"</span>
  <span class="code-key">observability</span>: <span class="code-string">"Structured JSON Logging & Automated Health Monitoring"</span>

<span class="code-key">quality_gate</span>: <span class="code-string">"Applying SOLID and DRY principles to ensure long-term code support."</span>`,

  growth: `<span class="code-comment"># Scalability & Infrastructure Management</span>
<span class="code-key">performance</span>:
  <span class="code-key">scaling</span>: <span class="code-string">"Stateless Service Architecture (Horizontal Scaling ready)"</span>
  <span class="code-key">concurrency</span>: <span class="code-string">"Asynchronous Background Task Processing"</span>

<span class="code-key">infrastructure_as_code</span>:
  <span class="code-key">containerization</span>: <span class="code-string">"Docker & Docker Compose for environment parity"</span>
  <span class="code-key">ci_cd</span>: <span class="code-string">"GitHub Actions for automated testing and deployment"</span>

<span class="code-key">future_proofing</span>: <span class="code-string">"Designing DB schemas with indexing and partitioning in mind for High-Load potential."</span>`,
};
