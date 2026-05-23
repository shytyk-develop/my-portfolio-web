export const workflowSteps = [
  {
    id: 'discover',
    phase: '01',
    title: 'DISCOVER',
    subtitle: 'Requirements & constraints',
    detail:
      'Map business rules, data flows, and failure modes before writing code. Define API contracts and acceptance criteria early.',
    tags: ['Stakeholder sync', 'OpenAPI draft', 'Risk log'],
  },
  {
    id: 'design',
    phase: '02',
    title: 'DESIGN',
    subtitle: 'Architecture & data model',
    detail:
      'Choose async boundaries, persistence strategy, and observability hooks. Favor modular monoliths until scale demands split.',
    tags: ['ERD / migrations', 'Caching plan', 'Auth model'],
  },
  {
    id: 'build',
    phase: '03',
    title: 'BUILD',
    subtitle: 'Implementation & review',
    detail:
      'Ship typed Python services with Pydantic validation, structured logging, and focused PRs. Automate linting and tests in CI.',
    tags: ['FastAPI routes', 'Pytest', 'Code review'],
  },
  {
    id: 'ship',
    phase: '04',
    title: 'SHIP',
    subtitle: 'Deploy & observe',
    detail:
      'Containerize, run health checks, and monitor latency/error budgets. Iterate from production signals—not assumptions.',
    tags: ['Docker', 'Health endpoints', 'Rollback plan'],
  },
];
