#!/bin/bash
apollo-codegen introspect-schema http://localhost:3050/api --output schema.json
apollo-codegen generate *.ts --schema schema.json --target typescript --output operation-result-types.ts