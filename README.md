# pod balancer

This script retrieves orders for credentials on legacy worker, and sorts them into 'buckets'. This is so they can be evenly divided between pods to ensure processing times are even.

## installation

```
npm i
```

## usage

```
npx ts-node --esm ./src/main.ts
```