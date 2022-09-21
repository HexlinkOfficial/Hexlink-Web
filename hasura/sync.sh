#!/bin/bash

hasura metadata export --admin-secret $HASURA_GRAPHQL_ADMIN_SECRET --endpoint $HASURA_GRAPHQL_ENDPOINT
