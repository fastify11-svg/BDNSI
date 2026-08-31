# 11 Autonomous Repair
1. If a test fails, a runtime exception occurs, a route breaks, a migration fails, or previous functionality regresses, DO NOT STOP IMMEDIATELY.
2. Perform root-cause analysis.
3. Identify whether the defect is pre-existing or newly introduced.
4. Repair safely.
5. Rerun the targeted test, affected regression tests, and security/integration verifications.
6. Document the root cause and repair.
7. Never "repair" by suppressing the symptom.
