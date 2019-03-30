#!/bin/bash
apollo-codegen introspect-schema http://localhost:3050/api --output schema.json
apollo-codegen generate ./queries/*.ts --schema schema.json --target typescript --output operation-result-types.ts

cp ./queries/* ../../../api/__tests__/graphql/
cp operation-result-types.ts ../../../api/__tests__/graphql/ 